import { pathToMaps } from '../fileSystem/paths';
import { asyncReadFile } from './readFile';

enum MapDataSection {
  NONE,
  PROPERTIES,
  SPLAT,
  MATERIAL,
  COLOR,
  BRUSH,
  FACE,
  NODE,
}

export const mapData = async (mapId: string) => {
  const absoluteFilePath = `${pathToMaps}/${mapId}/map.map`;
  const fileContent = await asyncReadFile(absoluteFilePath);
  console.log(mapId);
  return fileContentToMapObject(fileContent);
};

const fileContentToMapObject = (fileContent: string) => {
  const fileLines = fileContent.split('\r\n').filter((line) => line !== '');
  const fileVersion = fileLines.shift();
  if (fileVersion !== '﻿Version_1') {
    console.warn(`No official support for file version: ${fileVersion}`);
  } else {
    console.log(`Map file version is ${fileVersion}`);
  }

  let section = MapDataSection.NONE;

  const jsonFilesLines = fileLines.map((line, index) => {
    if (section !== MapDataSection.NONE) {
      const { jsonString, stillInBlock } = sectionLogic(section, line, fileLines[index + 1], fileLines[index + 2]);
      section = stillInBlock ? section : MapDataSection.NONE;
      return jsonString;
    }
    if (line === 'MapProperties{') {
      section = MapDataSection.PROPERTIES;
      return '"MapProperties": {';
    }
    if (line === 'SplatInfo{') {
      section = MapDataSection.SPLAT;
      return '"SplatInfo": {';
    }
    if (line === 'Materials{') {
      section = MapDataSection.MATERIAL;
      return '"Materials": [';
    }
    if (line === 'Colors{') {
      section = MapDataSection.COLOR;
      return '"Colors": [';
    }
    if (line === 'Face{') {
      section = MapDataSection.FACE;
      return '"Faces": [{';
    }
    if (line === 'Brushes{') {
      return '"Brushes": [';
    }
    if (line === 'Brush{') {
      section = MapDataSection.BRUSH;
      return '{';
    }
    if (line === 'Nodes{') {
      section = MapDataSection.NODE;
      return '"Nodes": [';
    }
    if (lastLineOfFile(fileLines.length, index)) {
      return ']';
    }
    console.warn(`Line ${index} couldn't be handled, returning original line.`);
    return line;
  });

  jsonFilesLines.unshift('{\n');
  jsonFilesLines.push('}');
  const jsonFile = jsonFilesLines.join('\n');
  const mapData = JSON.parse(jsonFile);
  return mapData;
};

const sectionLogic = (section: MapDataSection, line: string, nextLine: string, nextNextLine: string): SectionLine => {
  switch (section) {
    case MapDataSection.PROPERTIES: {
      return propertiesLine(line, nextLine);
    }
    case MapDataSection.SPLAT: {
      return propertiesLine(line, nextLine);
    }
    case MapDataSection.BRUSH: {
      return brushLine(line, nextLine);
    }
    case MapDataSection.FACE: {
      return faceLine(line, nextLine, nextNextLine);
    }
    case MapDataSection.MATERIAL: {
      return materialLine(line, nextLine);
    }
    case MapDataSection.COLOR: {
      return colorLine(line, nextLine);
    }
    case MapDataSection.NODE: {
      return nodeLine(line, nextLine);
    }
    default: {
      return { jsonString: '', stillInBlock: false };
    }
  }
};

const propertiesLine = (line: string, nextLine: string): SectionLine => {
  if (lastLineInBlock(line)) {
    return { jsonString: '},', stillInBlock: false };
  }
  return { jsonString: equalsLineToJsonWithColorConversion(line, nextLine), stillInBlock: true };
};

const materialLine = (line: string, nextLine: string): SectionLine => {
  if (lastLineInBlock(line)) {
    return closingBlockLine();
  }

  let jsonLine = JSON.stringify(line);
  if (nextLine !== '}') {
    jsonLine = jsonLine + ',';
  }
  return { jsonString: jsonLine, stillInBlock: true };
};

const colorLine = (line: string, nextLine: string): SectionLine => {
  if (lastLineInBlock(line)) {
    return closingBlockLine();
  }

  const splitLine = line
    .split('=')
    .filter((str) => str !== '')
    .map((str) => JSON.stringify(str));
  let jsonLine = '{"name": ' + splitLine[0] + ', "value": ' + unityColorToRGBA(splitLine[1]) + '}';
  if (nextLine !== '}') {
    jsonLine = jsonLine + ',';
  }
  return { jsonString: jsonLine, stillInBlock: true };
};

const brushLine = (line: string, nextLine: string): SectionLine => ({
  jsonString: equalsLineToJson(line, nextLine),
  stillInBlock: nextLine !== 'Face{',
});

const faceLine = (line: string, nextLine: string, nextNextLine: string): SectionLine => {
  if (line === 'Face{') {
    return { jsonString: '{', stillInBlock: true };
  } else if (nextLine === 'Brush{') {
    return { jsonString: ']},', stillInBlock: false };
  } else if (nextLine === 'Nodes{') {
    return { jsonString: '],', stillInBlock: false };
  } else if (nextNextLine === 'Nodes{') {
    return { jsonString: ']}', stillInBlock: true };
  } else if (lastLineInBlock(line)) {
    return { jsonString: lastLineInBlock(nextLine) ? '}' : '},', stillInBlock: true };
  } else {
    const lineContent = equalsLineToJson(line, nextLine);
    return { jsonString: lineContent, stillInBlock: true };
  }
};

const nodeLine = (line: string, nextLine: string): SectionLine => {
  if (line === 'Node{') {
    return { jsonString: '{', stillInBlock: true };
  }
  if (lastLineInBlock(line)) {
    if (lastLineInBlock(nextLine)) {
      return { jsonString: '}', stillInBlock: false };
    } else {
      return { jsonString: '},', stillInBlock: true };
    }
  }
  const lineContent = line.includes('=') ? equalsLineToJson(line, nextLine) : '"type": "' + line + '",';
  return { jsonString: lineContent, stillInBlock: true };
};

const lastLineInBlock = (line: string): boolean => line === '}';
const closingBlockLine = () => ({ jsonString: '],', stillInBlock: false });
const lastLineOfFile = (totalLines: number, index: number) => totalLines - 1 === index;

const equalsLineToJson = (line: string, nextLine: string) => {
  let [key, ...values] = line.split('=');
  let value = values.join('=');
  const lineContent =
    value === '' ? `${JSON.stringify(key)} : null` : `${JSON.stringify(key)} : ${JSON.stringify(value)}`;
  return nextLine.includes('}') ? lineContent : lineContent + ',';
};

const equalsLineToJsonWithColorConversion = (line: string, nextLine: string) => {
  let [key, ...values] = line.split('=');
  let value = values.join('=');
  let lineContent;
  if (key.endsWith('Color')) {
    value = unityColorToRGBA(value);
    lineContent = value === '' ? `${JSON.stringify(key)} : null` : `${JSON.stringify(key)} : ${value}`;
  } else {
    lineContent = value === '' ? `${JSON.stringify(key)} : null` : `${JSON.stringify(key)} : ${JSON.stringify(value)}`;
  }

  return nextLine.includes('}') ? lineContent : lineContent + ',';
};

const unityColorToRGBA = (unityColor: string) => {
  const rgb = unityColor
    .split(',')
    .map((v: string) => v.replace('"', ''))
    .map((v: string, index: number) => (index === 3 ? v : Math.round(parseFloat(v) * 255).toString()));
  return JSON.stringify('rgba(' + rgb.join(', ') + ')');
};
interface SectionLine {
  jsonString: string;
  stillInBlock: boolean;
}
