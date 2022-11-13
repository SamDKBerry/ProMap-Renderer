import { existsSync, PathLike } from 'fs';
import { readdir } from 'fs/promises';

export const findCommunityMaps = async () => {
  return await getDirectories(`${process.env.APPDATA}/../LocalLow/BoundingBoxSoftware/Prodeus/CloudMaps`);
};

const getDirectories = async (source: PathLike) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((dirent) => existsSync(`${source}/${dirent}/map.map`));
