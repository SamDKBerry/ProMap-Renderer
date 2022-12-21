import { MapListType } from '../../src-types/mapInfo';
import { setupActionButton } from '../utils/buttonSetup.js';
const loadCustomMaps = async () => {
  const maps = await window.electronAPI.findCommunityMaps();
  const pathToMaps = await window.electronAPI.pathToMaps();
  const mapContainerElement = document.getElementById('map-container');
  if (!mapContainerElement) {
    return;
  }

  const loadingElement = document.getElementById('loading-message');
  loadingElement?.remove();

  const listElement = mapContainerElement.appendChild(document.createElement('ul'));

  maps.forEach(async (map) => {
    const button = listElement.appendChild(document.createElement('li')).appendChild(document.createElement(`button`));
    button.addEventListener('click', () => window.electronAPI.navigateToMap(map));
    button.classList.add('level-button');
    const image = button.appendChild(document.createElement('img')) as HTMLImageElement;
    image.src = `secure-file://${pathToMaps}/${map}/thumb.jpg`;
    image.height = 192;
    image.width = 192;
    image.classList.add('level-image');
    const mapInfo = await window.electronAPI.mapInfo(map);
    const infoContainer = button.appendChild(document.createElement('div')) as HTMLDivElement;
    infoContainer.classList.add('info-container');
    const mapName = infoContainer.appendChild(document.createElement('span')) as HTMLSpanElement;
    mapName.textContent = mapInfo.title;
    mapName.classList.add('level-name');

    const author = infoContainer.appendChild(document.createElement('span')) as HTMLSpanElement;
    author.textContent = mapInfo.userName;
  });
};

const loadEditorMaps = async () => {
  const maps = await window.electronAPI.findEditorMaps();
  const mapContainerElement = document.getElementById('map-container');
  if (!mapContainerElement) {
    return;
  }

  const loadingElement = document.getElementById('loading-message');
  loadingElement?.remove();

  const listElement = mapContainerElement.appendChild(document.createElement('ul'));

  maps.forEach(async (map) => {
    const title = map.substring(map.lastIndexOf('\\') + 1, map.length - 4);
    const button = listElement.appendChild(document.createElement('li')).appendChild(document.createElement(`button`));
    button.addEventListener('click', () => window.electronAPI.navigateToMap(map));
    button.classList.add('level-button');
    const image = button.appendChild(document.createElement('img')) as HTMLImageElement;
    image.src = `secure-file://${map.substring(0, map.length - 4)}_thumb.jpg`;
    image.height = 192;
    image.width = 192;
    image.classList.add('level-image');
    // const mapInfo = await window.electronAPI.mapInfo(map);
    const infoContainer = button.appendChild(document.createElement('div')) as HTMLDivElement;
    infoContainer.classList.add('info-container');
    const mapName = infoContainer.appendChild(document.createElement('span')) as HTMLSpanElement;
    mapName.textContent = title;
    mapName.classList.add('level-name');
  });
};

const renderPage = async () => {
  const mapListType = await window.electronAPI.getMapSelectionType();
  updateNavSelection(mapListType);
  if (mapListType === 'custom') {
    loadCustomMaps();
  } else {
    loadEditorMaps();
  }
};

const updateNavSelection = (mapListType: MapListType) => {
  const communityButton = document.getElementById('communityButton') as HTMLButtonElement;
  const editorButton = document.getElementById('editorButton') as HTMLButtonElement;

  if (mapListType === 'editor') {
    communityButton.classList.remove('selected');
    editorButton.classList.add('selected');
  } else {
    editorButton.classList.remove('selected');
    communityButton.classList.add('selected');
  }
};

window.onload = function () {
  setupActionButtons();
  renderPage();
};

export const setupActionButtons = () => {
  setupActionButton('communityButton', 'click', () => updateSelectionType('custom'));
  setupActionButton('editorButton', 'click', () => updateSelectionType('editor'));
};

const updateSelectionType = async (newListType: MapListType) => {
  await window.electronAPI.updateMapSelectionType(newListType);
  const mapContainerElement = document.getElementById('map-container');
  if (!mapContainerElement) {
    return;
  }
  removeChilds(mapContainerElement);
  renderPage();
};

const removeChilds = (parent: HTMLElement) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};
