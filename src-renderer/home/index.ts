import { MapListInfo, MapListType } from '../../src-types/mapInfo';
import { setupActionButton } from '../utils/buttonSetup.js';
const loadCustomMaps = async () => {
  const maps = await window.electronAPI.findCommunityMaps();
  const pathToMaps = await window.electronAPI.pathToMaps();
  const listElement = createMapList();
  if (typeof listElement === undefined) {
    return;
  }
  maps.forEach(async (map) => {
    const mapInfo = await window.electronAPI.mapInfo(map);
    addMapToList({
      listElement,
      mapPath: map,
      imgSrc: `secure-file://${pathToMaps}/${map}/thumb.jpg`,
      title: mapInfo.title,
      author: mapInfo.userName,
    });
  });
};

const loadEditorMaps = async () => {
  const maps = await window.electronAPI.findEditorMaps();
  const listElement = createMapList();
  if (typeof listElement === undefined) {
    return;
  }
  maps.forEach(async (map) => {
    addMapToList({
      listElement: listElement,
      mapPath: map,
      imgSrc: `secure-file://${map.substring(0, map.length - 4)}_thumb.jpg`,
      title: map.substring(map.lastIndexOf('\\') + 1, map.length - 4),
    });
  });
};

const createMapList = (): HTMLUListElement => {
  const mapContainerElement = document.getElementById('map-container') as HTMLElement;
  const loadingElement = document.getElementById('loading-message');
  loadingElement?.remove();
  return mapContainerElement.appendChild(document.createElement('ul'));
};

const addMapToList = ({ listElement, mapPath, imgSrc, title, author }: MapListInfo) => {
  const button = listElement.appendChild(document.createElement('li')).appendChild(document.createElement(`button`));
  button.addEventListener('click', () => window.electronAPI.navigateToMap(mapPath));
  button.classList.add('level-button');
  const image = button.appendChild(document.createElement('img')) as HTMLImageElement;
  image.src = imgSrc;
  image.height = 192;
  image.width = 192;
  image.classList.add('level-image');
  const infoContainer = button.appendChild(document.createElement('div')) as HTMLDivElement;
  infoContainer.classList.add('info-container');
  const mapName = infoContainer.appendChild(document.createElement('span')) as HTMLSpanElement;
  mapName.textContent = title;
  mapName.classList.add('level-name');
  if (author) {
    const authorText = infoContainer.appendChild(document.createElement('span')) as HTMLSpanElement;
    authorText.textContent = author;
  }
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
  removeChildren(mapContainerElement);
  renderPage();
};

const removeChildren = (parent: HTMLElement) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};
