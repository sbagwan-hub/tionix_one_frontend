'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  HrmsAddEmployeeForm,
  HrmsEmployeesPanel,
  HrmsFiltersPanel,
  HrmsToolbar,
  hrmsControlRadiusClassName,
  hrmsPageClassName,
} from '@/modules/hrms/components';
import {
  buildHrmsActionToolbar,
  defaultHrmsEmployeeFilters,
  filterEmployees,
  hrmsNavigationToolbar,
  hrmsUtilityToolbar,
  recentEmployees,
  type HrmsEmployee,
  type HrmsEmployeeFilters,
} from '@/constants/hrms-dashboard.constants';
import { Button } from '@/components/ui/button';

export default function EmpListPage() {
  const { t } = useTranslation();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<HrmsEmployee | null>(null);
  const [filters, setFilters] = useState<HrmsEmployeeFilters>(defaultHrmsEmployeeFilters);
  const [employees, setEmployees] = useState<HrmsEmployee[]>(() => [...recentEmployees]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hrms_employees');
      if (saved) {
        try {
          setEmployees(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('hrms_employees', JSON.stringify(employees));
    }
  }, [employees, isLoaded]);

  const filteredEmployees = useMemo(
    () => filterEmployees(employees, filters),
    [employees, filters],
  );

  const openAddEmployee = () => {
    setEditingEmployee(null);
    setShowAddEmployee(true);
  };

  const openEditEmployee = (employee: HrmsEmployee) => {
    setShowAddEmployee(false);
    setEditingEmployee(employee);
  };

  const actionToolbar = useMemo(
    () => buildHrmsActionToolbar({ onAddEmployee: openAddEmployee }),
    [],
  );

  const handleSaveEmployee = (employee: HrmsEmployee) => {
    if (editingEmployee) {
      setEmployees((current) =>
        current.map((item) => (item.id === employee.id ? employee : item)),
      );
      setEditingEmployee(null);
      return;
    }

    setEmployees((current) => [employee, ...current]);
    setShowAddEmployee(false);
  };

  const handleDeleteEmployee = (employee: HrmsEmployee) => {
    const confirmed = window.confirm(`Delete employee ${employee.name}?`);
    if (!confirmed) return;

    setEmployees((current) => current.filter((item) => item.id !== employee.id));

    if (editingEmployee?.id === employee.id) {
      setEditingEmployee(null);
    }
  };

  const closeEmployeeForm = () => {
    setShowAddEmployee(false);
    setEditingEmployee(null);
  };

  const showEmployeeForm = showAddEmployee || editingEmployee !== null;

  return (
    <div className={`${hrmsPageClassName} py-4 pb-6 font-sans px-4`}>
      <div className={`flex flex-col gap-4 ${hrmsControlRadiusClassName}`}>
        {/* Back Link Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link href="/hrms/dashboard">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ArrowLeft className="size-4 mr-1" />
                  Back
                </Button>
              </Link>
              <h1 className="text-foreground text-xl font-semibold">Employee Management</h1>
            </div>
            <p className="text-muted-foreground text-xs pl-10">
              Full directory with search, filter, edit, and deletion capabilities.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <HrmsToolbar
          navigation={hrmsNavigationToolbar}
          actions={actionToolbar}
          utilities={hrmsUtilityToolbar}
        />

        {/* Add/Edit Form */}
        {showEmployeeForm ? (
          <HrmsAddEmployeeForm
            open
            mode={editingEmployee ? 'edit' : 'add'}
            employee={editingEmployee}
            employees={employees}
            onClose={closeEmployeeForm}
            onSubmit={handleSaveEmployee}
          />
        ) : null}

        {/* Filters */}
        <HrmsFiltersPanel filters={filters} onChange={setFilters} />

        {/* Table Panel */}
        <HrmsEmployeesPanel
          employees={filteredEmployees}
          onAdd={openAddEmployee}
          onEdit={openEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      </div>
    </div>
  );
}
