"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchFile = exports.matchFiles = void 0;
const fs = __importStar(require("fs"));
/** */
function matchFiles(dir, regex) {
    const files = fs.readdirSync(dir);
    const matched = [];
    for (const file of files) {
        if (file.match(regex)) {
            matched.push(file);
        }
    }
    return matched;
}
exports.matchFiles = matchFiles;
/** */
function matchFile(dir, regex) {
    const matched = matchFiles(dir, regex);
    if (!matched.length) {
        throw new Error(`No file in directory ${dir} matches regex ${regex}`);
    }
    if (matched.length > 1) {
        throw new Error(`Two or more files matched by regex ${regex} ` +
            `in directory ${dir}`);
    }
    return matched[0];
}
exports.matchFile = matchFile;
