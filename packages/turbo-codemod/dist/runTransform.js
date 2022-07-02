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

// src/runTransform.ts
var runTransform_exports = {};
__export(runTransform_exports, {
  runTransform: () => runTransform,
  transformerDirectory: () => transformerDirectory
});
module.exports = __toCommonJS(runTransform_exports);
var import_path = __toESM(require("path"));
var transformerDirectory = import_path.default.join(__dirname, "transforms");
function runTransform({
  files,
  flags,
  transformer
}) {
  const transformerPath = import_path.default.join(transformerDirectory, `${transformer}.js`);
  return require(transformerPath).default(files, flags);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runTransform,
  transformerDirectory
});
