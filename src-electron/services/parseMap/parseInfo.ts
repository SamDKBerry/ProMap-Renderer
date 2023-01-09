import { pathToCommunityMaps } from '../fileSystem/paths';
import { asyncReadFile } from './readFile';

export const mapInfo = async (mapId: string) => {
  const absoluteFilePath = `${pathToCommunityMaps}/${mapId}/map.info`;
  const fileContent = await asyncReadFile(absoluteFilePath);
  return fileContentToMapInfo(fileContent);
};

const fileContentToMapInfo = (fileContent: string) => {
  const fileLines = fileContent.split('\r\n').filter((line) => line !== '');

  const jsonFilesLines = fileLines.map((line, index) => {
    let [key, ...values] = line.split('=');
    let value = values.join('=');
    const lineContent =
      value === '' ? `${JSON.stringify(key)} : null` : `${JSON.stringify(key)} : ${JSON.stringify(value)}`;
    return index === fileLines.length - 1 ? lineContent : lineContent + ',';
  });

  jsonFilesLines.unshift('{');
  jsonFilesLines.push('}');
  const jsonFile = jsonFilesLines.join('\n');
  const mapInfo = JSON.parse(jsonFile);
  return mapInfo;
};
