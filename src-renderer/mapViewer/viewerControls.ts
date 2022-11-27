import { RenderConfig } from '../interfaces/mapRender.interface.js';
import { refreshMap } from './index.js';
import { renderConfig, updateEditedRenderConfig } from './renderConfig.js';

export const setupControls = () => {
  setupConfigButtons();
  setupWindowEvents();
};

const setupConfigButtons = () => {
  setupActionButton('toggleSlidersDropdownButton', 'click', () => toggleDropdown('backgroundSlidersDropdownContent'));
  setupActionButton('toggleColorDropdownButton', 'click', () => toggleDropdown('backgroundColorDropdownContent'));
  setupActionButton('backButton', 'click', () => window.electronAPI.navigateToHome());
  setupActionButton('refreshButton', 'click', () => refresh());
  setupActionButton('downloadButton', 'click', () => downloadImage());

  setupRenderConfigControlButton('pixelScale', 'input', 'worldSpaceToPixelScale');
  setupRenderConfigControlButton('mapBackgroundColor', 'input', 'backgroundColor');
  setupRenderConfigControlButton('autoMapHide', 'input', 'hideNonAutomapGeometry');
};

const setupRenderConfigControlButton = (id: string, type: string, renderConfigKey: keyof RenderConfig) => {
  const inputElement = document.getElementById(id) as HTMLInputElement;
  if (inputElement) {
    setRenderConfigControlButtonValue(inputElement, renderConfigKey);
    setRenderConfigControlEventListener(inputElement, type, renderConfigKey);
  } else {
    console.error(`Could not find control button with Id: ${id}`);
  }
};

const setRenderConfigControlButtonValue = (inputElement: HTMLInputElement, renderConfigKey: keyof RenderConfig) => {
  switch (typeof renderConfig[renderConfigKey]) {
    case 'number':
      inputElement.value = renderConfig[renderConfigKey].toString();
      break;
    case 'boolean':
      inputElement.checked = renderConfig[renderConfigKey] as boolean;
      break;
    default:
      inputElement.value = renderConfig[renderConfigKey] as string;
      break;
  }
};

const setRenderConfigControlEventListener = (
  inputElement: HTMLInputElement,
  type: string,
  renderConfigKey: keyof RenderConfig
) => {
  inputElement.addEventListener(type, () => {
    let newValue;
    switch (typeof renderConfig[renderConfigKey]) {
      case 'number':
        newValue = parseInt(inputElement.value);
        break;
      case 'boolean':
        newValue = inputElement.checked;
        break;
      default:
        newValue = inputElement.value;
        break;
    }
    makeEdit({ [renderConfigKey]: newValue });
  });
};

const setupActionButton = (id: string, type: string, listener: () => void) => {
  const actionButton = document.getElementById(id);
  if (actionButton) {
    actionButton.addEventListener(type, listener);
  } else {
    console.error(`Could not find action button with Id: ${id}`);
  }
};

const makeEdit = (newValues: Partial<RenderConfig>) => {
  setRefreshDirty();
  updateEditedRenderConfig(newValues);
};

const toggleDropdown = (dropDownId: string) => {
  closeDropdown();
  const dropDown = document.getElementById(dropDownId);
  if (dropDown) {
    dropDown.classList.toggle('show');
  }
};

const setupWindowEvents = () => {
  window.onclick = function (event) {
    const element = event.target as HTMLInputElement;
    if (!element.matches('.toggle-button')) {
      closeDropdown();
    }
  };
  const slidersDropdown = document.getElementById('backgroundSlidersDropdownContent');
  if (slidersDropdown) {
    slidersDropdown.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  const colorDropdown = document.getElementById('mapBackgroundColor');
  if (colorDropdown) {
    colorDropdown.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
};

const closeDropdown = () => {
  const dropdowns = document.getElementsByClassName('dropdown-content');
  let i;
  for (i = 0; i < dropdowns.length; i++) {
    const openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
};

const setRefreshDirty = () => {
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
  }
};

const refresh = () => {
  setRefreshClean();
  refreshMap();
};

const setRefreshClean = () => {
  const refreshButton = document.getElementById('refreshButton');

  if (refreshButton && refreshButton.classList.contains('stale')) {
    refreshButton.classList.remove('stale');
  }
};
