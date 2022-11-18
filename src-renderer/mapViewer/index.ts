import { MapData } from '../interfaces/mapData.interface';
import { drawCanvas } from './drawMap.js';
import { trianglesToRender } from './generateRenderInfo.js';

const worldSpaceToPixelScale = 4;

window.onload = function () {
  renderLevel();
};

const renderLevel = async () => {
  const mapId = await window.electronAPI.currentMap();
  try {
    const mapData = await window.electronAPI.mapData(mapId);
    renderMap(mapData);
  } catch {
    updateLoadingText(`Couldn't parse data for map: ${mapId}`);
  }
};

const renderMap = (mapData: MapData) => {
  const renderData = trianglesToRender(mapData, worldSpaceToPixelScale);
  removeLoadingText();
  drawCanvas(renderData);
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
