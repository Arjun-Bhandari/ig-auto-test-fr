export interface IgMediaChild {
    id: string;
    media_type: 'IMAGE' | 'VIDEO';
    media_url: string;
    timestamp: string; // ISO8601
  }
  
  export interface IgMediaItem {
    id: string;
    caption?: string;
    media_url: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    timestamp: string; // ISO8601
    children?: { data: IgMediaChild[] };
  }