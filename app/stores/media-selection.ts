'use client';

import { create } from 'zustand';

interface MediaSelectionState {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
}

export const useMediaSelection = create<MediaSelectionState>((set, get) => ({
  selectedIds: new Set<string>(),
  toggle: (id: string) =>
    set(state => {
      const next = new Set(state.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),
  isSelected: (id: string) => get().selectedIds.has(id),
  clear: () => set({ selectedIds: new Set() }),
}));