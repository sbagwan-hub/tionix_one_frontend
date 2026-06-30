'use client';

import * as React from 'react';
import { WorkTimingPanel } from '@/modules/master-salary/components/WorkTimingPanel';

export default function WorkTimingPage() {
  return (
    <div className="mt-2 flex h-[calc(100vh-76px)] w-full flex-col overflow-hidden">
      <WorkTimingPanel />
    </div>
  );
}
