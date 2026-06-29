'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EmployeeChecklistProps {
  selectedEmpIds: number[];
  onSelectedEmpIdsChange: (ids: number[]) => void;
  isEditing: boolean;
  employees: any[];
  assignedEmpIds?: number[] | null;
  departments: any[];
  designations: any[];
  isLoading: boolean;
}

export const EmployeeChecklist: React.FC<EmployeeChecklistProps> = ({
  selectedEmpIds,
  onSelectedEmpIdsChange,
  isEditing,
  employees = [],
  assignedEmpIds,
  departments = [],
  designations = [],
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Map department and designation names client-side
  const mappedEmployees = useMemo(() => {
    return employees.map((emp) => {
      const dept = departments.find((d) => d.pk_dep_id === Number(emp.fk_dep_id));
      const deg = designations.find((d) => d.pk_des_id === Number(emp.fk_deg_id));
      return {
        ...emp,
        departmentName: dept ? dept.department : '-',
        designationName: deg ? deg.designation : '-',
      };
    });
  }, [employees, departments, designations]);

  // Filter employees based on search query or shift assignment
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      if (assignedEmpIds && assignedEmpIds.length > 0) {
        return mappedEmployees.filter(
          (emp) =>
            assignedEmpIds.includes(emp.pk_emp_id) ||
            selectedEmpIds.includes(emp.pk_emp_id)
        );
      }
      return mappedEmployees;
    }
    return mappedEmployees.filter(
      (emp) =>
        emp.employee.toLowerCase().includes(query) || emp.emp_code.toLowerCase().includes(query),
    );
  }, [mappedEmployees, searchQuery, assignedEmpIds, selectedEmpIds]);

  const handleToggleEmployee = (empId: number) => {
    if (!isEditing) return;
    if (selectedEmpIds.includes(empId)) {
      onSelectedEmpIdsChange(selectedEmpIds.filter((id) => id !== empId));
    } else {
      onSelectedEmpIdsChange([...selectedEmpIds, empId]);
    }
  };

  const handleToggleSelectAll = () => {
    if (!isEditing) return;
    const filteredIds = filteredEmployees.map((emp) => emp.pk_emp_id);
    const allSelected = filteredIds.every((id) => selectedEmpIds.includes(id));

    if (allSelected) {
      // Unselect all filtered
      onSelectedEmpIdsChange(selectedEmpIds.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered (union)
      const newSelection = Array.from(new Set([...selectedEmpIds, ...filteredIds]));
      onSelectedEmpIdsChange(newSelection);
    }
  };

  const isAllSelected = useMemo(() => {
    if (filteredEmployees.length === 0) return false;
    return filteredEmployees.every((emp) => selectedEmpIds.includes(emp.pk_emp_id));
  }, [filteredEmployees, selectedEmpIds]);

  return (
    <div className="bg-card/25 border-border/40 flex h-full flex-col overflow-hidden rounded-lg border backdrop-blur-md">
      {/* Search Header */}
      <div className="border-border/40 bg-muted/20 flex items-center justify-between gap-3 border-b p-3">
        <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
          Employee Checklist ({selectedEmpIds.length} Selected)
        </span>
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
          <Input
            placeholder="Search code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/60 border-border/60 focus-visible:ring-primary/40 h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Checklist Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/40 border-border/40 text-muted-foreground border-b text-[9px] font-bold tracking-wider uppercase">
              <th className="w-10 p-2 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  disabled={!isEditing || filteredEmployees.length === 0}
                  className="border-border/60 text-primary focus:ring-primary/40 cursor-pointer rounded disabled:opacity-50"
                />
              </th>
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">Department</th>
              <th className="p-2">Designation</th>
            </tr>
          </thead>
          <tbody className="divide-border/25 divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground p-8 text-center">
                  <Loader2 className="text-primary mx-auto mb-2 h-5 w-5 animate-spin" />
                  Loading employees...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground p-8 text-center">
                  No matching employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const isChecked = selectedEmpIds.includes(emp.pk_emp_id);
                return (
                  <tr
                    key={emp.pk_emp_id}
                    onClick={() => handleToggleEmployee(emp.pk_emp_id)}
                    className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                      isChecked ? 'bg-primary/5 font-medium' : ''
                    } ${!isEditing ? 'pointer-events-none' : ''}`}
                  >
                    <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleEmployee(emp.pk_emp_id)}
                        disabled={!isEditing}
                        className="border-border/60 text-primary focus:ring-primary/40 cursor-pointer rounded disabled:opacity-50"
                      />
                    </td>
                    <td className="text-muted-foreground p-2 font-mono">{emp.emp_code}</td>
                    <td className="text-foreground p-2 font-semibold">{emp.employee}</td>
                    <td className="text-muted-foreground p-2">{emp.departmentName}</td>
                    <td className="text-muted-foreground p-2">{emp.designationName}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
