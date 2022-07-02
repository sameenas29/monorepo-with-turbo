const cp = require('child_process');
const path = require('path');
const os = require('os');

const NUMBER_OF_RUNS = 10;

function message(m) {
  console.log('------------------------');
  console.log(m);
  console.log('------------------------');
}

function cleanFolders() {
  //uncomment this to remove all artifacts after every run
  // cp.execSync(
  //   'rm -rf apps/crew/.next && rm -rf apps/flight-simulator/.next && rm -rf apps/navigation/.next && rm -rf apps/ticket-booking/.next && rm -rf apps/warp-drive-manager/.next'
  // );
}

function spawnSync(cmd, args) {
  return cp.spawnSync(
    path.join(
      '.',
      'node_modules',
      '.bin',
      os.platform() === 'win32' ? cmd + '.cmd' : cmd
    ),
    args,
    { stdio: 'inherit', env: { ...process.env, NX_TASKS_RUNNER_DYNAMIC_OUTPUT: 'false' } }
  );
}

message('prepping basic build');
// prep basic build
spawnSync('yarn', ['run', 'simpleBuild' ]);

message('prepping turbo');
// prep turbo
spawnSync('turbo', ['run', 'build', `--concurrency=3`]);
// appears to be a bug in turbo where it only caches some tasks on the second run
// let's run it twice to make sure turbo is able to cache everything :)
spawnSync('turbo', ['run', 'build', `--concurrency=3`]);

message('prepping nx');
// we don't have to run it twice :)
spawnSync('nx', ['run-many', '--target=build', '--all']);


message(`running basic build ${NUMBER_OF_RUNS} times`);
let buildTime = 0;
for (let i = 0; i < NUMBER_OF_RUNS; ++i) {
  cleanFolders();
  const b = new Date();
  spawnSync('yarn', ['workspaces', 'foreach', 'run', 'build' ]);
  const a = new Date();
  buildTime += a.getTime() - b.getTime();
  console.log(`The command ran in ${a.getTime() - b.getTime()}ms`);
}
const averageBasicBuildTime = buildTime / NUMBER_OF_RUNS;

message(`running turbo ${NUMBER_OF_RUNS} times`);
let turboTime = 0;
for (let i = 0; i < NUMBER_OF_RUNS; ++i) {
  cleanFolders();
  const b = new Date();
  spawnSync('turbo', ['run', 'build', `--concurrency=10`]);
  const a = new Date();
  turboTime += a.getTime() - b.getTime();
  console.log(`The command ran in ${a.getTime() - b.getTime()}ms`);
}
const averageTurboTime = turboTime / NUMBER_OF_RUNS;

message(`running nx ${NUMBER_OF_RUNS} times`);
let nxTime = 0;
for (let i = 0; i < NUMBER_OF_RUNS; ++i) {
  cleanFolders();
  const b = new Date();
  spawnSync('nx', ['run-many', '--target=build', '--all', '--parallel', 10]);
  const a = new Date();
  nxTime += a.getTime() - b.getTime();
  console.log(`The command ran in ${a.getTime() - b.getTime()}ms`);
}
const averageNxTime = nxTime / NUMBER_OF_RUNS;


message('results');
console.log(`average basic build time is: ${averageBasicBuildTime}`);
console.log(`average turbo time is: ${averageTurboTime}`);
console.log(`average nx time is: ${averageNxTime}`);

console.log(`nx is ${averageBasicBuildTime / averageNxTime}x faster than basic build`);
console.log(`nx is ${averageTurboTime / averageNxTime}x faster than turbo`);
