'use client';

import React from 'react';
import { useWindowStore } from '@/stores/window-store';
import { Terminal, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-100/50 p-6 dark:bg-neutral-950/50">
      <button
        onClick={() =>
          toast('System Config', {
            description: 'Click the button below to open the system configuration window.',
            action: {
              label: 'Open',
              onClick: () => openWindow('system-config'),
            },
          })
        }
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-blue-700"
      >
        open
      </button>
    </main>
  );
}
