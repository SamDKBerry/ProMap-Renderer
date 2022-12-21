import { MapData } from '../../src-types/mapData';
import { drawCanvas } from './drawMap.js';
import { trianglesToRender } from './generateRenderInfo.js';
import { setupControls } from './controls/viewerControls.js';
import { renderConfig, updateRenderConfig } from './renderConfig.js';

window.onload = () => {
  setupControls();
  parseAndRenderLevel();
};

const parseAndRenderLevel = async () => {
  const mapId = await window.electronAPI.currentMap();
  try {
    const mapData = await window.electronAPI.mapData(mapId);
    renderMap(mapData);
  } catch {
    updateLoadingText(`Couldn't parse data for map: ${mapId}`);
  }
};

export const refreshMap = () => {
  updateRenderConfig();
  const canvas = document.getElementById('mapCanvas');
  canvas?.remove();
  parseAndRenderLevel();
};

const renderMap = (mapData: MapData) => {
  const renderData = trianglesToRender(mapData, renderConfig);
  removeLoadingText();
  drawCanvas(renderData, renderConfig);
};

const loadingElement = () => document.getElementById('loading-message');

const removeLoadingText = () => {
  const element = loadingElement();
  element?.remove();
};

const updateLoadingText = (newText: string) => {
  const element = loadingElement();
  if (!element) {
    return;
  }
  element.innerText = newText;
};
