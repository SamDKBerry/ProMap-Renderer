export interface MapInfo {
  id: string;
  title: string;
  description: string;
  userName: string;
}

export interface MapListInfo {
  listElement: HTMLUListElement;
  mapPath: string;
  imgSrc: string;
  title: string;
  author?: string;
}

export type MapListType = 'custom' | 'editor';
