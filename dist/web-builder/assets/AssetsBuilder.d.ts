/** */
export interface AssetsBuilderOptions {
    /** Directory with source assets. */
    srcDir: string;
    /** Destination directory. */
    dstDir: string;
    /** Suffixes of files to copy. */
    suffixes?: string[];
}
/** */
export declare class AssetsBuilder {
    private readonly options?;
    /** */
    constructor(options?: AssetsBuilderOptions);
    /** */
    private isAssetFile;
    /** */
    private removeAssets;
    /** */
    private copyAssets;
    /** */
    run(): void;
}
