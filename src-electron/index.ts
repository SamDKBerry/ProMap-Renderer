import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { navigateToHome, navigateToMap } from './navigate';
import { findCommunityMaps } from './services/fileSystem/findCommunityMaps';
import { mapData } from './services/parseMap/parseMap';
import * as url from 'url';

if (require('electron-squirrel-startup')) app.quit();

import * as path from 'path';
import { pathToMaps } from './services/fileSystem/paths';
import { saveCanvasAsImage } from './services/fileSystem/saveImage';
let currentMap = '';

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });
  win.maximize();
  win.show();
  win.loadFile('./assets/pages/home.html');
};
app.whenReady().then(() => {
  ipcMain.handle('maps:findCommunityMaps', findCommunityMaps);
  ipcMain.handle('maps:path', () => pathToMaps);
  ipcMain.handle('maps:mapData', async (_event, mapId: string) => {
    const data = await mapData(mapId);
    return data;
  });
  ipcMain.handle('navigate:toMap', (_event, mapId: string) => {
    currentMap = mapId;
    navigateToMap();
  });
  ipcMain.handle('navigate:toHome', (_event) => {
    navigateToHome();
  });
  ipcMain.handle('map:currentMap', () => {
    return currentMap;
  });
  ipcMain.handle('map:saveImage', (_event, base64Data: string) => {
    saveCanvasAsImage(base64Data);
  });

  protocol.registerFileProtocol('secure-file', (request, callback) => {
    const filePath = url.fileURLToPath('file://' + request.url.slice('secure-file://'.length));
    callback(filePath);
  });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
