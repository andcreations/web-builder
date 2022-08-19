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
const ASSETS_SUFFIXES = ['.png'];
/** */
class AssetsBuilder {
    /** */
    constructor(srcDir, dstDir, suffixes = ASSETS_SUFFIXES) {
        this.srcDir = srcDir;
        this.dstDir = dstDir;
        this.suffixes = suffixes;
    }
    /** */
    isAssetFile(file) {
        return this.suffixes.some(prefix => file.endsWith(prefix));
    }
    /** */
    removeAssets() {
        // do nothing if the directory does not exist
        if (!fs.existsSync(this.dstDir)) {
            return;
        }
        (0, console_1.printDetails)('Removing');
        // remove
        const files = fs.readdirSync(this.dstDir);
        for (const file of files) {
            if (this.isAssetFile(file)) {
                fs.unlinkSync(path.join(this.dstDir, file));
            }
        }
    }
    /** */
    copyAssets() {
        if (!fs.existsSync(this.srcDir)) {
            (0, console_1.printDetails)(`Nothing to copy. No asset directory ${this.srcDir}`);
            return;
        }
        // create directory
        (0, console_1.printDetails)(`Creating directory: ${this.dstDir}`);
        fs.mkdirSync(this.dstDir, { recursive: true });
        (0, console_1.printDetails)(`Copying from directory: ${this.srcDir}`);
        // copy file
        const files = fs.readdirSync(this.srcDir);
        for (const file of files) {
            if (this.isAssetFile(file)) {
                const srcFile = path.join(this.srcDir, file);
                const dstFile = path.join(this.dstDir, file);
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
