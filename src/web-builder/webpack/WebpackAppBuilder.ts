import * as fs from 'fs';
import * as path from 'path';
import webpack from 'webpack';

import { printDetails, printHeader } from '../console';

/** */
export interface WebpackAppBuilderOptions {
  /** Destination directory. */
  dstDir: string;

  /** */
  dstFiles: Array<string | RegExp>;

  /** */
  webpackFile: string;
}

/** */
export class WebpackAppBuilder {
  /** */
  constructor(private readonly options: WebpackAppBuilderOptions) {
  }

  /** */
  private removeDstFiles(): void {
    const dstDir = this.options.dstDir;
    if (!fs.existsSync(dstDir)) {
      return;
    }

    const files = fs.readdirSync(dstDir);
    for (const file of files) {
      const match = this.options.dstFiles.some(dstFile => {
        if (typeof dstFile === 'string') {
          return dstFile === file;
        }
        return file.match(dstFile);
      });
      if (match) {
        fs.unlinkSync(path.join(dstDir, file));
      }
    }
  }

  /** */
  run(): Promise<void> {
    printHeader('Building application', this.options.webpackFile);

  // remove existing output file
    this.removeDstFiles();
  
  // read configuration
    const config = require(this.options.webpackFile);
  
  // build
    const compiler = webpack(config);
    return new Promise((resolve, reject) => {      
      compiler.run((error, stats) => {
        if (error) {
          reject(error);
          return;
        }
        
        printDetails(stats.toString());
        if (stats.hasErrors()) {
          reject(new Error('Webpack failed'));
          return;
        }

        resolve();
      });
    });
  }
}