import { SCSSFunctions } from './SCSSFunctions';
/** */
export interface SCSSCompilerOptions {
    /** */
    includePaths?: string[];
}
/** */
export declare class SCSSCompiler {
    private readonly scssFunctions;
    private readonly options?;
    /** */
    constructor(scssFunctions: SCSSFunctions, options?: SCSSCompilerOptions);
    /** */
    compile(input: string, output: string): {
        hashedOutput: string;
    };
}
