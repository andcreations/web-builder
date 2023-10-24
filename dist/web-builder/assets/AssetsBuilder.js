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
exports.AssetsBuilder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const console_1 = require("../console");
/** */
const DEFAULT_ASSETS_SUFFIXES = ['.png'];
/** */
class AssetsBuilder {
    /** */
    constructor(options) {
        this.options = options;
    }
    /** */
    isAssetFile(file) {
        const { suffixes = DEFAULT_ASSETS_SUFFIXES } = this.options;
        return suffixes.some(prefix => file.endsWith(prefix));
    }
    /** */
    removeAssets() {
        const { dstDir } = this.options;
        // do nothing if the directory does not exist
        if (!fs.existsSync(dstDir)) {
            return;
        }
        (0, console_1.printDetails)('Removing');
        // remove
        const files = fs.readdirSync(dstDir);
        for (const file of files) {
            if (this.isAssetFile(file)) {
                fs.unlinkSync(path.join(dstDir, file));
            }
        }
    }
    /** */
    copyAssets() {
        const { srcDir, dstDir } = this.options;
        if (!fs.existsSync(srcDir)) {
            (0, console_1.printDetails)(`Nothing to copy. No asset directory ${srcDir}`);
            return;
        }
        // create destination directory
        if (!fs.existsSync(dstDir)) {
            (0, console_1.printDetails)(`Creating directory: ${dstDir}`);
            fs.mkdirSync(dstDir, { recursive: true });
        }
        (0, console_1.printDetails)(`Copying from directory: ${srcDir}`);
        // copy file
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
            if (this.isAssetFile(file)) {
                const srcFile = path.join(srcDir, file);
                const dstFile = path.join(dstDir, file);
                try {
                    fs.copyFileSync(srcFile, dstFile);
                }
                catch (error) {
                    (0, console_1.fatal)(`Failed to copy ${srcFile} to ${dstFile}`, error);
                }
            }
            else {
                (0, console_1.printDetails)(`Skipping file ${file} (not an asset file)`);
            }
        }
    }
    /** */
    run() {
        (0, console_1.printHeader)('Building assets');
        this.removeAssets();
        this.copyAssets();
    }
}
exports.AssetsBuilder = AssetsBuilder;
