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
  departments: any[];
  designations: any[];
  isLoading: boolean;
}

export const EmployeeChecklist: React.FC<EmployeeChecklistProps> = ({
  selectedEmpIds,
  onSelectedEmpIdsChange,
  isEditing,
  employees = [],
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

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return mappedEmployees;
    const query = searchQuery.toLowerCase();
    return mappedEmployees.filter(
      (emp) =>
        emp.employee.toLowerCase().includes(query) ||
        emp.emp_code.toLowerCase().includes(query)
    );
  }, [mappedEmployees, searchQuery]);

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
    <div className="flex flex-col h-full bg-card/25 border border-border/40 rounded-lg backdrop-blur-md overflow-hidden">
      {/* Search Header */}
      <div className="p-3 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Employee Checklist ({selectedEmpIds.length} Selected)
        </span>
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-background/60 border-border/60 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      {/* Checklist Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border/40 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
              <th className="p-2 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  disabled={!isEditing || filteredEmployees.length === 0}
                  className="rounded border-border/60 text-primary focus:ring-primary/40 cursor-pointer disabled:opacity-50"
                />
              </th>
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">Department</th>
              <th className="p-2">Designation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/25">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                  Loading employees...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
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
                    className={`hover:bg-primary/5 transition-colors cursor-pointer ${
                      isChecked ? 'bg-primary/5 font-medium' : ''
                    } ${!isEditing ? 'pointer-events-none' : ''}`}
                  >
                    <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleEmployee(emp.pk_emp_id)}
                        disabled={!isEditing}
                        className="rounded border-border/60 text-primary focus:ring-primary/40 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="p-2 font-mono text-muted-foreground">{emp.emp_code}</td>
                    <td className="p-2 font-semibold text-foreground">{emp.employee}</td>
                    <td className="p-2 text-muted-foreground">{emp.departmentName}</td>
                    <td className="p-2 text-muted-foreground">{emp.designationName}</td>
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
