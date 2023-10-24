import * as path from 'path';
import { FileChangeTracker, TreeChangeTracker } from '@andcreations/io';

import { AssetsBuilder, AssetsBuilderOptions } from '../assets';
import { StyleBuilder, StyleBuilderOptions } from '../styles';
import { HTMLBuilder, HTMLBuilderOptions } from '../html';
import { WebpackAppBuilder, WebpackAppBuilderOptions } from '../webpack';

/** */
export interface WatchOptions {
  /** Watch interval in milliseconds. */
  interval?: number;

  /** Assets builder options. */
  assetsBuilderOptions?: AssetsBuilderOptions;

  /** Directories with style files. */
  styleDirs?: string[];

  /** Options for style builder. */
  styleBuilderOptions?: StyleBuilderOptions;

  /** HTML builder options. */
  htmlBuilderOptions?: HTMLBuilderOptions;

  /** Directories with the application source. */
  appDirs?: string[];

  /** Webpack builder options. */
  webpackBuilderOptions?: WebpackAppBuilderOptions;
}

/** */
const DEFAULT_INTERVAL = 1600;

/** */
const IGNORED_FILE_PREFIXES = ['#', '.'];

/** */
export class Watch {
  /** */
  private timeout: NodeJS.Timer;

  /** */
  private assetsChangeTracker: TreeChangeTracker;

  /** */
  private styleChangeTrackers: TreeChangeTracker[] = [];

  /** */
  private htmlChangeTracker: FileChangeTracker;

  /** */
  private appChangeTrackers: TreeChangeTracker[] = [];

  /** */
  constructor(private readonly options: WatchOptions) {
  }

  /** */
  private handleError(error: any): void {
    console.log(error);
  }

  /** */
  private createChangeTrackers(): void {
    const filter = (file: string) => {
      return !IGNORED_FILE_PREFIXES.some(prefix => file.startsWith(prefix));
    };

  // assets change tracker
    const { assetsBuilderOptions } = this.options;
    if (assetsBuilderOptions) {
      this.assetsChangeTracker = new TreeChangeTracker(
        assetsBuilderOptions.srcDir,
        { filter },
      );
    }

  // style change trackers
    for (const styleDir of this.options?.styleDirs || []) {
      const tracker = new TreeChangeTracker(styleDir, { filter });
      this.styleChangeTrackers.push(tracker);
    }

  // HTML change tracker
    const { htmlBuilderOptions } = this.options;
    if (htmlBuilderOptions) {
      this.htmlChangeTracker = new FileChangeTracker(
        [
          htmlBuilderOptions.templateFile,
          ...htmlBuilderOptions.cssFiles.map(cssFile => {
            return path.join(htmlBuilderOptions.dstDir, cssFile.file);
          }),
        ],
      );
    }

  // application change tracker
    for (const appDir of this.options?.appDirs || []) {
      const tracker = new TreeChangeTracker(appDir, { filter });
      this.appChangeTrackers.push(tracker);
    }
  }

  /** */
  private buildAssets(): void {
    const { assetsBuilderOptions } = this.options;
    if (!assetsBuilderOptions) {
      return;
    }

  // build
    const builder = new AssetsBuilder(assetsBuilderOptions);
    builder.run();
  }

  /** */
  private buildStyles(): void {
    const builder = new StyleBuilder(this.options.styleBuilderOptions);
    builder.run();
  }

  /** */
  private buildHTML(): void {
    const { htmlBuilderOptions } = this.options;
    if (!htmlBuilderOptions) {
      return;
    }

  // build
    const builder = new HTMLBuilder(htmlBuilderOptions);
    builder.run();
  }

  /** */
  private async buildApp(): Promise<void> {
    const { webpackBuilderOptions } = this.options;
    if (!webpackBuilderOptions) {
      return;
    }

  // build
    const builder = new WebpackAppBuilder(webpackBuilderOptions);
    await builder.run();
  }

  /** */
  private async checkChanges(): Promise<void> {
  // check
    const assetsChanged = (
      this.assetsChangeTracker &&
      this.assetsChangeTracker.isChanged()
    );
    const stylesChanged = this.styleChangeTrackers.some(tracker => {
      return tracker.isChanged();
    });
    const htmlChanged = (
      this.htmlChangeTracker &&
      this.htmlChangeTracker.isChanged()
    );
    const appChanged = this.appChangeTrackers.some(tracker => {
      return tracker.isChanged();
    });

  // action
    try {
      if (assetsChanged) {
        this.buildAssets();
      }
      if (stylesChanged) {
        this.buildStyles();
      }
      if (appChanged) {
        await this.buildApp();
      }
      if (htmlChanged || stylesChanged || appChanged) {
        this.buildHTML();
      }
    } catch (error) {
      this.handleError(error);
      return;
    }
  }

  /** */
  private scheduleCheck(): void {
    this.timeout = setTimeout(
      async () =>
      {
        this.checkChanges();
        this.scheduleCheck();
      },
      this.options?.interval || DEFAULT_INTERVAL,
    );
  }

  /** */
  watch(): void {
  // initialize
    this.createChangeTrackers();

  // watch
    if (this.timeout) {
      throw new Error('Already watching');
    }
    this.scheduleCheck();
  }

  /** */
  unwatch(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
  }
}