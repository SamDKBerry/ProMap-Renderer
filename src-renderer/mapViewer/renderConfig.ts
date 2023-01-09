import { RenderConfig } from '../../src-types/mapRender';

export const renderConfigDefaults = {
  worldSpaceToPixelScale: 4,
  backgroundColor: '#301934',
  hideNonAutomapGeometry: true,
  hideShadowBlocker: true,
  hideSkybox: true,
  hideDownwardBrushes: true,
  border: 20,
};

export let renderConfig: RenderConfig = renderConfigDefaults;

export let editedRenderConfigValues = {} as Partial<RenderConfig>;

export const updateRenderConfig = () => {
  renderConfig = { ...renderConfig, ...editedRenderConfigValues };
  editedRenderConfigValues = {};
};

export const updateEditedRenderConfig = (newValues: Partial<RenderConfig>) => {
  editedRenderConfigValues = { ...editedRenderConfigValues, ...newValues };
};
