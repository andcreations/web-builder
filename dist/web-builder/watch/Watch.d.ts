import { AssetsBuilderOptions } from '../assets';
import { StyleBuilderOptions } from '../styles';
import { HTMLBuilderOptions } from '../html';
import { WebpackAppBuilderOptions } from '../webpack';
/** */
export interface WatchOptions {
    /** Watch interval in milliseconds. */
    interval?: number;
    /** Assets builder options. */
    assetsBuilderOptions?: AssetsBuilderOptions;
    /** Directories with style files. */
    styleDirs?: string[];
    /** Options for style builder. */
    styleBuilderOptions?: StyleBuilderOptions;
    /** HTML builder options. */
    htmlBuilderOptions?: HTMLBuilderOptions;
    /** Directories with the application source. */
    appDirs?: string[];
    /** Webpack builder options. */
    webpackBuilderOptions?: WebpackAppBuilderOptions;
}
/** */
export declare class Watch {
    private readonly options;
    /** */
    private timeout;
    /** */
    private assetsChangeTracker;
    /** */
    private styleChangeTrackers;
    /** */
    private htmlChangeTracker;
    /** */
    private appChangeTrackers;
    /** */
    constructor(options: WatchOptions);
    /** */
    private handleError;
    /** */
    private createChangeTrackers;
    /** */
    private buildAssets;
    /** */
    private buildStyles;
    /** */
    private buildHTML;
    /** */
    private buildApp;
    /** */
    private checkChanges;
    /** */
    private scheduleCheck;
    /** */
    watch(): void;
    /** */
    unwatch(): void;
}
