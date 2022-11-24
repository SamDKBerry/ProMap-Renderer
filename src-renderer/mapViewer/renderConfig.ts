import { RenderConfig } from '../interfaces/mapRender.interface';

export const renderConfigDefaults = {
  worldSpaceToPixelScale: 4,
  backgroundColor: '#301934',
  hideNonAutomapGeometry: true,
};

export let renderConfig = renderConfigDefaults;

export let editedRenderConfigValues = {} as Partial<RenderConfig>;

export const updateRenderConfig = () => {
  renderConfig = { ...renderConfig, ...editedRenderConfigValues };
  editedRenderConfigValues = {};
};

export const updateEditedRenderConfig = (newValues: Partial<RenderConfig>) => {
  editedRenderConfigValues = { ...editedRenderConfigValues, ...newValues };
};
