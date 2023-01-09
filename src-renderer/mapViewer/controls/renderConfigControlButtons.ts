import { RenderConfig } from '../../../src-types/mapRender';
import { renderConfig, updateEditedRenderConfig } from '../renderConfig.js';
import { setRefreshDirty } from './actionButtons.js';

export const setupRenderConfigControlButtons = () => {
  setupRenderConfigControlButton('pixelScale', 'input', 'worldSpaceToPixelScale');
  setupRenderConfigControlButton('mapBackgroundColor', 'input', 'backgroundColor');
  setupRenderConfigControlButton('autoMapHide', 'input', 'hideNonAutomapGeometry');
  setupRenderConfigControlButton('shadowHide', 'input', 'hideShadowBlocker');
  setupRenderConfigControlButton('skyboxHide', 'input', 'hideSkybox');
  setupRenderConfigControlButton('downwardBrushesHide', 'input', 'hideDownwardBrushes');
  setupRenderConfigControlButton('border', 'input', 'border');
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

const makeEdit = (newValues: Partial<RenderConfig>) => {
  setRefreshDirty();
  updateEditedRenderConfig(newValues);
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
