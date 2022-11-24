import { RenderConfig } from '../interfaces/mapRender.interface.js';
import { refreshMap } from './index.js';
import { renderConfig, updateEditedRenderConfig } from './renderConfig.js';

export const setupControls = () => {
  setDefualtColorInPicker();
  setupConfigButtons();
  setupWindowEvents();
};

const setDefualtColorInPicker = () => {
  const colorInput = document.getElementById('mapBackgroundColor') as HTMLInputElement;
  colorInput.value = renderConfig.backgroundColor;
  const pixelScaleInput = document.getElementById('pixelScale') as HTMLInputElement;
  pixelScaleInput.value = renderConfig.worldSpaceToPixelScale.toString();
  const autoMapHideInput = document.getElementById('autoMapHide') as HTMLInputElement;
  autoMapHideInput.checked = renderConfig.hideNonAutomapGeometry;
};

const setupConfigButtons = () => {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => window.electronAPI.navigateToHome());
  }
  const toggleColorDropdownButton = document.getElementById('toggleColorDropdownButton');
  if (toggleColorDropdownButton) {
    toggleColorDropdownButton.addEventListener('click', () => toggleDropdown('backgroundColorDropdownContent'));
  }

  const toggleSlidersDropdownButton = document.getElementById('toggleSlidersDropdownButton');
  if (toggleSlidersDropdownButton) {
    toggleSlidersDropdownButton.addEventListener('click', () => toggleDropdown('backgroundSlidersDropdownContent'));
  }

  const colorInput = document.getElementById('mapBackgroundColor') as HTMLInputElement;
  if (colorInput) {
    colorInput.addEventListener('input', () => makeEdit({ backgroundColor: colorInput.value }));
  }

  const pixelScaleInput = document.getElementById('pixelScale') as HTMLInputElement;
  if (pixelScaleInput) {
    pixelScaleInput.addEventListener('input', () =>
      makeEdit({ worldSpaceToPixelScale: parseInt(pixelScaleInput.value) })
    );
  }

  const autoMapHideInput = document.getElementById('autoMapHide') as HTMLInputElement;
  if (autoMapHideInput) {
    autoMapHideInput.addEventListener('input', () => makeEdit({ hideNonAutomapGeometry: autoMapHideInput.checked }));
  }
  const refreshButton = document.getElementById('refreshButton');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      setRefreshClean();
      refreshMap();
    });
  }

  const downloadButton = document.getElementById('downloadButton');
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
      const url = canvas.toDataURL();
      const base64Data = url.replace(/^data:image\/png;base64,/, '');
      if (canvas) {
        window.electronAPI.saveCanvasAsImage(base64Data);
      }
    });
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

const setRefreshClean = () => {
  const refreshButton = document.getElementById('refreshButton');

  if (refreshButton && refreshButton.classList.contains('stale')) {
    refreshButton.classList.remove('stale');
  }
};
