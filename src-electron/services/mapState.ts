let currentMap = '';

export const updateCurrentMap = (newMap: string) => {
  currentMap = newMap;
};

export const getCurrentMap = () => {
  return currentMap;
};
