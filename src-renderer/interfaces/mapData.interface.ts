export interface MapData {
  MapProperties: MapProperties;
  Colors: Color[];
  Materials: string[];
  Brushes: Brush[];
}

export interface Color {
  name: string;
  value: string;
}

export interface MapProperties {
  mapTitle: string;
}

export interface Brush {
  mapDraw: string;
  material: number;
  Faces: Face[];
}

export interface Face {
  tris: string;
  verts: string;
  color: number;
}
