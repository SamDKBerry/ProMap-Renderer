import { MapData } from './mapData.interface';
import { MapInfo } from './mapInfo.interface';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export interface ElectronAPI {
  findCommunityMaps: () => string[];
  findEditorMaps: () => string[];
  pathToMaps: () => string;
  mapData: (mapId: string) => MapData;
  mapInfo: (mapId: string) => MapInfo;
  navigateToMap: (mapId: string) => void;
  navigateToHome: () => void;
  currentMap: () => string;
  saveCanvasAsImage: (base64Data: string) => void;
}
