'use client';

import * as React from 'react';
import { DataTable } from '@/components/common/data-table';
import { SearchBox } from '@/components/common/search-box';
import { Button } from '@/components/ui/button';
import { EmployeeRecord } from '../types';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { Chip } from '@/components/common/chip';

interface MasterEmployeeListProps {
  employees: EmployeeRecord[];
  selectedEmployee: EmployeeRecord | null;
  onSelectEmployee: (emp: EmployeeRecord) => void;
  onRowDoubleClick?: (emp: EmployeeRecord) => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading?: boolean;
}

export const MasterEmployeeList: React.FC<MasterEmployeeListProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
  onRowDoubleClick,
  search,
  onSearchChange,
  isLoading = false,
}) => {
  const departmentsQuery = useMasterContacts('departments');
  const designationsQuery = useMasterContacts('designations');

  const getDeptName = (id: number | null) => {
    if (!id) return '-';
    const d = (departmentsQuery.list.data || []).find((dept: any) => dept.pk_dep_id === id);
    return d ? d.department : '-';
  };

  const getDesigName = (id: number | null) => {
    if (!id) return '-';
    const dg = (designationsQuery.list.data || []).find((des: any) => des.pk_des_id === id);
    return dg ? dg.designation : '-';
  };

  const columns = [
    {
      key: 'emp_code',
      label: 'Emp Code',
    },
    {
      key: 'employee',
      label: 'Employee Name',
    },
    {
      key: 'doj',
      label: 'Joining Date',
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    {
      key: 'fk_dep_id',
      label: 'Department',
      render: (val: any) => getDeptName(val),
    },
    {
      key: 'fk_deg_id',
      label: 'Designation',
      render: (val: any) => getDesigName(val),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 shrink-0">
        <SearchBox
          value={search}
          onChange={onSearchChange}
          placeholder="Search employees by name..."
          className="max-w-md h-9"
        />
        <div className="text-muted-foreground text-xs">
          Showing {employees.length} records
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 overflow-auto border border-border/40 rounded-sm bg-card">
        <DataTable
          data={employees}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(row) => onSelectEmployee(row)}
          onRowDoubleClick={(row) => onRowDoubleClick && onRowDoubleClick(row)}
          rowClassName={(row) => selectedEmployee?.pk_emp_id === row.pk_emp_id ? 'bg-brand/10 hover:bg-brand/15' : ''}
          className="border-0 shadow-none rounded-none"
        />
      </div>
    </div>
  );
};
