import { create } from 'zustand';

export interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  language: 'en',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));
