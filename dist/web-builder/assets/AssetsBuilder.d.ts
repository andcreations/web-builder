/** */
export declare class AssetsBuilder {
    private readonly srcDir;
    private readonly dstDir;
    private readonly suffixes;
    /** */
    constructor(srcDir: string, dstDir: string, suffixes?: string[]);
    /** */
    private isAssetFile;
    /** */
    private removeAssets;
    /** */
    private copyAssets;
    /** */
    run(): void;
}
