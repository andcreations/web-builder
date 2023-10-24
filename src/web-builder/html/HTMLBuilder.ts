import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { printHeader, printDetails } from '../console';
import { matchFile } from '../io';

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
export class HTMLBuilder {
  /** */
  constructor(private readonly options: HTMLBuilderOptions) {
  }

  /** */
  private findAppJSFile(): string {
    return matchFile(this.options.dstDir, /app.*js/);
  }

  /** */
  private readTemplate(): string {
    return fs.readFileSync(this.options.templateFile).toString();
  }

  /** */
  private getDstFile(): string {
    return path.join(this.options.dstDir, 'index.html');
  }

  /** */
  private writeIndexHTML(content: string): void {
    fs.writeFileSync(this.getDstFile(), content);
  }

  /** */ 
  run(): void {
    printHeader('Building HTML');
    printDetails(`Building: ${this.options.templateFile}`);
    printDetails(`       -> ${this.getDstFile()}`);

  // read
    const template = this.readTemplate();

  // render
    const data = {
      appJsFile: this.findAppJSFile(),
      cssFiles: this.options.cssFiles,
    }
    const content = ejs.render(template, data);

  // write
    this.writeIndexHTML(content);
  }
}