/** */
export interface StyleFile {
    /** Input SCSS file. */
    input: string;
    /** Output CSS file. */
    output: string;
}
/** */
export interface StyleBuilderOptions {
    dstDir: string;
    styleFiles: StyleFile[];
    inlineImagesDir?: string;
    includePaths?: string[];
}
/** */
export declare class StyleBuilder {
    private readonly options;
    /** */
    constructor(options: StyleBuilderOptions);
    /** */
    private removeCSSFiles;
    /** */
    run(): void;
}
