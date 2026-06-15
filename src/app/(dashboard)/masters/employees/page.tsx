'use client';

import * as React from 'react';
import { FormHeader } from '@/components/common/form-header';
import { MasterEmployeePanel } from '@/modules/master-employee/components/MasterEmployeePanel';

export default function EmployeesPage() {
  return (
    <div className="p-6 flex flex-col gap-6 h-full">


      <MasterEmployeePanel />
    </div>
  );
}
