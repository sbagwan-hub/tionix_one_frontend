'use client';

import React, { useState, useEffect } from 'react';
import { useWindowStore } from '@/stores/window-store';
import Window from '@/components/common/window';
import { WINDOW_REGISTRY } from '@/config/window-registry';

export function GlobalWindows() {
  const windows = useWindowStore((state) => state.windows);
  const closeWindow = useWindowStore((state) => state.closeWindow);

  // Hydration guard to prevent SSR snapshot loops
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter open windows and resolve their configs
  const openWindowList = Object.keys(windows)
    .filter((id) => windows[id]?.isOpen)
    .map((id) => {
      const config = WINDOW_REGISTRY[id];
      return config ? { id, config } : null;
    })
    .filter(
      (item): item is { id: string; config: (typeof WINDOW_REGISTRY)[string] } => item !== null,
    );

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div className="pointer-events-none relative h-full w-full">
        {openWindowList.map(({ id, config }) => {
          const ChildContent = config.component;

          return (
            <Window
              key={id}
              id={id}
              title={config.title}
              icon={config.icon}
              onClose={() => closeWindow(id)}
              isMinimizable={config.isMinimizable}
              isMaximizable={config.isMaximizable}
              isDraggable={config.isDraggable}
              className={config.className}
              toolbarTitle={config.toolbarTitle}
            >
              <ChildContent />
            </Window>
          );
        })}
      </div>
    </div>
  );
}
