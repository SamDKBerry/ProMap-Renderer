export interface MapRenderInfo {
  tris: RenderTriangle[];
  bounds: MapBounds;
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
