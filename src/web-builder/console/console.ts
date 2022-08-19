import * as colors from 'ansi-colors';

/** */
export function headerToString(
  name: string,
  value?: string,
  details?: string,
): string {
  let str = `--- ${colors.green(name)}`;
  if (value) {
    str += `: ${value}`;
  }
  if (details) {
      str += ` (${details})`;
  }
  return str;
}

/** */
export function printHeader(
  name: string,
  value?: string,
  details?: string
): void {
  console.log(headerToString(name, value, details));
}

/** */
export function detailsToString(msg: string): string {
  const lines = msg.split('\n');
  let str = '';
  for (let index = 0; index < lines.length; index++) {
    if (index > 0) {
      str += '\n';
    }
    str += `    ${lines[index]}`;
  }
  return str;
}

/** */
export function printDetails(msg: string): void {
  console.log(detailsToString(msg));
}

/** */
export function fatal(msg: string, error?: any): void {
  console.error(`    ${msg}`);
  if (error) {
    if (error.stack) {
      console.error(error.stack);
    }
    else {
      console.error(error.toString());
    }
  }
  process.exit(1);
}