import { ipcMain } from 'electron';
import { navigateToHome, navigateToMap } from './navigator';
import { findCommunityMaps } from './fileSystem/findCommunityMaps';
import { pathToMaps } from './fileSystem/paths';
import { saveCanvasAsImage } from './fileSystem/saveImage';
import { mapInfo } from './parseMap/parseInfo';
import { mapData } from './parseMap/parseMap';
import { updateCurrentMap, getCurrentMap } from './mapState';

export const registerIPCMainHandlers = () => {
  ipcMain.handle('maps:findCommunityMaps', findCommunityMaps);
  ipcMain.handle('maps:path', () => pathToMaps);
  ipcMain.handle('maps:mapData', async (_event, mapId: string) => {
    const data = await mapData(mapId);
    return data;
  });
  ipcMain.handle('maps:mapInfo', async (_event, mapId: string) => {
    const data = await mapInfo(mapId);
    return data;
  });
  ipcMain.handle('navigate:toMap', (_event, mapId: string) => {
    updateCurrentMap(mapId);
    navigateToMap();
  });
  ipcMain.handle('navigate:toHome', (_event) => {
    navigateToHome();
  });
  ipcMain.handle('map:currentMap', () => {
    return getCurrentMap();
  });
  ipcMain.handle('map:saveImage', (_event, base64Data: string) => {
    saveCanvasAsImage(base64Data);
  });
};
