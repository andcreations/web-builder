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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackAppBuilder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const console_1 = require("../console");
/** */
class WebpackAppBuilder {
    /** */
    constructor(options) {
        this.options = options;
    }
    /** */
    removeDstFiles() {
        const dstDir = this.options.dstDir;
        if (!fs.existsSync(dstDir)) {
            return;
        }
        const files = fs.readdirSync(dstDir);
        for (const file of files) {
            const match = this.options.dstFiles.some(dstFile => {
                if (typeof dstFile === 'string') {
                    return dstFile === file;
                }
                return file.match(dstFile);
            });
            if (match) {
                fs.unlinkSync(path.join(dstDir, file));
            }
        }
    }
    /** */
    run() {
        (0, console_1.printHeader)('Building application', this.options.webpackFile);
        // remove existing output file
        this.removeDstFiles();
        // read configuration
        const config = require(this.options.webpackFile);
        // build
        const compiler = (0, webpack_1.default)(config);
        return new Promise((resolve, reject) => {
            compiler.run((error, stats) => {
                if (error) {
                    reject(error);
                    return;
                }
                (0, console_1.printDetails)(stats.toString());
                if (stats.hasErrors()) {
                    reject(new Error('Webpack failed'));
                    return;
                }
                resolve();
            });
        });
    }
}
exports.WebpackAppBuilder = WebpackAppBuilder;
