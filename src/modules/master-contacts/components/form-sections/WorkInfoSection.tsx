'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Building, Briefcase, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { IndividualDto } from '../../types';

interface WorkInfoSectionProps {
  formData: IndividualDto;
  onInputChange: (field: string, value: any) => void;
  organizations: any[];
  departments: any[];
  designations: any[];
  disabled?: boolean;
  isRtl?: boolean;
}

export const WorkInfoSection: React.FC<WorkInfoSectionProps> = ({
  formData,
  onInputChange,
  organizations,
  departments,
  designations,
  disabled = false,
  isRtl = false,
}) => {
  return (
    <div className="border-border/80 bg-background/50 space-y-4 rounded-sm border p-4">
      <Label className="text-muted-foreground text-xxs block font-semibold tracking-wider uppercase">
        Work Information
      </Label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Organization */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Organization
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Building className="h-4 w-4" />
            </div>
            <Select
              value={formData.fk_org_id ? String(formData.fk_org_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_org_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="none">None</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.pk_cont_id} value={String(org.pk_cont_id)}>
                    {org.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Department
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Building className="h-4 w-4" />
            </div>
            <Select
              value={formData.fk_dep_id ? String(formData.fk_dep_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_dep_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="none">None</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.pk_dep_id} value={String(d.pk_dep_id)}>
                    {d.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Designation */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Designation
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Briefcase className="h-4 w-4" />
            </div>
            <Select
              value={formData.fk_deg_id ? String(formData.fk_deg_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_deg_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={`bg-background/50 focus:bg-background h-9 w-full cursor-pointer rounded-sm text-xs transition-all ${isRtl ? 'pr-9 pl-3' : 'pr-3 pl-9'}`}
              >
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="none">None</SelectItem>
                {designations.map((deg) => (
                  <SelectItem key={deg.pk_des_id} value={String(deg.pk_des_id)}>
                    {deg.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Anniversary */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-foreground text-[12px] font-semibold tracking-wider">
            Anniversary
          </Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center px-3">
              <Calendar className="h-4 w-4" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  className={`border-border bg-background/50 hover:bg-accent hover:text-accent-foreground focus:bg-background flex h-9 w-full cursor-pointer items-center justify-between rounded-sm border text-xs transition-all ${isRtl ? 'pr-9 pl-3 text-right' : 'pr-3 pl-9 text-left'} ${!formData.anniversary ? 'text-muted-foreground' : ''}`}
                >
                  <span>
                    {formData.anniversary
                      ? format(new Date(formData.anniversary), 'PPP')
                      : 'Pick Anniversary'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={formData.anniversary ? new Date(formData.anniversary) : undefined}
                  onSelect={(date) => {
                    onInputChange('anniversary', date ? format(date, 'yyyy-MM-dd') : null);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
