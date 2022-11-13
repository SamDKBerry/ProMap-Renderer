import { app, BrowserWindow, ipcMain } from 'electron';
import { navigateToMap } from './navigate';
import { findCommunityMaps } from './services/fileSystem/findCommunityMaps';
import { mapData } from './services/parseMap/parseMap';

if (require('electron-squirrel-startup')) app.quit();

import * as path from 'path';
let currentMap = '';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('./assets/pages/home.html');
};
app.whenReady().then(() => {
  ipcMain.handle('maps:findCommunityMaps', findCommunityMaps);
  ipcMain.handle('maps:mapData', async (_event, mapId: string) => {
    const data = await mapData(mapId);
    return data;
  });
  ipcMain.handle('navigate:toMap', (_event, mapId: string) => {
    currentMap = mapId;
    navigateToMap();
  });
  ipcMain.handle('map:currentMap', () => {
    return currentMap;
  });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
