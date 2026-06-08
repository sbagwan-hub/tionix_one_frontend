'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HrmsAddEmployeeForm,
  HrmsAttendancePanel,
  HrmsAttendanceTrendChart,
  HrmsEmployeesPanel,
  HrmsEventsPanel,
  HrmsFiltersPanel,
  HrmsHeadcountChart,
  HrmsLeavePanel,
  HrmsPayrollPanel,
  HrmsStatCards,
  HrmsToolbar,
  hrmsControlRadiusClassName,
  hrmsPageClassName,
  hrmsTabsListClassName,
  hrmsTabsTriggerClassName,
} from '@/modules/hrms/components';
import {
  buildHrmsActionToolbar,
  defaultHrmsEmployeeFilters,
  filterEmployees,
  hrmsNavigationToolbar,
  hrmsTabs,
  hrmsUtilityToolbar,
  recentEmployees,
  type HrmsEmployee,
  type HrmsEmployeeFilters,
} from '@/constants/hrms-dashboard.constants';

const HrmsLiveLocationView = dynamic(
  () => import('@/modules/hrms/components/hrms-live-location-view'),
  {
    ssr: false,
    loading: () => (
      <div className="text-muted-foreground flex min-h-[240px] items-center justify-center text-sm">
        Loading live location...
      </div>
    ),
  },
);

const HrmsGeofencingView = dynamic(() => import('@/modules/hrms/components/hrms-geofencing-view'), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex min-h-[240px] items-center justify-center text-sm">
      Loading geofencing...
    </div>
  ),
});

export default function HrmsDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('overview');
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
    setActiveTab('employees');
  };

  const openEditEmployee = (employee: HrmsEmployee, readOnly?: boolean) => {
    setShowAddEmployee(false);
    setEditingEmployee(employee);
    setActiveTab('employees');
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
      router.push('/hrms/emp-list');
      return;
    }

    setEmployees((current) => [employee, ...current]);
    setShowAddEmployee(false);
    router.push('/hrms/emp-list');
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

  const showEmployeeForm =
    activeTab === 'employees' && (showAddEmployee || editingEmployee !== null);

  return (
    <div className={`${hrmsPageClassName} py-2 pb-4 font-sans`}>
      <div className={`flex flex-col gap-3 ${hrmsControlRadiusClassName}`}>
        <div className="mb-2 flex flex-col gap-1 px-0.5">
          <h1 className="text-foreground text-xl font-semibold">HRMS {t('dashboard')}</h1>
          <p className="text-muted-foreground text-sm">
            Workforce overview, attendance, leave, and payroll in one place.
          </p>
        </div>

        <HrmsToolbar
          actions={actionToolbar}
          utilities={hrmsUtilityToolbar}
        />

        <HrmsStatCards totalEmployees={employees.length} />

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

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <HrmsAttendanceTrendChart />
          <HrmsHeadcountChart />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-3">
          <TabsList className={hrmsTabsListClassName}>
            {hrmsTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className={hrmsTabsTriggerClassName}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <HrmsEventsPanel />
          </TabsContent>

          <TabsContent value="employees">
            <div className="flex flex-col gap-3">
              <HrmsFiltersPanel filters={filters} onChange={setFilters} />

              <HrmsEmployeesPanel
                employees={filteredEmployees}
                onAdd={openAddEmployee}
                onEdit={openEditEmployee}
                onDelete={handleDeleteEmployee}
                readOnly
              />
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <HrmsAttendancePanel />
          </TabsContent>

          <TabsContent value="live-location">
            <HrmsLiveLocationView />
          </TabsContent>

          <TabsContent value="geofencing">
            <HrmsGeofencingView />
          </TabsContent>

          <TabsContent value="leave">
            <HrmsLeavePanel />
          </TabsContent>

          <TabsContent value="payroll">
            <HrmsPayrollPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
