import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'sass';

/** */
interface SCSSFunction {
  /** */
  (args: sass.Value[]): sass.Value;
}

/** */
export class SCSSFunctions {
  /** */
  private readonly functions: { [name: string]: SCSSFunction } = {};

  /** */
  register(name: string, scssFunction: SCSSFunction): void {
    this.functions[name] = scssFunction;
  }

  /** */
  get(): { [name: string]: SCSSFunction } {
    return this.functions;
  }

  /** */
  inlineImage(dir: string): void {
    const inlineImageFunc = (args: sass.Value[]): sass.Value => {
    // argument
      args[0].assertString();
      const fileArg = (args[0] as sass.SassString).text;

    // file
      const file = path.join(dir, fileArg);
      if (!fs.existsSync(file)) {
        throw new Error(`Inline image ${file} not found`);
      }
      const suffix = file.split('.').pop();

    // read
      const content = fs.readFileSync(file);
      const base64 = content.toString('base64');

    // image data
      const img = `url(data:image/${suffix};base64,${base64})`;
      
      return new sass.SassString(img, { quotes: false });
    };
    this.register('inline-img($img)', inlineImageFunc);
  }
}