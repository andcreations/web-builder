import * as fs from 'fs';

/** */
export function matchFiles(dir: string, regex: RegExp): string[] {
  const files = fs.readdirSync(dir);
  const matched: string[] = [];
  for (const file of files) {
    if (file.match(regex)) {
      matched.push(file);
    }
  }
  return matched;
}

/** */
export function matchFile(dir: string, regex: RegExp): string {
  const matched = matchFiles(dir, regex);
  if (!matched.length) {
    throw new Error(`No file in directory ${dir} matches regex ${regex}`);
  }
  if (matched.length > 1) {
    throw new Error(
      `Two or more files matched by regex ${regex} ` +
      `in directory ${dir}`
    );
  }
  return matched[0];
}