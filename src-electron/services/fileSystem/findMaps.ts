import { existsSync, PathLike, readdirSync, statSync } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { pathToCommunityMaps, pathToEditorMaps } from './paths';

export const findCommunityMaps = async () => {
  const files = await getDirectories(pathToCommunityMaps);
  return files.filter((dirent) => existsSync(`${pathToCommunityMaps}/${dirent}/map.map`));
};

export const findEditorMaps = async () => {
  return getFilesRecursively(pathToEditorMaps).filter((file) => file.endsWith('.map'));
};

const getDirectories = async (source: PathLike) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFilesRecursively = (directory: string) => {
  let files: string[] = [];

  const getFilesRecursivelyLoop = (directory: string) => {
    const filesInDirectory = readdirSync(directory);
    for (const file of filesInDirectory) {
      const absolute = path.join(directory, file);
      if (statSync(absolute).isDirectory()) {
        getFilesRecursivelyLoop(absolute);
      } else {
        files.push(absolute);
      }
    }
  };

  getFilesRecursivelyLoop(directory);
  return files;
};
