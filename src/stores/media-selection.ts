'use client';

import { create } from 'zustand';

interface MediaSelectionState {
  selectedId: string | null;
  select: (id: string) => void;
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
}

export const useMediaSelection = create<MediaSelectionState>((set, get) => ({
  selectedId: null,
  select: (id: string) => set({ selectedId: id }),
  toggle: (id: string) =>
    set(state => ({ selectedId: state.selectedId === id ? null : id })),
  isSelected: (id: string) => get().selectedId === id,
  clear: () => set({ selectedId: null }),
}));