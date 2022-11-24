import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getMaps: () => ipcRenderer.invoke('maps:findCommunityMaps'),
  pathToMaps: () => ipcRenderer.invoke('maps:path'),
  mapData: (mapId: string) => ipcRenderer.invoke('maps:mapData', mapId),
  navigateToMap: (mapId: string) => ipcRenderer.invoke('navigate:toMap', mapId),
  navigateToHome: () => ipcRenderer.invoke('navigate:toHome'),
  currentMap: () => ipcRenderer.invoke('map:currentMap'),
  saveCanvasAsImage: (canvas: HTMLCanvasElement) => ipcRenderer.invoke('map:saveImage', canvas),
});
