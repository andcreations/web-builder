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
exports.HTMLBuilder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ejs = __importStar(require("ejs"));
const console_1 = require("../console");
const io_1 = require("../io");
/** */
class HTMLBuilder {
    /** */
    constructor(options) {
        this.options = options;
    }
    /** */
    findAppJSFile() {
        return (0, io_1.matchFile)(this.options.dstDir, /app.*js/);
    }
    /** */
    readTemplate() {
        return fs.readFileSync(this.options.templateFile).toString();
    }
    /** */
    getDstFile() {
        return path.join(this.options.dstDir, 'index.html');
    }
    /** */
    writeIndexHTML(content) {
        fs.writeFileSync(this.getDstFile(), content);
    }
    /** */
    run() {
        (0, console_1.printHeader)('Building HTML');
        (0, console_1.printDetails)(`Building: ${this.options.templateFile}`);
        (0, console_1.printDetails)(`       -> ${this.getDstFile()}`);
        // read
        const template = this.readTemplate();
        // render
        const data = {
            appJsFile: this.findAppJSFile(),
            cssFiles: this.options.cssFiles,
        };
        const content = ejs.render(template, data);
        // write
        this.writeIndexHTML(content);
    }
}
exports.HTMLBuilder = HTMLBuilder;
