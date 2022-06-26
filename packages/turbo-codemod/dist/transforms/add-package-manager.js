"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/transforms/add-package-manager.ts
var add_package_manager_exports = {};
__export(add_package_manager_exports, {
  default: () => addPackageManager
});
module.exports = __toCommonJS(add_package_manager_exports);
var import_path2 = __toESM(require("path"));

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

// src/getPackageManagerVersion.ts
var import_child_process = require("child_process");
var getPackageManagerVersion = (ws) => {
  switch (ws) {
    case "yarn":
      return (0, import_child_process.execSync)("yarn --version").toString().trim();
    case "pnpm":
      return (0, import_child_process.execSync)("pnpm --version").toString().trim();
    case "npm":
      return (0, import_child_process.execSync)("npm --version").toString().trim();
    default:
      throw new Error(`${ws} is not supported`);
  }
};

// src/transforms/add-package-manager.ts
var import_fs_extra = __toESM(require("fs-extra"));
var import_chalk = __toESM(require("chalk"));
function addPackageManager(files, flags) {
  if (files.length === 1) {
    const dir = files[0];
    const root = import_path2.default.resolve(process.cwd(), dir);
    console.log(`Set "packageManager" key in root "package.json" file...`);
    const packageManager = getWorkspaceImplementation(root);
    if (!packageManager) {
      error(`Unable to determine package manager for ${dir}`);
      process.exit(1);
    }
    const version = getPackageManagerVersion(packageManager);
    const pkgManagerString = `${packageManager}@${version}`;
    const rootPackageJsonPath = import_path2.default.join(root, "package.json");
    const rootPackageJson = import_fs_extra.default.readJsonSync(rootPackageJsonPath);
    const allWorkspaces = [
      {
        name: "package.json",
        path: root,
        packageJson: {
          ...rootPackageJson,
          packageJsonPath: rootPackageJsonPath
        }
      }
    ];
    let modifiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let unmodifiedCount = allWorkspaces.length;
    console.log(`Found ${unmodifiedCount} files for modification...`);
    for (const workspace of allWorkspaces) {
      const { packageJsonPath, ...pkgJson } = workspace.packageJson;
      const relPackageJsonPath = import_path2.default.relative(root, packageJsonPath);
      try {
        if (pkgJson.packageManager === pkgManagerString) {
          skip(relPackageJsonPath, import_chalk.default.dim(`(already set to ${pkgManagerString})`));
        } else {
          const newJson = { ...pkgJson, packageManager: pkgManagerString };
          if (flags.print) {
            console.log(JSON.stringify(newJson, null, 2));
          }
          if (!flags.dry) {
            import_fs_extra.default.writeJsonSync(packageJsonPath, newJson, {
              spaces: 2
            });
            ok(relPackageJsonPath);
            modifiedCount++;
            unmodifiedCount--;
          } else {
            skip(relPackageJsonPath, import_chalk.default.dim(`(dry run)`));
          }
        }
      } catch (err) {
        console.error(error);
        error(relPackageJsonPath);
      }
    }
    console.log("All done.");
    console.log("Results:");
    console.log(import_chalk.default.red(`${errorCount} errors`));
    console.log(import_chalk.default.yellow(`${skippedCount} skipped`));
    console.log(import_chalk.default.yellow(`${unmodifiedCount} unmodified`));
    console.log(import_chalk.default.green(`${modifiedCount} modified`));
  }
}
function skip(...args) {
  console.log(import_chalk.default.yellow.inverse(` SKIP `), ...args);
}
function error(...args) {
  console.log(import_chalk.default.red.inverse(` ERROR `), ...args);
}
function ok(...args) {
  console.log(import_chalk.default.green.inverse(` OK `), ...args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
