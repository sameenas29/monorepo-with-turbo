"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/getPackageManagerVersion.ts
var getPackageManagerVersion_exports = {};
__export(getPackageManagerVersion_exports, {
  getPackageManagerVersion: () => getPackageManagerVersion
});
module.exports = __toCommonJS(getPackageManagerVersion_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPackageManagerVersion
});
