const loadMaps = async () => {
  const maps = await window.electronAPI.getMaps();
  const pathToMaps = await window.electronAPI.pathToMaps();
  const mapContainerElement = document.getElementById('map-container');
  if (!mapContainerElement) {
    return;
  }

  const loadingElement = document.getElementById('loading-message');
  loadingElement?.remove();

  const listElement = mapContainerElement.appendChild(document.createElement('ul'));

  maps.forEach((map) => {
    const button = listElement.appendChild(document.createElement('li')).appendChild(document.createElement(`button`));
    button.addEventListener('click', () => window.electronAPI.navigateToMap(map));
    const image = button.appendChild(document.createElement('img')) as HTMLImageElement;
    image.src = `secure-file://${pathToMaps}/${map}/screenshot.jpg`;
  });
};

window.onload = function () {
  loadMaps();
};
