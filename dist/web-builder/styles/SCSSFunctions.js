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
exports.SCSSFunctions = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sass = __importStar(require("sass"));
/** */
class SCSSFunctions {
    constructor() {
        /** */
        this.functions = {};
    }
    /** */
    register(name, scssFunction) {
        this.functions[name] = scssFunction;
    }
    /** */
    get() {
        return this.functions;
    }
    /** */
    inlineImage(dir) {
        const inlineImageFunc = (args) => {
            // argument
            args[0].assertString();
            const fileArg = args[0].text;
            // file
            const file = path.join(dir, fileArg);
            if (!fs.existsSync(file)) {
                throw new Error(`Inline image ${file} not found`);
            }
            const suffix = file.split('.').pop();
            // read
            const content = fs.readFileSync(file);
            const base64 = content.toString('base64');
            // image data
            const img = `url(data:image/${suffix};base64,${base64})`;
            return new sass.SassString(img, { quotes: false });
        };
        this.register('inline-img($img)', inlineImageFunc);
    }
}
exports.SCSSFunctions = SCSSFunctions;
