import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

export const asyncReadFile = promisify(readFile);
export const asyncWriteFile = promisify(writeFile);
