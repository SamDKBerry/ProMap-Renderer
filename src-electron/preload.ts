import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  findCommunityMaps: () => ipcRenderer.invoke('maps:findCommunityMaps'),
  findEditorMaps: () => ipcRenderer.invoke('maps:findEditorMaps'),
  pathToMaps: () => ipcRenderer.invoke('maps:path'),
  mapData: (mapId: string) => ipcRenderer.invoke('maps:mapData', mapId),
  mapInfo: (mapId: string) => ipcRenderer.invoke('maps:mapInfo', mapId),
  navigateToMap: (mapId: string) => ipcRenderer.invoke('navigate:toMap', mapId),
  navigateToHome: () => ipcRenderer.invoke('navigate:toHome'),
  currentMap: () => ipcRenderer.invoke('map:currentMap'),
  saveCanvasAsImage: (canvas: HTMLCanvasElement) => ipcRenderer.invoke('map:saveImage', canvas),
});
