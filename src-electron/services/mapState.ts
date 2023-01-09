import { pathToCommunityMaps } from './fileSystem/paths';
import { getMapSelectionState } from './mapSelectionState';

let currentMap = '';

export const updateCurrentMap = (newMap: string) => {
  if (getMapSelectionState() === 'editor') {
    currentMap = newMap;
  } else {
    currentMap = `${pathToCommunityMaps}/${newMap}/map.map`;
  }
};

export const getCurrentMap = () => {
  return currentMap;
};
