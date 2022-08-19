import * as sass from 'sass';
/** */
interface SCSSFunction {
    /** */
    (args: sass.Value[]): sass.Value;
}
/** */
export declare class SCSSFunctions {
    /** */
    private readonly functions;
    /** */
    register(name: string, scssFunction: SCSSFunction): void;
    /** */
    get(): {
        [name: string]: SCSSFunction;
    };
    /** */
    inlineImage(dir: string): void;
}
export {};
