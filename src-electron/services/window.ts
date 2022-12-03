import { BrowserWindow } from 'electron';
import * as path from 'path';

export const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
    },
    show: false,
  });
  win.maximize();
  win.show();
  win.loadFile('./assets/pages/home.html');
};
