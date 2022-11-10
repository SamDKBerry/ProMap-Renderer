import { createCanvas } from 'canvas';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { MapData } from '../../interfaces/mapData.interface';

export const renderMap = (mapData: MapData) => {
  const width = 2500;
  const height = 2500;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#878787';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;

  mapData.Brushes.forEach((Brush) => {
    if (mapData.Materials[Brush.material].startsWith('Skybox/')) {
      return;
    }
    if (mapData.Materials[Brush.material] === 'Shadow') {
      return;
    }
    if (mapData.Materials[Brush.material] === 'AIVisBlocker') {
      return;
    }
    if (mapData.Materials[Brush.material] === 'PlayerClip') {
      return;
    }
    if (Brush.mapDraw === 'False') {
      return;
    }
    Brush.Faces.forEach((face) => {
      ctx.fillStyle = mapData.Colors[face.color].value;
      const tris = splitTris(face.tris);
      const verts = splitVerts(face.verts);
      tris.forEach((tri) => {
        ctx.beginPath();
        ctx.moveTo(verts[tri[0]][0] * 4, verts[tri[0]][2] * 4);
        ctx.lineTo(verts[tri[1]][0] * 4, verts[tri[1]][2] * 4);
        ctx.lineTo(verts[tri[2]][0] * 4, verts[tri[2]][2] * 4);
        ctx.closePath();
        ctx.fill();
      });
    });
  });
  const fileBuffer = canvas.toBuffer('image/png');
  writeFile(fileBuffer, mapData.MapProperties.mapTitle);
};

const splitTris = (tris: string): number[][] => {
  const numberArray = tris.split(';').map((corner) => parseInt(corner));
  const groupedArray = [];
  while (numberArray.length) groupedArray.push(numberArray.splice(0, 3));
  return groupedArray;
};

const splitVerts = (verts: string): number[][] => {
  const centralOffset = 250;
  const vertArray = verts.split(';');
  const formatedVerts = vertArray.map((vert) => vert.split(',').map((axis) => parseFloat(axis) + centralOffset));
  return formatedVerts;
};

const writeFile = (fileBuffer: Buffer, mapName: string) => {
  const outputDirectory = './output';
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory);
  }
  writeFileSync(`${outputDirectory}/${mapName}.png`, fileBuffer);
};
