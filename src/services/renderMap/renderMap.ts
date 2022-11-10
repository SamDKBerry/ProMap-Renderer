import { createCanvas } from 'canvas';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { MapData } from '../../interfaces/mapData.interface';
import { RenderTriangle } from '../../interfaces/mapRender.interface';

const worldSpaceToPixelScale = 4;

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

  const trisToRender = trianglesToRender(mapData);
  trisToRender.sort((a, b) => a.heighestPoint - b.heighestPoint);

  trisToRender.forEach((tri) => {
    drawTriangle(tri, ctx);
  });

  const fileBuffer = canvas.toBuffer('image/png');
  writeFile(fileBuffer, mapData.MapProperties.mapTitle);
};

const trianglesToRender = (mapData: MapData): RenderTriangle[] => {
  const trisToRender: RenderTriangle[] = [];

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
      const tris = splitTris(face.tris);
      const verts = splitVerts(face.verts);
      tris.forEach((tri) => {
        trisToRender.push({
          color: mapData.Colors[face.color].value,
          coordinates: [
            { x: verts[tri[0]][0] * worldSpaceToPixelScale, y: verts[tri[0]][2] * worldSpaceToPixelScale },
            { x: verts[tri[1]][0] * worldSpaceToPixelScale, y: verts[tri[1]][2] * worldSpaceToPixelScale },
            { x: verts[tri[2]][0] * worldSpaceToPixelScale, y: verts[tri[2]][2] * worldSpaceToPixelScale },
          ],
          heighestPoint: HeighestVert(verts),
        });
      });
    });
  });

  return trisToRender;
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

const HeighestVert = (verts: number[][]) => {
  const zIndexs = verts.map((vert) => vert[1]);
  return Math.max.apply(null, zIndexs);
};

const drawTriangle = (tri: RenderTriangle, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = tri.color;
  ctx.beginPath();
  ctx.moveTo(tri.coordinates[0].x, tri.coordinates[0].y);
  ctx.lineTo(tri.coordinates[1].x, tri.coordinates[1].y);
  ctx.lineTo(tri.coordinates[2].x, tri.coordinates[2].y);
  ctx.closePath();
  ctx.fill();
};
