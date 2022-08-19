import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as sass from 'sass';
import { SCSSFunctions } from './SCSSFunctions';

/** */
export interface SCSSCompilerOptions {
  /** */
  includePaths?: string[];
}

/** */
function md5(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

/** */
export class SCSSCompiler {
  /** */
  constructor(
    private readonly scssFunctions: SCSSFunctions,
    private readonly options?: SCSSCompilerOptions) {
  }

  /** */
  compile(input: string, output: string): { hashedOutput: string } {
    const result = sass.compile(input, {
      functions: this.scssFunctions.get(),
      loadPaths: this.options?.includePaths,
    });
    const hash = md5(result.css);
    const hashedOutput = output.replace('${hash}', hash);
    fs.mkdirSync(path.dirname(hashedOutput), { recursive: true });
    fs.writeFileSync(hashedOutput, result.css);

    return { hashedOutput };
  }
}