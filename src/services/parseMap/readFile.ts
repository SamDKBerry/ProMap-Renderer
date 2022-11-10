import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { exit } from 'process';

export const asyncReadFile = async (absoluteFilePath: string) => {
  try {
    const result = await fsPromises.readFile(join(absoluteFilePath), 'utf-8');
    return result;
  } catch (err) {
    console.error('Could not read file: ', absoluteFilePath);
    console.error(err);
    exit(1);
  }
};
