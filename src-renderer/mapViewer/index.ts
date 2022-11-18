import { Brush, MapData } from '../interfaces/mapData.interface';
import { Coordinate, MapRenderInfo as MapRenderData, RenderTriangle } from '../interfaces/mapRender.interface';

const worldSpaceToPixelScale = 4;

window.onload = function () {
  renderLevel();
};

const renderLevel = async () => {
  const mapId = await window.electronAPI.currentMap();
  try {
    const mapData = await window.electronAPI.mapData(mapId);
    const loadingElement = document.getElementById('loading-message');
    loadingElement?.remove();
    renderMap(mapData);
  } catch {
    const loadingElement = document.getElementById('loading-message');
    if (!loadingElement) {
      return;
    }
    loadingElement.innerText = `Couldn't parse data for map: ${mapId}`;
  }
};

const renderMap = (mapData: MapData) => {
  const renderData = trianglesToRender(mapData);
  drawCanvas(renderData);
};

const trianglesToRender = (mapData: MapData): MapRenderData => {
  const trisToRender: RenderTriangle[] = [];

  let minX = 1000000,
    minY = 1000000,
    maxX = -1000000,
    maxY = -1000000;

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

        coordinates.forEach((coord) => {
          if (coord.x > maxX) {
            maxX = coord.x;
          }
          if (coord.x < minX) {
            minX = coord.x;
          }
          if (coord.y > maxY) {
            maxY = coord.y;
          }
          if (coord.y < minY) {
            minY = coord.y;
          }
        });
        trisToRender.push({
          color: mapData.Colors[face.color].value,
          coordinates,
          heighestPoint: HeighestVert(verts),
        });
      });
    });
  });

  return { tris: trisToRender, bounds: { minX, maxX, minY, maxY } };
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
  const groupedArray: number[][] = [];
  while (numberArray.length) groupedArray.push(numberArray.splice(0, 3));
  return groupedArray;
};

const splitVerts = (verts: string): number[][] => {
  const centralOffset = 0;
  const vertArray = verts.split(';');
  const formatedVerts = vertArray.map((vert) => vert.split(',').map((axis) => parseFloat(axis) + centralOffset));
  return formatedVerts;
};

const HeighestVert = (verts: number[][]) => {
  const zIndexs = verts.map((vert) => vert[1]);
  return Math.max.apply(null, zIndexs);
};

const drawTriangle = (
  tri: RenderTriangle,
  ctx: CanvasRenderingContext2D,
  height: number,
  xOffset: number,
  yOffset: number
) => {
  ctx.fillStyle = tri.color;
  ctx.beginPath();
  ctx.moveTo(tri.coordinates[0].x + xOffset, height - tri.coordinates[0].y + yOffset);
  ctx.lineTo(tri.coordinates[1].x + xOffset, height - tri.coordinates[1].y + yOffset);
  ctx.lineTo(tri.coordinates[2].x + xOffset, height - tri.coordinates[2].y + yOffset);
  ctx.closePath();
  ctx.fill();
};

const drawCanvas = (renderData: MapRenderData) => {
  const border = 40;
  const width = Math.abs(renderData.bounds.minX - renderData.bounds.maxX) + border;
  const height = Math.abs(renderData.bounds.minY - renderData.bounds.maxY) + border;
  const xOffset = renderData.bounds.minX * -1 + border / 2;
  const yOffset = renderData.bounds.minY - border / 2;

  const imageContainer = document.getElementById('map-image-container');
  if (!imageContainer) {
    console.error("Couldn't find image container");
    return;
  }
  const canvas = imageContainer?.appendChild(document.createElement('canvas')) as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.fillStyle = '#878787';
  ctx.fillRect(0, 0, width, height);

  renderData.tris.sort((a, b) => a.heighestPoint - b.heighestPoint);
  renderData.tris.forEach((tri) => {
    drawTriangle(tri, ctx, height, xOffset, yOffset);
  });
};
