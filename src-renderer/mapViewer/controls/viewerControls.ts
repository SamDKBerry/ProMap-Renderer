import { setupActionButtons } from './actionButtons.js';
import { setupDropdowns } from './dropDowns.js';
import { setupRenderConfigControlButtons } from './renderConfigControlButtons.js';

export const setupControls = () => {
  setupActionButtons();
  setupRenderConfigControlButtons();
  setupDropdowns();
};
