import { Brush, Face, MapData } from '../../src-types/mapData';
import { Coordinate, MapRenderInfo as MapRenderData, RenderConfig, RenderTriangle } from '../../src-types/mapRender';

export const trianglesToRender = (mapData: MapData, renderConfig: RenderConfig): MapRenderData => {
  const trisToRender: RenderTriangle[] = [];

  let minX = 1000000,
    minY = 1000000,
    maxX = -1000000,
    maxY = -1000000;

  mapData.Brushes.forEach((brush) => {
    if (!shouldRenderBrush(brush, mapData.Materials, renderConfig)) {
      return;
    }

    brush.Faces.forEach((face) => {
      const tris = splitTris(face.tris);
      const verts = splitVerts(face.verts);
      tris.forEach((tri) => {
        const coordinates = [
          {
            x: verts[tri[0]][0] * renderConfig.worldSpaceToPixelScale,
            y: verts[tri[0]][2] * renderConfig.worldSpaceToPixelScale,
          },
          {
            x: verts[tri[1]][0] * renderConfig.worldSpaceToPixelScale,
            y: verts[tri[1]][2] * renderConfig.worldSpaceToPixelScale,
          },
          {
            x: verts[tri[2]][0] * renderConfig.worldSpaceToPixelScale,
            y: verts[tri[2]][2] * renderConfig.worldSpaceToPixelScale,
          },
        ];
        if (renderConfig.hideDownwardBrushes && brushFacesDown(coordinates)) {
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
          color: getColor(mapData, brush, face),
          coordinates,
          heighestPoint: HeighestVert(verts),
        });
      });
    });
  });

  return { tris: trisToRender, bounds: { minX, maxX, minY, maxY } };
};

const getColor = (mapData: MapData, brush: Brush, face: Face) => {
  if (
    mapData.Materials[brush.material] === 'Natural/Lava01_Tile' ||
    mapData.Materials[brush.material] === 'Natural/LavaFlow_Tile'
  ) {
    return mapData.MapProperties.lavaEmissiveColor;
  }
  if (mapData.Materials[brush.material] === 'Natural/ToxicWaste01_Tile') {
    return mapData.MapProperties.wasteEmissiveColor;
  }
  if (mapData.Materials[brush.material] === 'Natural/Water01_Tile') {
    return mapData.MapProperties.waterColor;
  }
  return mapData.Colors[face.color].value;
};

const shouldRenderBrush = (brush: Brush, materials: string[], rednerConfig: RenderConfig): boolean => {
  if (
    (rednerConfig.hideSkybox && materials[brush.material].startsWith('Skybox/')) ||
    (rednerConfig.hideShadowBlocker && materials[brush.material] === 'Shadow') ||
    materials[brush.material] === 'AIVisBlocker' ||
    materials[brush.material] === 'PlayerClip' ||
    (rednerConfig.hideNonAutomapGeometry && brush.mapDraw === 'False')
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
