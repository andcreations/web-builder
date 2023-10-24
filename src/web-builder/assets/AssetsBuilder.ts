import * as fs from 'fs';
import * as path from 'path';
import { printHeader, printDetails, fatal } from '../console';

/** */
const DEFAULT_ASSETS_SUFFIXES = ['.png'];

/** */
export interface AssetsBuilderOptions {
  /** Directory with source assets. */
  srcDir: string;

  /** Destination directory. */
  dstDir: string;

  /** Suffixes of files to copy. */
  suffixes?: string[];
}

/** */
export class AssetsBuilder {
  /** */
  constructor(private readonly options?: AssetsBuilderOptions) {
  }

  /** */
  private isAssetFile(file: string): boolean {
    const { suffixes = DEFAULT_ASSETS_SUFFIXES } = this.options;
    return suffixes.some(prefix => file.endsWith(prefix));
  }

  /** */
  private removeAssets(): void {
    const { dstDir } = this.options;

  // do nothing if the directory does not exist
    if (!fs.existsSync(dstDir)) {
      return;
    }

    printDetails('Removing');
  // remove
    const files = fs.readdirSync(dstDir);
    for (const file of files) {
      if (this.isAssetFile(file)) {
        fs.unlinkSync(path.join(dstDir, file));
      }
    }
  }

 
  /** */
  private copyAssets(): void {
    const { srcDir, dstDir } = this.options;

    if (!fs.existsSync(srcDir)) {
      printDetails(`Nothing to copy. No asset directory ${srcDir}`);
      return;
    }

  // create destination directory
    if (!fs.existsSync(dstDir)) {
      printDetails(`Creating directory: ${dstDir}`);
      fs.mkdirSync(dstDir, { recursive: true });
    }

    printDetails(`Copying from directory: ${srcDir}`);
  // copy file
    const files = fs.readdirSync(srcDir);
    for (const file of files) {
      if (this.isAssetFile(file)) {
        const srcFile = path.join(srcDir, file);
        const dstFile = path.join(dstDir, file);
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