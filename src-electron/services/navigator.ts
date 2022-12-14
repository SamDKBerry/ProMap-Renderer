import { BrowserWindow } from 'electron';

export const navigateToMap = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.loadFile('./assets/pages/mapViewer.html');
  } else {
    console.error("Couldn't find focussed window");
  }
};

export const navigateToHome = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.loadFile('./assets/pages/home.html');
  } else {
    console.error("Couldn't find focussed window");
  }
};
