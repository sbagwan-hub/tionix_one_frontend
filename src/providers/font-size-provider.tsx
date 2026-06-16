'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FontSizeContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('font-size-preference');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 12 && parsed <= 22) {
        setFontSize(parsed);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('font-size-preference', fontSize.toString());
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize, mounted]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 22));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}
