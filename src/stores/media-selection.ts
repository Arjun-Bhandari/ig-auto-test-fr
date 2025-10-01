'use client';
import {create} from 'zustand';
interface IgMediaItem{
  id:string;
  media_url:string;
  media_type:'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp:string;
  caption:string;
}

interface MediaSelectionState {
  selectedMediaId: string | null;
  media: IgMediaItem[];
  setMedia: (media: IgMediaItem[]) => void;
  select: (id: string) => void;
  isSelected: (id: string) => boolean;
  getSelectedMedia: () => IgMediaItem | null;
  clear: () => void;
}
export const useMediaSelection = create<MediaSelectionState>((set, get) => ({
  selectedMediaId: null,
  media: [],

  setMedia: (media: IgMediaItem[]) => set({ media }),
  select: (id: string) => set({ selectedMediaId: id }),
  isSelected: (id: string) => get().selectedMediaId === id,
  getSelectedMedia: () => {
    const { selectedMediaId, media } = get();
    return media.find(item => item.id === selectedMediaId) || null;
  },
  clear: () => set({ selectedMediaId: null }),
  reset:()=>set({selectedMediaId:null,media:[]})
}));