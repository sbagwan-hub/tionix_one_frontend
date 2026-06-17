'use client';

import * as React from 'react';
import { FormHeader } from '@/components/common/form-header';
import { MasterEmployeePanel } from '@/modules/master-employee/components/MasterEmployeePanel';

export default function EmployeesPage() {
  return (
    <div className="px-4 py-2 flex flex-col gap-3 h-full">
      <MasterEmployeePanel />
    </div>
  );
}
