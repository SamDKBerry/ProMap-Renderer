import { app } from 'electron';
import { registerIPCMainHandlers } from './services/ipcMainHandlers';
import { registerProtocols } from './services/protocols';
import { createWindow } from './services/window';

if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
  registerIPCMainHandlers();
  registerProtocols();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
