import { MapListType } from '../../src-types/mapInfo';

let mapSelectionState = 'editor';

export const updateMapSelectionState = (newListType: MapListType) => {
  mapSelectionState = newListType;
};

export const getMapSelectionState = () => {
  return mapSelectionState;
};
