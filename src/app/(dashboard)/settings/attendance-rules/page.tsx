'use client';

import * as React from 'react';
import { AttendanceRulesScreen } from '@/modules/settings/attendance-rules/components/attendance-rules-screen';

export default function AttendanceRulesPage() {
  return (
    <div className="flex flex-col h-full">
      <AttendanceRulesScreen />
    </div>
  );
}
