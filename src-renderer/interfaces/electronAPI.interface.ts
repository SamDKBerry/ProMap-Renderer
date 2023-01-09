import { MapData } from '../../src-types/mapData';
import { MapInfo, MapListType } from '../../src-types/mapInfo';

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
  getMapSelectionType: () => MapListType;
  updateMapSelectionType: (newListType: MapListType) => void;
  saveCanvasAsImage: (base64Data: string) => void;
}
