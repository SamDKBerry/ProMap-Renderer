import { existsSync, PathLike } from 'fs';
import { readdir } from 'fs/promises';
import { pathToMaps } from './paths';

export const findCommunityMaps = async () => {
  return await getDirectories(pathToMaps);
};

const getDirectories = async (source: PathLike) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((dirent) => existsSync(`${source}/${dirent}/map.map`));
