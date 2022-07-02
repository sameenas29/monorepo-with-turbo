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

// src/transforms/create-turbo-config.ts
var create_turbo_config_exports = {};
__export(create_turbo_config_exports, {
  default: () => createTurboConfig
});
module.exports = __toCommonJS(create_turbo_config_exports);
var import_fs_extra = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var import_chalk = __toESM(require("chalk"));
function createTurboConfig(files, flags) {
  if (files.length === 1) {
    const dir = files[0];
    const root = import_path.default.resolve(process.cwd(), dir);
    console.log(`Migrating "package.json" "turbo" key to "turbo.json" file...`);
    const turboConfigPath = import_path.default.join(root, "turbo.json");
    const rootPackageJsonPath = import_path.default.join(root, "package.json");
    let modifiedCount = 0;
    let skippedCount = 0;
    let unmodifiedCount = 2;
    if (!import_fs_extra.default.existsSync(rootPackageJsonPath)) {
      error(`No package.json found at ${root}. Is the path correct?`);
      process.exit(1);
    }
    const rootPackageJson = import_fs_extra.default.readJsonSync(rootPackageJsonPath);
    if (import_fs_extra.default.existsSync(turboConfigPath)) {
      skip("turbo.json", import_chalk.default.dim("(already exists)"));
      skip("package.json", import_chalk.default.dim("(skipped)"));
      skippedCount += 2;
    } else if (rootPackageJson.hasOwnProperty("turbo")) {
      const { turbo: turboConfig, ...remainingPkgJson } = rootPackageJson;
      if (flags.dry) {
        if (flags.print) {
          console.log(JSON.stringify(turboConfig, null, 2));
        }
        skip("turbo.json", import_chalk.default.dim("(dry run)"));
        if (flags.print) {
          console.log(JSON.stringify(remainingPkgJson, null, 2));
        }
        skip("package.json", import_chalk.default.dim("(dry run)"));
        skippedCount += 2;
      } else {
        if (flags.print) {
          console.log(JSON.stringify(turboConfig, null, 2));
        }
        ok("turbo.json", import_chalk.default.dim("(created)"));
        import_fs_extra.default.writeJsonSync(turboConfigPath, turboConfig, { spaces: 2 });
        if (flags.print) {
          console.log(JSON.stringify(remainingPkgJson, null, 2));
        }
        ok("package.json", import_chalk.default.dim("(remove turbo key)"));
        import_fs_extra.default.writeJsonSync(rootPackageJsonPath, remainingPkgJson, { spaces: 2 });
        modifiedCount += 2;
        unmodifiedCount -= 2;
      }
    } else {
      error('"turbo" key does not exist in "package.json"');
      process.exit(1);
    }
    console.log("All done.");
    console.log("Results:");
    console.log(import_chalk.default.red(`0 errors`));
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
