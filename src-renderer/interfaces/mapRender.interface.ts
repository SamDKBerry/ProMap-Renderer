export interface MapRenderInfo {
  tris: RenderTriangle[];
  bounds: MapBounds;
}

export interface RenderConfig {
  worldSpaceToPixelScale: number;
  hideNonAutomapGeometry: boolean;
  hideSkybox: boolean;
  hideShadowBlocker: boolean;
  hideDownwardBrushes: boolean;
  backgroundColor: string;
  border: number;
}

export interface RenderTriangle {
  color: string;
  coordinates: Coordinate[];
  heighestPoint: number;
}

export interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Coordinate {
  x: number;
  y: number;
}
