'use client';

import React from 'react';
import { useWindowStore } from '@/stores/window-store';
import { Terminal, MonitorPlay } from 'lucide-react';

export default function Dashboard() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-100/50 p-6 dark:bg-neutral-950/50">
      {/* Control Panel Header */}
      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="mb-1 text-lg font-bold text-neutral-800 dark:text-white">
          Central Window Desktop
        </h1>
        <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
          Click the navbar menus above (e.g. Master &gt; Contacts &gt; Qualification) or use the
          buttons below to open desktop windows.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => openWindow('system-config')}
            className="flex cursor-pointer items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-blue-700 focus:outline-none"
          >
            <MonitorPlay className="h-3.5 w-3.5" />
            <span>Open System Config</span>
          </button>
          <button
            onClick={() => openWindow('system-logs')}
            className="flex cursor-pointer items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-emerald-700 focus:outline-none"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Open System Logs</span>
          </button>
        </div>
      </div>

      {/* Desktop View Area */}
      <div className="relative flex h-[650px] w-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/30 p-4 select-none dark:border-neutral-800 dark:bg-neutral-900/10">
        <div className="text-center">
          <p className="mb-1 text-sm font-semibold text-neutral-400 dark:text-neutral-500">
            ERP Desktop Workspace Active
          </p>
          <p className="text-xs text-neutral-400/80 dark:text-neutral-500/70">
            Open windows from the menu. Drag, overlap, minimize, or close them freely.
          </p>
        </div>
      </div>
    </main>
  );
}
