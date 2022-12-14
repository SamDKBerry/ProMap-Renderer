import { MapRenderInfo, RenderConfig, RenderTriangle } from '../../src-types/mapRender';

export const drawCanvas = (renderData: MapRenderInfo, renderConfig: RenderConfig) => {
  const width = Math.abs(renderData.bounds.minX - renderData.bounds.maxX) + renderConfig.border;
  const height = Math.abs(renderData.bounds.minY - renderData.bounds.maxY) + renderConfig.border;
  const xOffset = renderData.bounds.minX * -1 + renderConfig.border / 2;
  const yOffset = renderData.bounds.minY - renderConfig.border / 2;

  const imageContainer = document.getElementById('map-image-container');
  if (!imageContainer) {
    console.error("Couldn't find image container");
    return;
  }
  const canvas = imageContainer?.appendChild(document.createElement('canvas')) as HTMLCanvasElement;
  canvas.id = 'mapCanvas';
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.fillStyle = renderConfig.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  renderData.tris.sort((a, b) => a.heighestPoint - b.heighestPoint);
  renderData.tris.forEach((tri) => {
    drawTriangle(tri, ctx, height, xOffset, yOffset);
  });
};

const drawTriangle = (
  tri: RenderTriangle,
  ctx: CanvasRenderingContext2D,
  height: number,
  xOffset: number,
  yOffset: number
) => {
  ctx.fillStyle = tri.color;
  ctx.strokeStyle = tri.color;
  ctx.beginPath();
  ctx.moveTo(tri.coordinates[0].x + xOffset, height - tri.coordinates[0].y + yOffset);
  ctx.lineTo(tri.coordinates[1].x + xOffset, height - tri.coordinates[1].y + yOffset);
  ctx.lineTo(tri.coordinates[2].x + xOffset, height - tri.coordinates[2].y + yOffset);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};
