'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createNextEmployeeId,
  formatHrmsJoinDate,
  hrmsDepartments,
  hrmsEmployeeStatuses,
  parseHrmsJoinDateForInput,
  type HrmsEmployee,
  type HrmsEmployeeFormValues,
} from '@/constants/hrms-dashboard.constants';
import { cn } from '@/lib/utils';
import {
  hrmsButtonClassName,
  hrmsCardClassName,
  hrmsInputClassName,
  hrmsSelectTriggerClassName,
} from './hrms-styles';

const getDefaultForm = (): HrmsEmployeeFormValues => ({
  name: '',
  department: '',
  designation: '',
  status: 'Active',
  joinedOn: new Date().toISOString().slice(0, 10),
});

type HrmsAddEmployeeFormProps = {
  open: boolean;
  mode?: 'add' | 'edit';
  employee?: HrmsEmployee | null;
  employees: HrmsEmployee[];
  onClose: () => void;
  onSubmit: (employee: HrmsEmployee) => void;
};

export default function HrmsAddEmployeeForm({
  open,
  mode = 'add',
  employee = null,
  employees,
  onClose,
  onSubmit,
}: HrmsAddEmployeeFormProps) {
  const [form, setForm] = useState<HrmsEmployeeFormValues>(getDefaultForm);
  const [error, setError] = useState('');
  const isEditMode = mode === 'edit' && employee !== null;

  useEffect(() => {
    if (!open) return;

    if (isEditMode && employee) {
      setForm({
        name: employee.name,
        department: employee.department,
        designation: employee.designation,
        status: employee.status,
        joinedOn: parseHrmsJoinDateForInput(employee.joinedOn),
      });
      setError('');
      return;
    }

    setForm(getDefaultForm());
    setError('');
  }, [open, isEditMode, employee]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.department || !form.designation.trim() || !form.joinedOn) {
      setError('Please fill all required fields.');
      return;
    }

    onSubmit({
      id: isEditMode && employee ? employee.id : createNextEmployeeId(employees),
      name: form.name.trim(),
      department: form.department,
      designation: form.designation.trim(),
      status: form.status,
      joinedOn: formatHrmsJoinDate(form.joinedOn),
    });

    setForm(getDefaultForm());
    setError('');
    onClose();
  };

  const handleClose = () => {
    setForm(getDefaultForm());
    setError('');
    onClose();
  };

  return (
    <div className={cn(hrmsCardClassName, 'p-4')}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-foreground text-sm font-semibold">
            {isEditMode ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {isEditMode
              ? 'Update employee details and save changes to the list.'
              : 'Create a new employee record and add it to the dashboard list.'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={hrmsButtonClassName}
          onClick={handleClose}
        >
          Close
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {isEditMode && employee ? (
          <div>
            <Label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase">
              Employee ID
            </Label>
            <Input className={hrmsInputClassName} value={employee.id} disabled />
          </div>
        ) : null}

        <div>
          <Label
            htmlFor="employee-name"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employee-name"
            className={hrmsInputClassName}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Enter employee name"
          />
        </div>

        <div>
          <Label
            htmlFor="employee-department"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Department <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.department}
            onValueChange={(value) => setForm((current) => ({ ...current, department: value }))}
          >
            <SelectTrigger id="employee-department" className={hrmsSelectTriggerClassName}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover border">
              {hrmsDepartments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="employee-designation"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Designation <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employee-designation"
            className={hrmsInputClassName}
            value={form.designation}
            onChange={(event) =>
              setForm((current) => ({ ...current, designation: event.target.value }))
            }
            placeholder="Enter designation"
          />
        </div>

        <div>
          <Label
            htmlFor="employee-status"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Status
          </Label>
          <Select
            value={form.status}
            onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}
          >
            <SelectTrigger id="employee-status" className={hrmsSelectTriggerClassName}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover border">
              {hrmsEmployeeStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="employee-joined-on"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Joined On <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employee-joined-on"
            type="date"
            className={hrmsInputClassName}
            value={form.joinedOn}
            onChange={(event) =>
              setForm((current) => ({ ...current, joinedOn: event.target.value }))
            }
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-3">
          <Button type="submit" variant="default" className={hrmsButtonClassName}>
            {isEditMode ? 'Update Employee' : 'Save Employee'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={hrmsButtonClassName}
            onClick={handleClose}
          >
            Cancel
          </Button>
          {error ? <p className="text-destructive text-xs">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
