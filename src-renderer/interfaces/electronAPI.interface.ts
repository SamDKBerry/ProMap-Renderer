import { MapData } from './mapData.interface';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export interface ElectronAPI {
  getMaps: () => string[];
  pathToMaps: () => string;
  mapData: (mapId: string) => MapData;
  navigateToMap: (mapId: string) => void;
  navigateToHome: () => void;
  currentMap: () => string;
  saveCanvasAsImage: (base64Data: string) => void;
}
