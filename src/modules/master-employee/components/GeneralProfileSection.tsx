'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Paperclip } from 'lucide-react';
import { useMasterContacts } from '@/modules/master-contacts/hooks/useMasterContacts';
import { EmployeeRecord } from '../types';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const GeneralProfileSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const qualificationsQuery = useMasterContacts('qualifications');
  const departmentsQuery = useMasterContacts('departments');
  const designationsQuery = useMasterContacts('designations');

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand border-b border-border/20 pb-1.5">
        General Profile
      </h3>
      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            label="Emp Code *"
            value={formData.emp_code || ''}
            onChange={(e) => onInputChange('emp_code', e.target.value)}
            placeholder="e.g. 1"
            className="h-9 text-sm rounded-sm col-span-1"
            disabled={disabled}
          />
          <div className="flex flex-col gap-1 col-span-2">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Full Name *
            </Label>
            <Input
              value={formData.employee || ''}
              onChange={(e) => onInputChange('employee', e.target.value)}
              placeholder="Enter full name"
              className="h-9 text-sm rounded-sm"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Date of Birth"
            type="date"
            value={formData.dob ? formData.dob.slice(0, 10) : ''}
            onChange={(e) => onInputChange('dob', e.target.value)}
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Qualification
            </Label>
            <div className="flex gap-1.5">
              <Select
                value={formData.fk_qual_id ? String(formData.fk_qual_id) : 'none'}
                onValueChange={(val) => onInputChange('fk_qual_id', val === 'none' ? null : parseInt(val, 10))}
                disabled={disabled}
              >
                <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm flex-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {(qualificationsQuery.list.data || []).map((q: any) => (
                    <SelectItem key={q.pk_qua_id} value={String(q.pk_qua_id)}>
                      {q.qualification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-sm shrink-0" disabled={disabled}>
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Gender *
            </Label>
            <div className="flex items-center gap-4 py-1.5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="male"
                  checked={formData.male === true}
                  onChange={() => onInputChange('male', true)}
                  className="text-brand accent-brand h-4 w-4"
                  disabled={disabled}
                />
                Male
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="male"
                  checked={formData.male === false}
                  onChange={() => onInputChange('male', false)}
                  className="text-brand accent-brand h-4 w-4"
                  disabled={disabled}
                />
                Female
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Marital Status *
            </Label>
            <div className="flex items-center gap-4 py-1.5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="married"
                  checked={formData.married === true}
                  onChange={() => onInputChange('married', true)}
                  className="text-brand accent-brand h-4 w-4"
                  disabled={disabled}
                />
                Married
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="married"
                  checked={formData.married === false}
                  onChange={() => {
                    onInputChange('married', false);
                    onInputChange('anni', null);
                  }}
                  className="text-brand accent-brand h-4 w-4"
                  disabled={disabled}
                />
                Unmarried
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Anniversary"
            type="date"
            value={formData.anni ? formData.anni.slice(0, 10) : ''}
            onChange={(e) => onInputChange('anni', e.target.value)}
            className="h-9 text-sm rounded-sm"
            disabled={disabled || !formData.married}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Job Responsibilities
            </Label>
            <Select
              value={formData.ext || 'none'}
              onValueChange={(val) => onInputChange('ext', val === 'none' ? '' : val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm">
                <SelectValue placeholder="Select Responsibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Department
            </Label>
            <Select
              value={formData.fk_dep_id ? String(formData.fk_dep_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_dep_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(departmentsQuery.list.data || []).map((d: any) => (
                  <SelectItem key={d.pk_dep_id} value={String(d.pk_dep_id)}>
                    {d.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Designation
            </Label>
            <Select
              value={formData.fk_deg_id ? String(formData.fk_deg_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_deg_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(designationsQuery.list.data || []).map((dg: any) => (
                  <SelectItem key={dg.pk_des_id} value={String(dg.pk_des_id)}>
                    {dg.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address Containers stretch cleanly to fill Column 1 height */}
        <div className="flex flex-col gap-3 flex-1 min-h-[160px]">
          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Resident Address *
            </Label>
            <textarea
              value={formData.p_address || ''}
              onChange={(e) => onInputChange('p_address', e.target.value)}
              placeholder="Enter Resident Address"
              className="w-full flex-1 min-h-[60px] bg-background/50 text-sm rounded-sm resize-none border border-input px-3 py-1.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Native Address *
            </Label>
            <textarea
              value={formData.n_address || ''}
              onChange={(e) => onInputChange('n_address', e.target.value)}
              placeholder="Enter Native Address"
              className="w-full flex-1 min-h-[60px] bg-background/50 text-sm rounded-sm resize-none border border-input px-3 py-1.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
