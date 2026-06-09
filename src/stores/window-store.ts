import { create } from 'zustand';

export interface WindowStateData {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface WindowStore {
  windows: Record<string, WindowStateData>;
  globalZIndex: number;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  setMinimized: (id: string, isMinimized: boolean) => void;
  setMaximized: (id: string, isMaximized: boolean) => void;
  focusWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: {},
  globalZIndex: 100,

  openWindow: (id) =>
    set((state) => {
      const nextZIndex = state.globalZIndex + 1;
      const current = state.windows[id] || {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 50,
      };

      return {
        globalZIndex: nextZIndex,
        windows: {
          ...state.windows,
          [id]: {
            ...current,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZIndex,
          },
        },
      };
    }),

  closeWindow: (id) =>
    set((state) => {
      const current = state.windows[id] || {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 50,
      };

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...current,
            isOpen: false,
          },
        },
      };
    }),

  setMinimized: (id, isMinimized) =>
    set((state) => {
      const current = state.windows[id] || {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 50,
      };

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...current,
            isMinimized,
          },
        },
      };
    }),

  setMaximized: (id, isMaximized) =>
    set((state) => {
      const current = state.windows[id] || {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 50,
      };

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...current,
            isMaximized,
            ...(isMaximized ? { isMinimized: false } : {}),
          },
        },
      };
    }),

  focusWindow: (id) =>
    set((state) => {
      const current = state.windows[id];
      if (current && current.zIndex === state.globalZIndex) {
        return {}; // Already focused
      }

      const nextZIndex = state.globalZIndex + 1;
      const windowData = current || {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 50,
      };

      return {
        globalZIndex: nextZIndex,
        windows: {
          ...state.windows,
          [id]: {
            ...windowData,
            zIndex: nextZIndex,
          },
        },
      };
    }),
}));

export default useWindowStore;
