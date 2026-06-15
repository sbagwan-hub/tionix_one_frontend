'use client';

import * as React from 'react';
import { DataTable } from '@/components/common/data-table';
import { SearchBox } from '@/components/common/search-box';
import { Button } from '@/components/ui/button';
import { EmployeeRecord } from '../types';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';

interface MasterEmployeeListProps {
  employees: EmployeeRecord[];
  selectedEmployee: EmployeeRecord | null;
  onSelectEmployee: (emp: EmployeeRecord) => void;
  search: string;
  onSearchChange: (val: string) => void;
  isLoading?: boolean;
}

export const MasterEmployeeList: React.FC<MasterEmployeeListProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
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
    {
      key: 'last_status',
      label: 'Status',
      render: (val: string) => (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            val === 'Active' ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'
          }`}
        >
          {val || 'Active'}
        </span>
      ),
    },
    {
      key: 'select',
      label: 'Select',
      render: (_: any, row: EmployeeRecord) => {
        const isSelected = selectedEmployee?.pk_emp_id === row.pk_emp_id;
        return (
          <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs rounded-sm transition-all"
            onClick={() => onSelectEmployee(row)}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between gap-4">
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

      <div className="w-full overflow-x-auto">
        <DataTable
          data={employees}
          columns={columns}
          isLoading={isLoading}
          className="border border-border/40 rounded-sm"
        />
      </div>
    </div>
  );
};
