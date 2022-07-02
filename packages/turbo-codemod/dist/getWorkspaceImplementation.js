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

// src/getWorkspaceImplementation.ts
var getWorkspaceImplementation_exports = {};
__export(getWorkspaceImplementation_exports, {
  getWorkspaceImplementation: () => getWorkspaceImplementation,
  getWorkspaceImplementationAndLockFile: () => getWorkspaceImplementationAndLockFile
});
module.exports = __toCommonJS(getWorkspaceImplementation_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getWorkspaceImplementation,
  getWorkspaceImplementationAndLockFile
});
