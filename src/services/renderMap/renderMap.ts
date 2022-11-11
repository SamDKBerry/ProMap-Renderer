import { createCanvas } from 'canvas';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Brush, MapData } from '../../interfaces/mapData.interface';
import { Coordinate, RenderTriangle } from '../../interfaces/mapRender.interface';

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
    drawTriangle(tri, ctx, height);
  });

  const fileBuffer = canvas.toBuffer('image/png');
  writeFile(fileBuffer, mapData.MapProperties.mapTitle);
};

const trianglesToRender = (mapData: MapData): RenderTriangle[] => {
  const trisToRender: RenderTriangle[] = [];

  mapData.Brushes.forEach((Brush) => {
    if (!shouldRenderBrush(Brush, mapData.Materials)) {
      return;
    }

    Brush.Faces.forEach((face) => {
      const tris = splitTris(face.tris);
      const verts = splitVerts(face.verts);
      tris.forEach((tri) => {
        const coordinates = [
          { x: verts[tri[0]][0] * worldSpaceToPixelScale, y: verts[tri[0]][2] * worldSpaceToPixelScale },
          { x: verts[tri[1]][0] * worldSpaceToPixelScale, y: verts[tri[1]][2] * worldSpaceToPixelScale },
          { x: verts[tri[2]][0] * worldSpaceToPixelScale, y: verts[tri[2]][2] * worldSpaceToPixelScale },
        ];
        if (brushFacesDown(coordinates)) {
          return;
        }
        trisToRender.push({
          color: mapData.Colors[face.color].value,
          coordinates,
          heighestPoint: HeighestVert(verts),
        });
      });
    });
  });

  return trisToRender;
};

const shouldRenderBrush = (brush: Brush, materials: string[]): boolean => {
  if (
    materials[brush.material].startsWith('Skybox/') ||
    materials[brush.material] === 'Shadow' ||
    materials[brush.material] === 'AIVisBlocker' ||
    materials[brush.material] === 'PlayerClip' ||
    brush.mapDraw === 'False'
  ) {
    return false;
  } else {
    return true;
  }
};

const brushFacesDown = (tri: Coordinate[]): boolean => {
  const end = tri.length - 1;
  let sum = tri[end].x * tri[0].y - tri[0].x * tri[end].y;
  for (let i = 0; i < end; ++i) {
    const n = i + 1;
    sum += tri[i].x * tri[n].y - tri[n].x * tri[i].y;
  }
  return sum > 0;
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

const drawTriangle = (tri: RenderTriangle, ctx: CanvasRenderingContext2D, height: number) => {
  ctx.fillStyle = tri.color;
  ctx.beginPath();
  ctx.moveTo(tri.coordinates[0].x, height - tri.coordinates[0].y);
  ctx.lineTo(tri.coordinates[1].x, height - tri.coordinates[1].y);
  ctx.lineTo(tri.coordinates[2].x, height - tri.coordinates[2].y);
  ctx.closePath();
  ctx.fill();
};
