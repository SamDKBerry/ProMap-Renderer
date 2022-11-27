import { refreshMap } from '../index.js';
import { closeDropdown } from './dropDowns.js';

export const setupActionButtons = () => {
  setupActionButton('toggleSlidersDropdownButton', 'click', () => toggleDropdown('backgroundSlidersDropdownContent'));
  setupActionButton('toggleColorDropdownButton', 'click', () => toggleDropdown('backgroundColorDropdownContent'));
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

const setupActionButton = (id: string, type: string, listener: () => void) => {
  const actionButton = document.getElementById(id);
  if (actionButton) {
    actionButton.addEventListener(type, listener);
  } else {
    console.error(`Could not find action button with Id: ${id}`);
  }
};

const toggleDropdown = (dropDownId: string) => {
  closeDropdown();
  const dropDown = document.getElementById(dropDownId);
  if (dropDown) {
    dropDown.classList.toggle('show');
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
