'use client';
import { create } from 'zustand';

interface IgUser {
  igUserId: string;
  username: string;
  name: string;
  profilePictureUrl: string;
  accountType: string;
  permissions: string[];
  tokenExpireDay: number;
  tokenExpireIn: number;
}

interface IgUserState {
  user: IgUser | null;
  setUser: (user: IgUser | null) => void;
}

export const useIgUser = create<IgUserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));