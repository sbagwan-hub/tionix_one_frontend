'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormInput } from '@/components/common/form-input';
import { DatePicker } from '@/components/common/date-picker';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Time calculation helpers
const toMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
};



interface WorkTimingFormProps {
  form: UseFormReturn<any>;
  isEditing: boolean;
  shifts: any[];
  manpowerAgencies: any[];
}

// File contents continue directly without duplicate toMinutes helper

const diffMinutesWrap = (startMin: number, endMin: number): number => {
  const diff = endMin - startMin;
  return diff < 0 ? diff + 1440 : diff;
};

export const WorkTimingForm: React.FC<WorkTimingFormProps> = ({
  form,
  isEditing,
  shifts = [],
  manpowerAgencies = [],
}) => {
  const shiftInputRef = useRef<HTMLButtonElement>(null);

  // Watch fields for calculations
  const watchedSWork = form.watch('s_work');
  const watchedEWork = form.watch('e_work');
  const watchedSBreak = form.watch('s_break');
  const watchedEBreak = form.watch('e_break');
  const watchedType = form.watch('type');

  // Automatically calculate durations
  useEffect(() => {
    if (watchedSWork && watchedEWork && watchedSBreak && watchedEBreak) {
      const workMin = diffMinutesWrap(toMinutes(watchedSWork), toMinutes(watchedEWork));
      const breakMin = diffMinutesWrap(toMinutes(watchedSBreak), toMinutes(watchedEBreak));
      const netHours = (workMin - breakMin) / 60;

      form.setValue('t_work', netHours.toFixed(2));
      form.setValue('t_break', breakMin.toFixed(2));
    }
  }, [watchedSWork, watchedEWork, watchedSBreak, watchedEBreak, form]);

  // Handle shift dropdown selection -> Autofills shift times!
  const handleShiftChange = (shiftName: string) => {
    form.setValue('shift', shiftName);
    const selectedShift = shifts.find((s) => s.shift === shiftName);
    if (selectedShift) {
      // Shift times in shift list are like '07:00'
      form.setValue('s_work', selectedShift.s_work || '09:00');
      form.setValue('e_work', selectedShift.e_work || '17:00');
      form.setValue('s_break', selectedShift.s_break || '13:00');
      form.setValue('e_break', selectedShift.e_break || '13:30');
      form.setValue('fk_st_id', selectedShift.pk_st_id);
    }
  };

  return (
    <div className="flex-1 bg-card/25 border border-border/40 rounded-lg p-5 backdrop-blur-md overflow-y-auto max-h-full">
      <form className="flex flex-col gap-4 text-xs pb-16">
        {/* Shift Selection */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Shift Name *
          </Label>
          <div className="col-span-8">
            <Controller
              name="shift"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={handleShiftChange}
                  value={field.value}
                  disabled={!isEditing}
                >
                  <SelectTrigger ref={shiftInputRef} className="w-full h-8 text-xs border-border/60">
                    <SelectValue placeholder="Select shift timing" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover z-[10000]">
                    {shifts.map((s) => (
                      <SelectItem key={s.pk_st_id} value={s.shift}>
                        {s.shift} ({s.s_work} - {s.e_work})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.shift && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.shift.message)}</p>
            )}
          </div>
        </div>

        {/* Type of Work Shift */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Type of Work Shift
          </Label>
          <div className="col-span-8">
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || 'Permanent Shift'}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full h-8 text-xs border-border/60">
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover z-[10000]">
                    <SelectItem value="Permanent Shift">Permanent Shift</SelectItem>
                    <SelectItem value="Regular Shift Basis">Regular Shift Basis</SelectItem>
                    <SelectItem value="Temporary Shift">Temporary Shift</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Supplied To/Manpower Agency */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Supplied To/Manpower Agency
          </Label>
          <div className="col-span-8">
            <Controller
              name="fk_cont_id"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full h-8 text-xs border-border/60">
                    <SelectValue placeholder="Select agency (optional)" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover z-[10000]">
                    <SelectItem value="none">None / Direct Hire</SelectItem>
                    {manpowerAgencies.map((agency) => (
                      <SelectItem key={agency.pk_cont_id} value={String(agency.pk_cont_id)}>
                        {agency.contact_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Timing Start Date */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Timing Start Date *
          </Label>
          <div className="col-span-8">
            <Controller
              name="tsd"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!isEditing}
                  triggerClassName="h-8 border-border/60 text-xs"
                  placeholder="Select start date"
                />
              )}
            />
            {form.formState.errors.tsd && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.tsd.message)}</p>
            )}
          </div>
        </div>

        {/* Work Timing */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Work Timing *
          </Label>
          <div className="col-span-8">
            <div className="flex items-center gap-2">
              <Input
                type="time"
                disabled={!isEditing}
                {...form.register('s_work')}
                className={cn(
                  "h-8 text-xs border-border/60 w-28",
                  form.formState.errors.s_work && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                )}
              />
              <span className="text-muted-foreground text-[10px] font-bold">To</span>
              <Input
                type="time"
                disabled={!isEditing}
                {...form.register('e_work')}
                className={cn(
                  "h-8 text-xs border-border/60 w-28",
                  form.formState.errors.e_work && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                )}
              />
              <Input
                type="text"
                readOnly
                {...form.register('t_work')}
                className="h-8 w-14 text-center text-xs bg-muted/30 border-border/30 font-mono font-bold"
              />
              <span className="text-muted-foreground text-[9px] font-semibold">hrs</span>
            </div>
            {form.formState.errors.s_work && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.s_work.message)}</p>
            )}
            {form.formState.errors.e_work && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.e_work.message)}</p>
            )}
          </div>
        </div>

        {/* Meal Break */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Meal Break *
          </Label>
          <div className="col-span-8">
            <div className="flex items-center gap-2">
              <Input
                type="time"
                disabled={!isEditing}
                {...form.register('s_break')}
                className={cn(
                  "h-8 text-xs border-border/60 w-28",
                  form.formState.errors.s_break && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                )}
              />
              <span className="text-muted-foreground text-[10px] font-bold">To</span>
              <Input
                type="time"
                disabled={!isEditing}
                {...form.register('e_break')}
                className={cn(
                  "h-8 text-xs border-border/60 w-28",
                  form.formState.errors.e_break && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
                )}
              />
              <Input
                type="text"
                readOnly
                {...form.register('t_break')}
                className="h-8 w-14 text-center text-xs bg-muted/30 border-border/30 font-mono font-bold"
              />
              <span className="text-muted-foreground text-[9px] font-semibold">min</span>
            </div>
            {form.formState.errors.s_break && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.s_break.message)}</p>
            )}
            {form.formState.errors.e_break && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.e_break.message)}</p>
            )}
          </div>
        </div>

        {/* Overtime fields */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            OT Break / Fixed OT
          </Label>
          <div className="col-span-8 flex items-center gap-2">
            <Input
              type="number"
              placeholder="Break min"
              disabled={!isEditing}
              {...form.register('break_ot')}
              className="h-8 text-xs border-border/60 w-24"
            />
            <span className="text-muted-foreground text-[9px] font-semibold mr-2">min</span>
            <Input
              type="number"
              placeholder="OT hrs"
              disabled={!isEditing}
              {...form.register('ot')}
              className="h-8 text-xs border-border/60 w-24"
            />
            <span className="text-muted-foreground text-[9px] font-semibold">hrs</span>
          </div>
        </div>

        {/* Overtime Till */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Overtime Till
          </Label>
          <div className="col-span-8">
            <Input
              type="time"
              disabled={!isEditing}
              {...form.register('e_overtime')}
              className={cn(
                "h-8 text-xs border-border/60 w-28",
                form.formState.errors.e_overtime && "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
              )}
            />
            {form.formState.errors.e_overtime && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.e_overtime.message)}</p>
            )}
          </div>
        </div>

        {/* Timing End Date */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Timing End Date {watchedType && watchedType !== 'Permanent Shift' && '*'}
          </Label>
          <div className="col-span-8">
            <Controller
              name="ted"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!isEditing}
                  triggerClassName={cn(
                    "h-8 border-border/60 text-xs",
                    form.formState.errors.ted && "border-destructive focus:ring-destructive/30 bg-destructive/5"
                  )}
                  placeholder="Select end date"
                />
              )}
            />
            {form.formState.errors.ted && (
              <p className="text-[10px] text-destructive mt-1 font-medium">{String(form.formState.errors.ted.message)}</p>
            )}
          </div>
        </div>

        {/* Consider Default Attendance / Management Member */}
        <div className="grid grid-cols-12 gap-3 items-center">
          <Label className="col-span-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Management Member
          </Label>
          <div className="col-span-8 flex items-center gap-2">
            <input
              type="checkbox"
              id="management"
              disabled={!isEditing}
              {...form.register('management')}
              className="rounded border-border/60 text-primary focus:ring-primary/40 cursor-pointer disabled:opacity-50"
            />
            <label htmlFor="management" className="text-xs text-muted-foreground font-medium select-none cursor-pointer">
              Consider Default Attendance
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
