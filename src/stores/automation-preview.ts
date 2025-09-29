'use client';
import { create } from 'zustand';

interface AutomationPreviewState {
  includeKeywords: string[];
  replyText: string;
  responses: string[];
  randomize: boolean;
  dmText: string;
  buttonLabel: string;
  buttonUrl: string;
  setIncludeKeywords: (v: string[]) => void;
  setReplyText: (v: string) => void;
  setResponses: (v: string[]) => void;
  setRandomize: (v: boolean) => void;
  setDmText: (v: string) => void;
  setButtonLabel: (v: string) => void;
  setButtonUrl: (v: string) => void;
  reset: () => void;
}

export const useAutomationPreview = create<AutomationPreviewState>((set) => ({
  includeKeywords: [],
  replyText: '',
  responses: [],
  randomize: false,
  dmText: '',
  buttonLabel: '',
  buttonUrl: '',
  setIncludeKeywords: (includeKeywords) => set({ includeKeywords }),
  setReplyText: (replyText) => set({ replyText }),
  setResponses: (responses) => set({ responses }),
  setRandomize: (randomize) => set({ randomize }),
  setDmText: (dmText) => set({ dmText }),
  setButtonLabel: (buttonLabel) => set({ buttonLabel }),
  setButtonUrl: (buttonUrl) => set({ buttonUrl }),
  reset: () => set({
    includeKeywords: [],
    replyText: '',
    responses: [],
    randomize: false,
    dmText: '',
    buttonLabel: '',
    buttonUrl: '',
  }),
}));