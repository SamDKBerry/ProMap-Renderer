import { refreshMap } from '../index.js';
import { setupActionButton } from '../../utils/buttonSetup.js';

export const setupActionButtons = () => {
  setupActionButton('backButton', 'click', () => window.electronAPI.navigateToHome());
  setupActionButton('refreshButton', 'click', () => refresh());
  setupActionButton('downloadButton', 'click', () => downloadImage());
};

export const setRefreshDirty = () => {
  const refreshButton = document.getElementById('refreshButton');

  if (refreshButton) {
    refreshButton.classList.add('stale');
  }
};

const downloadImage = () => {
  const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
  const url = canvas.toDataURL();
  const base64Data = url.replace(/^data:image\/png;base64,/, '');
  if (canvas) {
    window.electronAPI.saveCanvasAsImage(base64Data);
  } else {
    console.error("Couldn't find canvas to render Image from");
  }
};

const setRefreshClean = () => {
  const refreshButton = document.getElementById('refreshButton');

  if (refreshButton && refreshButton.classList.contains('stale')) {
    refreshButton.classList.remove('stale');
  }
};

const refresh = () => {
  setRefreshClean();
  refreshMap();
};
