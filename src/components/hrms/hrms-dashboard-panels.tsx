'use client';

import type { ReactNode } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  attendanceSummary,
  leaveRequests,
  upcomingEvents,
  type HrmsEmployee,
  type HrmsEmployeeFilters,
} from '@/constants/hrms-dashboard.constants';
import { cn } from '@/lib/utils';
import { HrmsStatusBadge } from './hrms-stat-cards';
import {
  hrmsButtonClassName,
  hrmsCardClassName,
  hrmsInputClassName,
  hrmsNestedCardClassName,
} from './hrms-styles';

function PanelShell({
  title,
  description,
  headerAction,
  children,
}: {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={hrmsCardClassName}>
      <div className="border-border flex items-start justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-foreground text-sm font-semibold">{title}</h2>
          {description ? (
            <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
          ) : null}
        </div>
        {headerAction}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function HrmsEmployeesPanel({
  employees,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
}: {
  employees: HrmsEmployee[];
  onAdd: () => void;
  onEdit: (employee: HrmsEmployee) => void;
  onDelete: (employee: HrmsEmployee) => void;
  readOnly?: boolean;
}) {
  return (
    <PanelShell
      title="Employee List"
      description={
        readOnly
          ? 'View all active employees in the organization.'
          : 'Manage employees, edit details, or remove them from the list.'
      }
      headerAction={
        !readOnly ? (
          <Button type="button" className={hrmsButtonClassName} onClick={onAdd}>
            <Plus className="size-3.5" />
            Add Employee
          </Button>
        ) : (
          <Link href="/hrms/emp-list">
            <Button type="button" variant="outline" className={hrmsButtonClassName}>
              View All
            </Button>
          </Link>
        )
      }
    >
      <Table className="min-w-full border-separate border-spacing-0 text-left">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Employee
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Department
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Designation
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Joined On
            </TableHead>
            {!readOnly ? (
              <TableHead className="text-muted-foreground w-[200px] min-w-[200px] p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                Actions
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-border divide-y">
          {employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={readOnly ? 5 : 6}
                className="text-muted-foreground p-8 text-center text-sm"
              >
                No employees match your search. Try a different name, ID, or department.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="p-4">
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">{employee.name}</span>
                    <span className="text-muted-foreground text-xs">{employee.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground p-4 text-sm">{employee.department}</TableCell>
                <TableCell className="text-foreground p-4 text-sm">
                  {employee.designation}
                </TableCell>
                <TableCell className="p-4 text-center">
                  <HrmsStatusBadge status={employee.status} />
                </TableCell>
                <TableCell className="text-muted-foreground p-4 text-sm">
                  {employee.joinedOn}
                </TableCell>
                {!readOnly ? (
                  <TableCell className="w-[200px] min-w-[200px] p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={hrmsButtonClassName}
                        onClick={() => onEdit(employee)}
                      >
                        <Edit3 className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className={hrmsButtonClassName}
                        onClick={() => onDelete(employee)}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </PanelShell>
  );
}

export function HrmsLeavePanel() {
  return (
    <PanelShell
      title="Leave Requests"
      description="Pending and recently approved leave applications."
      headerAction={
        <Link href="/hrms/leave">
          <Button type="button" variant="outline" className={hrmsButtonClassName}>
            Manage Leaves
          </Button>
        </Link>
      }
    >
      <Table className="min-w-full border-separate border-spacing-0 text-left">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Employee
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Type
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Period
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Days
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-border divide-y">
          {leaveRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="p-4">
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-medium">{request.employee}</span>
                  <span className="text-muted-foreground text-xs">{request.id}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground p-4 text-sm">{request.type}</TableCell>
              <TableCell className="text-muted-foreground p-4 text-sm">
                {request.from} - {request.to}
              </TableCell>
              <TableCell className="text-foreground p-4 text-center text-sm">
                {request.days}
              </TableCell>
              <TableCell className="p-4 text-center">
                <HrmsStatusBadge status={request.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PanelShell>
  );
}

export function HrmsAttendancePanel() {
  return (
    <PanelShell
      title="Department Attendance"
      description="Today's attendance snapshot by department."
      headerAction={
        <div className="flex gap-2">
          <Link href="/hrms/geofencing">
            <Button type="button" variant="outline" className={hrmsButtonClassName}>
              Geofencing
            </Button>
          </Link>
          <Link href="/hrms/live-location">
            <Button type="button" variant="outline" className={hrmsButtonClassName}>
              Live Location
            </Button>
          </Link>
        </div>
      }
    >
      <Table className="min-w-full border-separate border-spacing-0 text-left">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-b">
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Department
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Present
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Absent
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              On Leave
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-border divide-y">
          {attendanceSummary.map((row) => (
            <TableRow key={row.department}>
              <TableCell className="text-foreground p-4 text-sm font-medium">
                {row.department}
              </TableCell>
              <TableCell className="text-foreground p-4 text-center text-sm">
                {row.present}
              </TableCell>
              <TableCell className="text-foreground p-4 text-center text-sm">
                {row.absent}
              </TableCell>
              <TableCell className="text-foreground p-4 text-center text-sm">
                {row.onLeave}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PanelShell>
  );
}

export function HrmsEventsPanel() {
  return (
    <PanelShell
      title="Upcoming HR Events"
      description="Payroll, reviews, training, and celebrations."
    >
      <div className="divide-border divide-y">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-start justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-foreground text-sm font-medium">{event.label}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{event.date}</p>
            </div>
            <HrmsStatusBadge status={event.type} />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export function HrmsFiltersPanel({
  filters,
  onChange,
}: {
  filters: HrmsEmployeeFilters;
  onChange: (filters: HrmsEmployeeFilters) => void;
}) {
  const updateFilter = (key: keyof HrmsEmployeeFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className={cn(hrmsCardClassName, 'p-4')}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label
            htmlFor="hrms-search"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Search Employee
          </Label>
          <Input
            id="hrms-search"
            className={hrmsInputClassName}
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search by name, ID, or department..."
          />
        </div>

        <div>
          <Label
            htmlFor="hrms-department"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Department
          </Label>
          <Input
            id="hrms-department"
            className={hrmsInputClassName}
            value={filters.department}
            onChange={(event) => updateFilter('department', event.target.value)}
            placeholder="All departments"
          />
        </div>

        <div>
          <Label
            htmlFor="hrms-period"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Period
          </Label>
          <Input
            id="hrms-period"
            className={hrmsInputClassName}
            value={filters.period}
            onChange={(event) => updateFilter('period', event.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="hrms-location"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Location
          </Label>
          <Input
            id="hrms-location"
            className={hrmsInputClassName}
            value={filters.location}
            onChange={(event) => updateFilter('location', event.target.value)}
            placeholder="All locations"
          />
        </div>
      </div>
    </div>
  );
}

export function HrmsPayrollPanel() {
  return (
    <PanelShell
      title="Payroll Snapshot"
      description="Current cycle summary for salary processing and approvals."
    >
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
        <div className={cn(hrmsNestedCardClassName, 'p-4')}>
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Gross Payroll
          </p>
          <p className="text-foreground mt-2 text-xl font-semibold">AED 1,842,500</p>
        </div>
        <div className={cn(hrmsNestedCardClassName, 'p-4')}>
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Net Disbursement
          </p>
          <p className="text-foreground mt-2 text-xl font-semibold">AED 1,614,320</p>
        </div>
        <div className={cn(hrmsNestedCardClassName, 'p-4')}>
          <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            Pending Approvals
          </p>
          <p className="text-foreground mt-2 text-xl font-semibold">14</p>
        </div>
      </div>

      <Table className="min-w-full border-separate border-spacing-0 text-left">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 dark:bg-muted/20 border-y">
            <TableHead className="text-muted-foreground p-4 text-left text-xs font-semibold tracking-[0.14em] uppercase">
              Component
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-right text-xs font-semibold tracking-[0.14em] uppercase">
              Employees
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-right text-xs font-semibold tracking-[0.14em] uppercase">
              Amount
            </TableHead>
            <TableHead className="text-muted-foreground p-4 text-center text-xs font-semibold tracking-[0.14em] uppercase">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-border divide-y">
          <TableRow>
            <TableCell className="text-foreground p-4 text-sm">Basic Salary</TableCell>
            <TableCell className="text-foreground p-4 text-right text-sm">248</TableCell>
            <TableCell className="text-foreground p-4 text-right text-sm">AED 1,420,000</TableCell>
            <TableCell className="p-4 text-center">
              <HrmsStatusBadge status="Approved" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-foreground p-4 text-sm">Allowances</TableCell>
            <TableCell className="text-foreground p-4 text-right text-sm">236</TableCell>
            <TableCell className="text-foreground p-4 text-right text-sm">AED 286,400</TableCell>
            <TableCell className="p-4 text-center">
              <HrmsStatusBadge status="Approved" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-foreground p-4 text-sm">Overtime</TableCell>
            <TableCell className="text-foreground p-4 text-right text-sm">41</TableCell>
            <TableCell className="text-foreground p-4 text-right text-sm">AED 136,100</TableCell>
            <TableCell className="p-4 text-center">
              <HrmsStatusBadge status="Pending" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </PanelShell>
  );
}
