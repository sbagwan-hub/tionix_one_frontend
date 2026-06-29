'use client';

import * as React from 'react';
import { SalarySettingsScreen } from '@/modules/settings/salary-settings/components/salary-settings-screen';

export default function SalarySettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <SalarySettingsScreen />
    </div>
  );
}
