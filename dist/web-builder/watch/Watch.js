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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watch = void 0;
const path = __importStar(require("path"));
const io_1 = require("@andcreations/io");
const assets_1 = require("../assets");
const styles_1 = require("../styles");
const html_1 = require("../html");
const webpack_1 = require("../webpack");
/** */
const DEFAULT_INTERVAL = 1600;
/** */
const IGNORED_FILE_PREFIXES = ['#', '.'];
/** */
class Watch {
    /** */
    constructor(options) {
        this.options = options;
        /** */
        this.styleChangeTrackers = [];
        /** */
        this.appChangeTrackers = [];
    }
    /** */
    handleError(error) {
        console.log(error);
    }
    /** */
    createChangeTrackers() {
        var _a, _b;
        const filter = (file) => {
            return !IGNORED_FILE_PREFIXES.some(prefix => file.startsWith(prefix));
        };
        // assets change tracker
        const { assetsBuilderOptions } = this.options;
        if (assetsBuilderOptions) {
            this.assetsChangeTracker = new io_1.TreeChangeTracker(assetsBuilderOptions.srcDir, { filter });
        }
        // style change trackers
        for (const styleDir of ((_a = this.options) === null || _a === void 0 ? void 0 : _a.styleDirs) || []) {
            const tracker = new io_1.TreeChangeTracker(styleDir, { filter });
            this.styleChangeTrackers.push(tracker);
        }
        // HTML change tracker
        const { htmlBuilderOptions } = this.options;
        if (htmlBuilderOptions) {
            this.htmlChangeTracker = new io_1.FileChangeTracker([
                htmlBuilderOptions.templateFile,
                ...htmlBuilderOptions.cssFiles.map(cssFile => {
                    return path.join(htmlBuilderOptions.dstDir, cssFile.file);
                }),
            ]);
        }
        // application change tracker
        for (const appDir of ((_b = this.options) === null || _b === void 0 ? void 0 : _b.appDirs) || []) {
            const tracker = new io_1.TreeChangeTracker(appDir, { filter });
            this.appChangeTrackers.push(tracker);
        }
    }
    /** */
    buildAssets() {
        const { assetsBuilderOptions } = this.options;
        if (!assetsBuilderOptions) {
            return;
        }
        // build
        const builder = new assets_1.AssetsBuilder(assetsBuilderOptions);
        builder.run();
    }
    /** */
    buildStyles() {
        const builder = new styles_1.StyleBuilder(this.options.styleBuilderOptions);
        builder.run();
    }
    /** */
    buildHTML() {
        const { htmlBuilderOptions } = this.options;
        if (!htmlBuilderOptions) {
            return;
        }
        // build
        const builder = new html_1.HTMLBuilder(htmlBuilderOptions);
        builder.run();
    }
    /** */
    buildApp() {
        return __awaiter(this, void 0, void 0, function* () {
            const { webpackBuilderOptions } = this.options;
            if (!webpackBuilderOptions) {
                return;
            }
            // build
            const builder = new webpack_1.WebpackAppBuilder(webpackBuilderOptions);
            yield builder.run();
        });
    }
    /** */
    checkChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            // check
            const assetsChanged = (this.assetsChangeTracker &&
                this.assetsChangeTracker.isChanged());
            const stylesChanged = this.styleChangeTrackers.some(tracker => {
                return tracker.isChanged();
            });
            const htmlChanged = (this.htmlChangeTracker &&
                this.htmlChangeTracker.isChanged());
            const appChanged = this.appChangeTrackers.some(tracker => {
                return tracker.isChanged();
            });
            // action
            try {
                if (assetsChanged) {
                    this.buildAssets();
                }
                if (stylesChanged) {
                    this.buildStyles();
                }
                if (appChanged) {
                    yield this.buildApp();
                }
                if (htmlChanged || stylesChanged || appChanged) {
                    this.buildHTML();
                }
            }
            catch (error) {
                this.handleError(error);
                return;
            }
        });
    }
    /** */
    scheduleCheck() {
        var _a;
        this.timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.checkChanges();
            this.scheduleCheck();
        }), ((_a = this.options) === null || _a === void 0 ? void 0 : _a.interval) || DEFAULT_INTERVAL);
    }
    /** */
    watch() {
        // initialize
        this.createChangeTrackers();
        // watch
        if (this.timeout) {
            throw new Error('Already watching');
        }
        this.scheduleCheck();
    }
    /** */
    unwatch() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            delete this.timeout;
        }
    }
}
exports.Watch = Watch;
