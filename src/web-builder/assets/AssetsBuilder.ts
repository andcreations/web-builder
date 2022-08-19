import * as fs from 'fs';
import * as path from 'path';
import { printHeader, printDetails, fatal } from '../console';

/** */
const ASSETS_SUFFIXES = ['.png'];

/** */
export class AssetsBuilder {
  /** */
  constructor(
    private readonly srcDir: string,
    private readonly dstDir: string,
    private readonly suffixes = ASSETS_SUFFIXES,
  ) {}

  /** */
  private isAssetFile(file: string): boolean {
    return this.suffixes.some(prefix => file.endsWith(prefix));
  }

  /** */
  private removeAssets(): void {
  // do nothing if the directory does not exist
    if (!fs.existsSync(this.dstDir)) {
      return;
    }

    printDetails('Removing');
  // remove
    const files = fs.readdirSync(this.dstDir);
    for (const file of files) {
      if (this.isAssetFile(file)) {
        fs.unlinkSync(path.join(this.dstDir, file));
      }
    }
  }

 
  /** */
  private copyAssets(): void {
    if (!fs.existsSync(this.srcDir)) {
      printDetails(`Nothing to copy. No asset directory ${this.srcDir}`);
      return;
    }

  // create directory
    printDetails(`Creating directory: ${this.dstDir}`);
    fs.mkdirSync(this.dstDir, { recursive:true });

    printDetails(`Copying from directory: ${this.srcDir}`);
  // copy file
    const files = fs.readdirSync(this.srcDir);
    for (const file of files) {
      if (this.isAssetFile(file)) {
        const srcFile = path.join(this.srcDir, file);
        const dstFile = path.join(this.dstDir, file);
        try {
          fs.copyFileSync(srcFile, dstFile);
        } catch (error) {
          fatal(`Failed to copy ${srcFile} to ${dstFile}`, error);
        }
      }
      else {
        printDetails(`Skipping file ${file} (not an asset file)`);
      }
    }
  }

  /** */
  run(): void {
    printHeader('Building assets');
    this.removeAssets();
    this.copyAssets();
  }
}