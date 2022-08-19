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
exports.SCSSCompiler = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const sass = __importStar(require("sass"));
/** */
function md5(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}
/** */
class SCSSCompiler {
    /** */
    constructor(scssFunctions, options) {
        this.scssFunctions = scssFunctions;
        this.options = options;
    }
    /** */
    compile(input, output) {
        var _a;
        const result = sass.compile(input, {
            functions: this.scssFunctions.get(),
            loadPaths: (_a = this.options) === null || _a === void 0 ? void 0 : _a.includePaths,
        });
        const hash = md5(result.css);
        const hashedOutput = output.replace('${hash}', hash);
        fs.mkdirSync(path.dirname(hashedOutput), { recursive: true });
        fs.writeFileSync(hashedOutput, result.css);
        return { hashedOutput };
    }
}
exports.SCSSCompiler = SCSSCompiler;
