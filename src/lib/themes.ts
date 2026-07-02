export type ThemeName = 'light' | 'orange-light' | 'violet-light' | 'dark';

export const themes: Record<ThemeName, { name: string }> = {
  light: {
    name: 'Ocean Blue (Light)',
  },
  'orange-light': {
    name: 'Signal Orange (Light)',
  },
  'violet-light': {
    name: 'Deep Violet (Light)',
  },
  dark: {
    name: 'Dark',
  },
};

export const themeList: ThemeName[] = ['light', 'orange-light', 'violet-light', 'dark'];
