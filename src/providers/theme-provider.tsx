'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { themeList } from '@/lib/themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      themes={themeList}
      enableSystem
      storageKey="theme-preference"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
