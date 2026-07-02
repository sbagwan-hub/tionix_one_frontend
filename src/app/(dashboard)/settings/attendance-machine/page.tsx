'use client';

import * as React from 'react';
import { AttendanceMachineWindow } from '@/modules/settings/attendance-machine/components/AttendanceMachineWindow';

export default function AttendanceMachinePage() {
  return (
    <div className="flex flex-col h-full">
      <AttendanceMachineWindow />
    </div>
  );
}
