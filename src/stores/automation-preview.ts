'use client';
import { create } from 'zustand';

interface AutomationPreviewState {
  includeKeywords: string[];
  replyText: string;
  dmText: string;
  buttonLabel: string;
  buttonUrl: string;
  regex?:string;
  setIncludeKeywords: (v: string[]) => void;
  setReplyText: (v: string) => void;
  setDmText: (v: string) => void;
  setButtonLabel: (v: string) => void;
  setRegex:(v:string)=> void;
  setButtonUrl: (v: string) => void;
  hydrate:(s:Partial<AutomationPreviewState>)=>void;
  reset: () => void;
}

export const useAutomationPreview = create<AutomationPreviewState>((set) => ({
  includeKeywords: [],
  replyText: '',
  dmText: '',
  buttonLabel: '',
  buttonUrl: '',
  regex:'',
  setIncludeKeywords: (includeKeywords) => set({ includeKeywords }),
  setReplyText: (replyText) => set({ replyText }),
  setDmText: (dmText) => set({ dmText }),
  setButtonLabel: (buttonLabel) => set({ buttonLabel }),
  setButtonUrl: (buttonUrl) => set({ buttonUrl }),
  setRegex:(regex)=>set({regex}),
  hydrate:(s)=>set(s),
  reset: () => set({
    includeKeywords: [],
    replyText: '',
    dmText: '',
    buttonLabel: '',
    buttonUrl: '',
  }),
}));