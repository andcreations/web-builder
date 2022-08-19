import * as fs from 'fs';
import * as path from 'path';
import { printHeader, printDetails } from '../console';
import { SCSSCompiler } from './SCSSCompiler';
import { SCSSFunctions } from './SCSSFunctions';

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
export class StyleBuilder {
  /** */
  constructor(private readonly options: StyleBuilderOptions) {
  }

  /** */
  private removeCSSFiles(): void {
    const { dstDir } = this.options;
    if (!fs.existsSync(dstDir)) {
      return;
    }

    const files = fs.readdirSync(dstDir);
    const toDelete = files.filter(file => file.endsWith('.css'));
    if (toDelete.length) {
      toDelete.forEach(file => {
        const absFile = path.join(dstDir, file);
        printDetails(`Deleting: ${absFile}`);
        fs.unlinkSync(absFile);
      })
    }
  }

  /** */
  run(): void {
    printHeader('Building styles');
    this.removeCSSFiles();

  // functions
    const scssFunctions = new SCSSFunctions();
    if (this.options.inlineImagesDir) {
      scssFunctions.inlineImage(this.options.inlineImagesDir);
    }
  
    if (this.options.includePaths?.length) {
      printDetails('Include paths:');
      for (const includePath of this.options.includePaths) {
        printDetails(`    ${includePath}`);
      }
    }
  // compile
    for (const styleFile of this.options.styleFiles) {
      printDetails(`Building: ${styleFile.input}`);
      const scssCompiler = new SCSSCompiler(scssFunctions,{
        includePaths: this.options.includePaths,
      });
      const { hashedOutput } = scssCompiler.compile(
        styleFile.input,
        styleFile.output,
      );
      printDetails(`       -> ${hashedOutput}`);
    }
  }
}