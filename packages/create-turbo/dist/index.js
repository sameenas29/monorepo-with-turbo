#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/index.ts
var path2 = __toESM(require("path"));
var import_execa = __toESM(require("execa"));
var import_fs_extra = __toESM(require("fs-extra"));
var import_inquirer = __toESM(require("inquirer"));
var import_ora = __toESM(require("ora"));
var import_meow = __toESM(require("meow"));
var import_lt = __toESM(require("semver/functions/lt"));
var import_gradient_string = __toESM(require("gradient-string"));
var import_update_check = __toESM(require("update-check"));
var import_chalk = __toESM(require("chalk"));

// package.json
var package_default = {
  name: "create-turbo",
  version: "1.2.17-canary.0",
  description: "Create a new Turborepo",
  homepage: "https://turborepo.org",
  license: "MPL-2.0",
  repository: {
    type: "git",
    url: "https://github.com/vercel/turborepo",
    directory: "create-turbo"
  },
  bugs: {
    url: "https://github.com/vercel/turborepo/issues"
  },
  bin: {
    "create-turbo": "dist/index.js"
  },
  scripts: {
    build: "tsup src/index.ts --format cjs",
    test: "jest",
    lint: "eslint src/**/*.ts"
  },
  dependencies: {
    chalk: "2.4.2",
    execa: "5.0.0",
    "fs-extra": "^10.0.0",
    "gradient-string": "^2.0.0",
    inquirer: "^8.0.0",
    meow: "^7.1.1",
    ora: "4.0.4",
    rimraf: "^3.0.2",
    semver: "^7.3.5",
    "update-check": "^1.5.4"
  },
  devDependencies: {
    "@types/chalk-animation": "^1.6.0",
    "@types/fs-extra": "^9.0.13",
    "@types/gradient-string": "^1.1.2",
    "@types/inquirer": "^7.3.1",
    "@types/jest": "^27.4.0",
    "@types/node": "^16.11.12",
    "@types/semver": "^7.3.9",
    eslint: "^7.23.0",
    jest: "^27.4.3",
    semver: "^7.3.5",
    "strip-ansi": "^6.0.1",
    "ts-jest": "^27.1.1",
    tsup: "^5.10.3",
    typescript: "^4.5.5"
  },
  files: [
    "dist",
    "templates"
  ]
};

// src/shouldUseYarn.ts
var import_child_process = require("child_process");
function shouldUseYarn() {
  try {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent && userAgent.startsWith("yarn")) {
      return true;
    }
    (0, import_child_process.execSync)("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

// src/shouldUsePnpm.ts
var import_child_process2 = require("child_process");
function shouldUsePnpm() {
  try {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent && userAgent.startsWith("pnpm")) {
      return true;
    }
    (0, import_child_process2.execSync)("pnpm --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}
function getNpxCommandOfPnpm() {
  const currentVersion = (0, import_child_process2.execSync)("pnpm --version").toString();
  return Number(currentVersion.split(".")[0]) >= 6 ? "pnpm dlx" : "pnpx";
}

// src/git.ts
var import_child_process3 = require("child_process");
var import_path = __toESM(require("path"));
var import_rimraf = __toESM(require("rimraf"));
function isInGitRepository() {
  try {
    (0, import_child_process3.execSync)("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (_) {
  }
  return false;
}
function isInMercurialRepository() {
  try {
    (0, import_child_process3.execSync)("hg --cwd . root", { stdio: "ignore" });
    return true;
  } catch (_) {
  }
  return false;
}
function tryGitInit(root) {
  let didInit = false;
  try {
    (0, import_child_process3.execSync)("git --version", { stdio: "ignore" });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }
    (0, import_child_process3.execSync)("git init", { stdio: "ignore" });
    didInit = true;
    (0, import_child_process3.execSync)("git checkout -b main", { stdio: "ignore" });
    (0, import_child_process3.execSync)("git add -A", { stdio: "ignore" });
    (0, import_child_process3.execSync)('git commit -m "Initial commit from Create Turborepo"', {
      stdio: "ignore"
    });
    return true;
  } catch (e) {
    if (didInit) {
      try {
        import_rimraf.default.sync(import_path.default.join(root, ".git"));
      } catch (_) {
      }
    }
    return false;
  }
}

// src/getPackageManagerVersion.ts
var import_child_process4 = require("child_process");
var getPackageManagerVersion = (ws) => {
  switch (ws) {
    case "yarn":
      return (0, import_child_process4.execSync)("yarn --version").toString().trim();
    case "pnpm":
      return (0, import_child_process4.execSync)("pnpm --version").toString().trim();
    case "npm":
      return (0, import_child_process4.execSync)("npm --version").toString().trim();
    default:
      throw new Error(`${ws} is not supported`);
  }
};

// src/index.ts
var turboGradient = (0, import_gradient_string.default)("#0099F7", "#F11712");
var help = `
  Usage:
    $ npx create-turbo [flags...] [<dir>]

  If <dir> is not provided up front you will be prompted for it.

  Flags:
    --use-npm           Explicitly tell the CLI to bootstrap the app using npm
    --use-pnpm          Explicitly tell the CLI to bootstrap the app using pnpm
    --use-yarn          Explicitly tell the CLI to bootstrap the app using yarn
    --no-install        Explicitly do not run the package manager's install command
    --help, -h          Show this help message
    --version, -v       Show the version of this script
`;
run().then(notifyUpdate).catch(async (reason) => {
  console.log();
  console.log("Aborting installation.");
  if (reason.command) {
    console.log(`  ${import_chalk.default.cyan(reason.command)} has failed.`);
  } else {
    console.log(import_chalk.default.red("Unexpected error. Please report it as a bug:"));
    console.log(reason);
  }
  console.log();
  await notifyUpdate();
  process.exit(1);
});
async function run() {
  let { input, flags, showHelp, showVersion } = (0, import_meow.default)(help, {
    booleanDefault: void 0,
    flags: {
      help: { type: "boolean", default: false, alias: "h" },
      useNpm: { type: "boolean", default: false },
      usePnpm: { type: "boolean", default: false },
      useYarn: { type: "boolean", default: false },
      install: { type: "boolean", default: true },
      version: { type: "boolean", default: false, alias: "v" }
    }
  });
  if (flags.help)
    showHelp();
  if (flags.version)
    showVersion();
  console.log(import_chalk.default.bold(turboGradient(`
>>> TURBOREPO
`)));
  await new Promise((resolve2) => setTimeout(resolve2, 500));
  console.log(">>> Welcome to Turborepo! Let's get you set up with a new codebase.");
  console.log();
  let projectDir = path2.resolve(process.cwd(), input.length > 0 ? input[0] : (await import_inquirer.default.prompt([
    {
      type: "input",
      name: "dir",
      message: "Where would you like to create your turborepo?",
      default: "./my-turborepo"
    }
  ])).dir);
  const projectName = path2.basename(projectDir);
  const isYarnInstalled = shouldUseYarn();
  const isPnpmInstalled = shouldUsePnpm();
  let answers;
  if (flags.useNpm) {
    answers = { packageManager: "npm" };
  } else if (flags.usePnpm) {
    answers = { packageManager: "pnpm" };
  } else if (flags.useYarn) {
    answers = { packageManager: "yarn" };
  } else {
    answers = await import_inquirer.default.prompt([
      {
        name: "packageManager",
        type: "list",
        message: "Which package manager do you want to use?",
        choices: [
          { name: "npm", value: "npm" },
          {
            name: "pnpm",
            value: "pnpm",
            disabled: !isPnpmInstalled && "not installed"
          },
          {
            name: "yarn",
            value: "yarn",
            disabled: !isYarnInstalled && "not installed"
          }
        ]
      }
    ]);
  }
  let relativeProjectDir = path2.relative(process.cwd(), projectDir);
  let projectDirIsCurrentDir = relativeProjectDir === "";
  if (!projectDirIsCurrentDir) {
    if (import_fs_extra.default.existsSync(projectDir)) {
      console.log(`\uFE0F\u{1F6A8} Oops, "${relativeProjectDir}" already exists. Please try again with a different directory.`);
      process.exit(1);
    } else {
      await import_fs_extra.default.mkdir(projectDir);
    }
  }
  let sharedTemplate = path2.resolve(__dirname, "../templates", `_shared_ts`);
  await import_fs_extra.default.copy(sharedTemplate, projectDir);
  let serverTemplate = path2.resolve(__dirname, "../templates", answers.packageManager);
  if (import_fs_extra.default.existsSync(serverTemplate)) {
    await import_fs_extra.default.copy(serverTemplate, projectDir, { overwrite: true });
  }
  await import_fs_extra.default.move(path2.join(projectDir, "gitignore"), path2.join(projectDir, ".gitignore"));
  let sharedPkg = require(path2.join(sharedTemplate, "package.json"));
  let projectPkg = require(path2.join(projectDir, "package.json"));
  ["dependencies", "devDependencies"].forEach((pkgKey) => {
    sharedPkg[pkgKey] = {
      ...sharedPkg[pkgKey],
      ...projectPkg[pkgKey]
    };
  });
  sharedPkg.packageManager = `${answers.packageManager}@${getPackageManagerVersion(answers.packageManager)}`;
  sharedPkg.name = projectName;
  await import_fs_extra.default.writeFile(path2.join(projectDir, "package.json"), JSON.stringify(sharedPkg, null, 2));
  if (flags.install) {
    console.log();
    console.log(`>>> Creating a new turborepo with the following:`);
    console.log();
    console.log(` - ${import_chalk.default.bold("apps/web")}: Next.js with TypeScript`);
    console.log(` - ${import_chalk.default.bold("apps/docs")}: Next.js with TypeScript`);
    console.log(` - ${import_chalk.default.bold("packages/ui")}: Shared React component library`);
    console.log(` - ${import_chalk.default.bold("packages/eslint-config-custom")}: Shared configuration (ESLint)`);
    console.log(` - ${import_chalk.default.bold("packages/tsconfig")}: Shared TypeScript \`tsconfig.json\``);
    console.log();
    const spinner = (0, import_ora.default)({
      text: "Installing dependencies...",
      spinner: {
        frames: ["   ", ">  ", ">> ", ">>>"]
      }
    }).start();
    let supportsRegistryArg = false;
    try {
      supportsRegistryArg = (0, import_lt.default)(getPackageManagerVersion(answers.packageManager), "2.0.0");
    } catch (err) {
    }
    const installArgs = ["install"];
    if (supportsRegistryArg) {
      const npmRegistry = await getNpmRegistry(answers.packageManager);
      installArgs.push(`--registry=${npmRegistry}`);
    }
    await (0, import_execa.default)(`${answers.packageManager}`, installArgs, {
      stdio: "ignore",
      cwd: projectDir
    });
    spinner.stop();
  } else {
    console.log();
    console.log(`>>> Bootstrapped a new turborepo with the following:`);
    console.log();
    console.log(` - ${import_chalk.default.bold("apps/web")}: Next.js with TypeScript`);
    console.log(` - ${import_chalk.default.bold("apps/docs")}: Next.js with TypeScript`);
    console.log(` - ${import_chalk.default.bold("packages/ui")}: Shared React component library`);
    console.log(` - ${import_chalk.default.bold("packages/config")}: Shared configuration (ESLint)`);
    console.log(` - ${import_chalk.default.bold("packages/tsconfig")}: Shared TypeScript \`tsconfig.json\``);
    console.log();
  }
  process.chdir(projectDir);
  tryGitInit(relativeProjectDir);
  if (projectDirIsCurrentDir) {
    console.log(`${import_chalk.default.bold(turboGradient(">>> Success!"))} Your new Turborepo is ready. `);
    console.log("Inside this directory, you can run several commands:");
  } else {
    console.log(`${import_chalk.default.bold(turboGradient(">>> Success!"))} Created a new Turborepo at "${relativeProjectDir}". `);
    console.log("Inside that directory, you can run several commands:");
  }
  console.log();
  console.log(import_chalk.default.cyan(`  ${answers.packageManager} run build`));
  console.log(`     Build all apps and packages`);
  console.log();
  console.log(import_chalk.default.cyan(`  ${answers.packageManager} run dev`));
  console.log(`     Develop all apps and packages`);
  console.log();
  console.log(`Turborepo will cache locally by default. For an additional`);
  console.log(`speed boost, enable Remote Caching with Vercel by`);
  console.log(`entering the following command:`);
  console.log();
  console.log(import_chalk.default.cyan(`  ${getNpxCommand(answers.packageManager)} turbo login`));
  console.log();
  console.log(`We suggest that you begin by typing:`);
  console.log();
  if (!projectDirIsCurrentDir) {
    console.log(`  ${import_chalk.default.cyan("cd")} ${relativeProjectDir}`);
  }
  console.log(import_chalk.default.cyan(`  ${getNpxCommand(answers.packageManager)} turbo login`));
  console.log();
}
async function getNpmRegistry(pkgManager) {
  try {
    const { stdout: registry } = await (0, import_execa.default)(pkgManager, [
      "config",
      "get",
      "registry"
    ]);
    return registry;
  } catch (error) {
    return "";
  }
}
var update = (0, import_update_check.default)(package_default).catch(() => null);
async function notifyUpdate() {
  try {
    const res = await update;
    if (res == null ? void 0 : res.latest) {
      const isYarn = shouldUseYarn();
      console.log();
      console.log(import_chalk.default.yellow.bold("A new version of `create-turbo` is available!"));
      console.log("You can update by running: " + import_chalk.default.cyan(isYarn ? "yarn global add create-turbo" : "npm i -g create-turbo"));
      console.log();
    }
    process.exit();
  } catch {
  }
}
function getNpxCommand(pkgManager) {
  if (pkgManager === "yarn") {
    return "npx";
  } else if (pkgManager === "pnpm") {
    return getNpxCommandOfPnpm();
  } else {
    return "npx";
  }
}
