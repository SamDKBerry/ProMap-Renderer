const loadMaps = async () => {
  const maps = await window.electronAPI.findCommunityMaps();
  console.log(await window.electronAPI.findEditorMaps());
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
    image.src = `secure-file://${pathToMaps}/${map}/screenshot.jpg`;
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

window.onload = function () {
  loadMaps();
};
