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
exports.fatal = exports.printDetails = exports.detailsToString = exports.printHeader = exports.headerToString = void 0;
const colors = __importStar(require("ansi-colors"));
/** */
function headerToString(name, value, details) {
    let str = `--- ${colors.green(name)}`;
    if (value) {
        str += `: ${value}`;
    }
    if (details) {
        str += ` (${details})`;
    }
    return str;
}
exports.headerToString = headerToString;
/** */
function printHeader(name, value, details) {
    console.log(headerToString(name, value, details));
}
exports.printHeader = printHeader;
/** */
function detailsToString(msg) {
    const lines = msg.split('\n');
    let str = '';
    for (let index = 0; index < lines.length; index++) {
        if (index > 0) {
            str += '\n';
        }
        str += `    ${lines[index]}`;
    }
    return str;
}
exports.detailsToString = detailsToString;
/** */
function printDetails(msg) {
    console.log(detailsToString(msg));
}
exports.printDetails = printDetails;
/** */
function fatal(msg, error) {
    console.error(`    ${msg}`);
    if (error) {
        if (error.stack) {
            console.error(error.stack);
        }
        else {
            console.error(error.toString());
        }
    }
    process.exit(1);
}
exports.fatal = fatal;
