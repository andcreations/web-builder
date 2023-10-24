/** */
export interface WebpackAppBuilderOptions {
    /** Destination directory. */
    dstDir: string;
    /** */
    dstFiles: Array<string | RegExp>;
    /** */
    webpackFile: string;
}
/** */
export declare class WebpackAppBuilder {
    private readonly options;
    /** */
    constructor(options: WebpackAppBuilderOptions);
    /** */
    private removeDstFiles;
    /** */
    run(): Promise<void>;
}
