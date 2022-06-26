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
var import_chalk2 = __toESM(require("chalk"));
var import_globby = __toESM(require("globby"));
var import_inquirer = __toESM(require("inquirer"));
var import_meow = __toESM(require("meow"));
var import_update_check = __toESM(require("update-check"));

// package.json
var package_default = {
  name: "@turbo/codemod",
  version: "1.2.17-canary.0",
  description: "Provides Codemod transformations to help upgrade your Turborepo codebase when a feature is deprecated.",
  homepage: "https://turborepo.org",
  license: "MPL-2.0",
  repository: {
    type: "git",
    url: "https://github.com/vercel/turborepo",
    directory: "turbo-codemod"
  },
  bugs: {
    url: "https://github.com/vercel/turborepo/issues"
  },
  bin: "dist/index.js",
  scripts: {
    build: "tsup src/*.ts src/transforms/*.ts --format cjs",
    lint: "eslint src/**/*.ts"
  },
  dependencies: {
    chalk: "2.4.2",
    execa: "5.0.0",
    "find-up": "4.1.0",
    "fs-extra": "^10.0.0",
    globby: "11.1.0",
    "gradient-string": "^2.0.0",
    inquirer: "^8.0.0",
    "is-git-clean": "^1.1.0",
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
    "dist"
  ],
  publishConfig: {
    access: "public"
  }
};

// src/getWorkspaceImplementation.ts
var import_find_up = __toESM(require("find-up"));
var import_path = __toESM(require("path"));
var cache = {};
function getWorkspaceImplementationAndLockFile(cwd) {
  if (cache[cwd]) {
    return cache[cwd];
  }
  const lockFile = import_find_up.default.sync(["yarn.lock", "pnpm-workspace.yaml", "package-lock.json"], {
    cwd
  });
  if (!lockFile) {
    return;
  }
  switch (import_path.default.basename(lockFile)) {
    case "yarn.lock":
      cache[cwd] = {
        implementation: "yarn",
        lockFile
      };
      break;
    case "pnpm-workspace.yaml":
      cache[cwd] = {
        implementation: "pnpm",
        lockFile
      };
      break;
    case "package-lock.json":
      cache[cwd] = {
        implementation: "npm",
        lockFile
      };
      break;
  }
  return cache[cwd];
}
function getWorkspaceImplementation(cwd) {
  var _a;
  return (_a = getWorkspaceImplementationAndLockFile(cwd)) == null ? void 0 : _a.implementation;
}

// src/git.ts
var import_chalk = __toESM(require("chalk"));
var import_is_git_clean = __toESM(require("is-git-clean"));
function checkGitStatus(force) {
  let clean = false;
  let errorMessage = "Unable to determine if git directory is clean";
  try {
    clean = import_is_git_clean.default.sync(process.cwd());
    errorMessage = "Git directory is not clean";
  } catch (err) {
    if (err && err.stderr && err.stderr.indexOf("Not a git repository") >= 0) {
      clean = true;
    }
  }
  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing...`);
    } else {
      console.log("Thank you for using @turbo/codemod!");
      console.log(import_chalk.default.yellow("\nBut before we continue, please stash or commit your git changes."));
      console.log("\nYou may use the --force flag to override this safety check.");
      process.exit(1);
    }
  }
}

// src/runTransform.ts
var import_path2 = __toESM(require("path"));
var transformerDirectory = import_path2.default.join(__dirname, "transforms");
function runTransform({
  files,
  flags,
  transformer
}) {
  const transformerPath = import_path2.default.join(transformerDirectory, `${transformer}.js`);
  return require(transformerPath).default(files, flags);
}

// src/index.ts
var help = `
  Usage:
    $ npx @turbo/codemod <transform> <path> <...options>

  If <dir> is not provided up front you will be prompted for it.

  Options:
    --force             Bypass Git safety checks and forcibly run codemods
    --dry               Dry run (no changes are made to files)
    --print             Print transformed files to your terminal
    --help, -h          Show this help message
    --version, -v       Show the version of this script
`;
var TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: "add-package-manager: Set the `packageManager` key in root `package.json` file",
    value: "add-package-manager"
  },
  {
    name: 'create-turbo-config: Create the `turbo.json` file from an existing "turbo" key in `package.json`',
    value: "create-turbo-config"
  }
];
run().then(notifyUpdate).catch(async (reason) => {
  console.log();
  console.log("Aborting installation.");
  if (reason.command) {
    console.log(`  ${import_chalk2.default.cyan(reason.command)} has failed.`);
  } else {
    console.log(import_chalk2.default.red("Unexpected error. Please report it as a bug:"));
    console.log(reason);
  }
  console.log();
  await notifyUpdate();
  process.exit(1);
});
async function run() {
  let cli = (0, import_meow.default)(help, {
    booleanDefault: void 0,
    flags: {
      help: { type: "boolean", default: false, alias: "h" },
      force: { type: "boolean", default: false },
      dry: { type: "boolean", default: false },
      print: { type: "boolean", default: false },
      version: { type: "boolean", default: false, alias: "v" }
    },
    description: "Codemods for updating Turborepo codebases."
  });
  if (cli.flags.help)
    cli.showHelp();
  if (cli.flags.version)
    cli.showVersion();
  if (!cli.flags.dry) {
    checkGitStatus(cli.flags.force);
  }
  if (cli.input[0] && !TRANSFORMER_INQUIRER_CHOICES.find((x) => x.value === cli.input[0])) {
    console.error("Invalid transform choice, pick one of:");
    console.error(TRANSFORMER_INQUIRER_CHOICES.map((x) => "- " + x.value).join("\n"));
    process.exit(1);
  }
  const answers = await import_inquirer.default.prompt([
    {
      type: "input",
      name: "files",
      message: "On which directory should the codemods be applied?",
      when: !cli.input[1],
      default: ".",
      filter: (files2) => files2.trim()
    },
    {
      type: "list",
      name: "transformer",
      message: "Which transform would you like to apply?",
      when: !cli.input[0],
      pageSize: TRANSFORMER_INQUIRER_CHOICES.length,
      choices: TRANSFORMER_INQUIRER_CHOICES
    }
  ]);
  const { files, transformer } = answers;
  const filesBeforeExpansion = cli.input[1] || files;
  const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);
  const selectedTransformer = cli.input[0] || transformer;
  if (!filesExpanded.length) {
    console.log(`No files found matching ${filesBeforeExpansion.join(" ")}`);
    return null;
  }
  return runTransform({
    files: filesExpanded,
    flags: cli.flags,
    transformer: selectedTransformer
  });
}
var update = (0, import_update_check.default)(package_default).catch(() => null);
async function notifyUpdate() {
  try {
    const res = await update;
    if (res == null ? void 0 : res.latest) {
      const ws = getWorkspaceImplementation(process.cwd());
      console.log();
      console.log(import_chalk2.default.yellow.bold("A new version of `@turbo/codemod` is available!"));
      console.log("You can update by running: " + import_chalk2.default.cyan(ws === "yarn" ? "yarn global add @turbo/codemod" : ws === "pnpm" ? "pnpm i -g @turbo/codemod" : "npm i -g @turbo/codemod"));
      console.log();
    }
    process.exit();
  } catch (_e) {
  }
}
function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) => file.includes("*"));
  return shouldExpandFiles ? import_globby.default.sync(filesBeforeExpansion) : filesBeforeExpansion;
}
