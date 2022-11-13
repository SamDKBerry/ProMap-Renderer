const loadMaps = async () => {
  const maps = await window.electronAPI.getMaps();
  const mapContainerElement = document.getElementById('map-container');
  if (!mapContainerElement) {
    return;
  }
  const listElement = mapContainerElement.appendChild(document.createElement('ul'));

  maps.forEach((map) => {
    const button = listElement.appendChild(document.createElement('li')).appendChild(document.createElement(`button`));
    button.textContent = map;
    button.addEventListener('click', () => window.electronAPI.navigateToMap(map));
  });
};

window.onload = function () {
  loadMaps();
};
