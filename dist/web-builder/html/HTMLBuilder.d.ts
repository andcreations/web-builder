/** */
export interface CSSFile {
    /** Path to a CSS file. */
    file: string;
    /** CSS title. */
    title: string;
}
/** */
export interface HTMLBuilderOptions {
    /** */
    templateFile: string;
    /** */
    dstDir: string;
    /** */
    cssFiles: CSSFile[];
}
/** */
export declare class HTMLBuilder {
    private readonly options;
    /** */
    constructor(options: HTMLBuilderOptions);
    /** */
    private findAppJSFile;
    /** */
    private readTemplate;
    /** */
    private getDstFile;
    /** */
    private writeIndexHTML;
    /** */
    run(): void;
}
