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
exports.StyleBuilder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const console_1 = require("../console");
const SCSSCompiler_1 = require("./SCSSCompiler");
const SCSSFunctions_1 = require("./SCSSFunctions");
/** */
class StyleBuilder {
    /** */
    constructor(options) {
        this.options = options;
    }
    /** */
    removeCSSFiles() {
        const { dstDir } = this.options;
        if (!fs.existsSync(dstDir)) {
            return;
        }
        const files = fs.readdirSync(dstDir);
        const toDelete = files.filter(file => file.endsWith('.css'));
        if (toDelete.length) {
            toDelete.forEach(file => {
                const absFile = path.join(dstDir, file);
                (0, console_1.printDetails)(`Deleting: ${absFile}`);
                fs.unlinkSync(absFile);
            });
        }
    }
    /** */
    run() {
        var _a;
        (0, console_1.printHeader)('Building styles');
        this.removeCSSFiles();
        // functions
        const scssFunctions = new SCSSFunctions_1.SCSSFunctions();
        if (this.options.inlineImagesDir) {
            scssFunctions.inlineImage(this.options.inlineImagesDir);
        }
        if ((_a = this.options.includePaths) === null || _a === void 0 ? void 0 : _a.length) {
            (0, console_1.printDetails)('Include paths:');
            for (const includePath of this.options.includePaths) {
                (0, console_1.printDetails)(`    ${includePath}`);
            }
        }
        // compile
        for (const styleFile of this.options.styleFiles) {
            (0, console_1.printDetails)(`Building: ${styleFile.input}`);
            const scssCompiler = new SCSSCompiler_1.SCSSCompiler(scssFunctions, {
                includePaths: this.options.includePaths,
            });
            const { hashedOutput } = scssCompiler.compile(styleFile.input, styleFile.output);
            (0, console_1.printDetails)(`       -> ${hashedOutput}`);
        }
    }
}
exports.StyleBuilder = StyleBuilder;
