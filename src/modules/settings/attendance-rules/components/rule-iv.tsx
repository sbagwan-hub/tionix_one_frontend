import React from 'react';
import { RuleIVConfig, RuleIVConfigExtra } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RuleIVProps {
  value: RuleIVConfig;
  onChange: (value: RuleIVConfig) => void;
  extraValue: RuleIVConfigExtra;
  onExtraChange: (extraValue: RuleIVConfigExtra) => void;
  isEditing: boolean;
  onDefault: () => void;
}

export function RuleIV({
  value,
  onChange,
  extraValue,
  onExtraChange,
  isEditing,
  onDefault,
}: RuleIVProps) {
  const handleRangeChange = (index: number, key: 'from_min' | 'to_min' | 'late_mark', valStr: string) => {
    const val = valStr === '' ? 0 : parseInt(valStr, 10);
    const newRanges = [...value.ranges];
    newRanges[index] = {
      ...newRanges[index],
      [key]: isNaN(val) ? 0 : val,
    };
    onChange({
      ...value,
      ranges: newRanges,
    });
  };

  const handleNumChange = (key: keyof RuleIVConfig, valStr: string) => {
    const val = valStr === '' ? 0 : parseInt(valStr, 10);
    const parsedVal = isNaN(val) ? 0 : val;
    if (key === 'absent_threshold_minutes') {
      onChange({
        ...value,
        absent_threshold_minutes: parsedVal,
        half_day_min_minutes: parsedVal + 1,
      });
    } else {
      onChange({
        ...value,
        [key]: parsedVal,
      });
    }
  };

  const handleExtraNumChange = (key: keyof RuleIVConfigExtra, valStr: string) => {
    const val = valStr === '' ? 0 : parseInt(valStr, 10);
    onExtraChange({
      ...extraValue,
      [key]: isNaN(val) ? 0 : val,
    });
  };

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-base font-bold text-primary border-b pb-2">
          Office Staff, Temporary, Apprentice and Miscellaneous (Late Coming / Early Going)
        </h3>

        {/* Ranges */}
        <div className="space-y-3">
          {value.ranges.map((range, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3 text-sm">
              <span className="w-10 text-muted-foreground font-semibold">From</span>
              <Input
                type="number"
                value={range.from_min === 0 ? '' : range.from_min}
                disabled={!isEditing}
                onChange={(e) => handleRangeChange(index, 'from_min', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>min</span>

              <span className="text-muted-foreground font-semibold">To</span>
              <Input
                type="number"
                value={range.to_min === 0 ? '' : range.to_min}
                disabled={!isEditing}
                onChange={(e) => handleRangeChange(index, 'to_min', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>min</span>

              <span className="text-muted-foreground font-semibold">Consider</span>
              <Input
                type="number"
                value={range.late_mark === 0 ? '' : range.late_mark}
                disabled={!isEditing}
                onChange={(e) => handleRangeChange(index, 'late_mark', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>Late Mark</span>
            </div>
          ))}
        </div>

        {/* General late marks */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>Every</span>
          <Input
            type="number"
            value={value.every_late_mark === 0 ? '' : value.every_late_mark}
            disabled={!isEditing}
            onChange={(e) => handleNumChange('every_late_mark', e.target.value)}
            className="w-18 h-8 text-center font-semibold"
          />
          <span>Late Mark, Consider One Half Day.</span>
        </div>

        {/* Yearly allowances */}
        <div className="flex flex-wrap items-center gap-2 text-sm leading-8">
          <span>Employee gets</span>
          <Input
            type="number"
            value={value.yearly_hours === 0 ? '' : value.yearly_hours}
            disabled={!isEditing}
            onChange={(e) => handleNumChange('yearly_hours', e.target.value)}
            className="w-20 h-8 text-center font-semibold"
          />
          <span>Hours in a Year, they can utilize for Early Going and Late Coming. Maximum</span>
          <Input
            type="number"
            value={value.max_monthly_adjusted_hours === 0 ? '' : value.max_monthly_adjusted_hours}
            disabled={!isEditing}
            onChange={(e) => handleNumChange('max_monthly_adjusted_hours', e.target.value)}
            className="w-18 h-8 text-center font-semibold"
          />
          <span>Hours can be adjusted in a Month.</span>
        </div>

        {/* Working thresholds */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="w-36 text-muted-foreground font-medium">Working Less Than</span>
            <Input
              type="number"
              value={value.absent_threshold_minutes === 0 ? '' : value.absent_threshold_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('absent_threshold_minutes', e.target.value)}
              className="w-20 h-8 text-center font-semibold"
            />
            <span>Minutes, Consider Absent.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="w-36 text-muted-foreground font-medium">Working More Than</span>
            <Input
              type="number"
              value={value.half_day_min_minutes === 0 ? '' : value.half_day_min_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('half_day_min_minutes', e.target.value)}
              className="w-20 h-8 text-center font-semibold"
            />
            <span>Minutes and Less Than</span>
            <Input
              type="number"
              value={value.half_day_max_minutes === 0 ? '' : value.half_day_max_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('half_day_max_minutes', e.target.value)}
              className="w-20 h-8 text-center font-semibold"
            />
            <span>Minutes, Consider Half Day.</span>
          </div>
        </div>

        {/* Worker section */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="worker-checkbox"
              checked={extraValue.is_worker_contractor}
              disabled={!isEditing}
              onCheckedChange={(checked) =>
                onExtraChange({ ...extraValue, is_worker_contractor: !!checked })
              }
            />
            <Label htmlFor="worker-checkbox" className="text-sm font-bold text-foreground cursor-pointer">
              Worker, Contractor, Factory and Project
            </Label>
          </div>

          <div className="pl-6 space-y-2 text-sm">
            <p className="text-muted-foreground italic">Consider Rule I for Regular Attendance.</p>
            <div className="flex flex-wrap items-center gap-2">
              <span>For getting incentive, employee has to work full month less</span>
              <Input
                type="number"
                value={extraValue.incentive_max_days_less === 0 ? '' : extraValue.incentive_max_days_less}
                disabled={!isEditing}
                onChange={(e) => handleExtraNumChange('incentive_max_days_less', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>days in a month and work</span>
              <Input
                type="number"
                value={extraValue.incentive_overtime_hours === 0 ? '' : extraValue.incentive_overtime_hours}
                disabled={!isEditing}
                onChange={(e) => handleExtraNumChange('incentive_overtime_hours', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>hours Overtime everyday.</span>
            </div>
          </div>
        </div>

        {/* Default Button */}
        {isEditing && (
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDefault}
              className="px-4 font-semibold"
            >
              Default
            </Button>
          </div>
        )}
      </div>

      {/* Note footer */}
      <div className="text-xs text-muted-foreground bg-muted/30 border rounded-lg p-4 leading-relaxed shrink-0">
        <span className="font-bold text-primary mr-1">Note:</span>
        Above formulae will work after buffer time allowed for late coming/early going in Salary Structure. Beyond above setting, the system will consider actual working hours, which can be corrected manually.
      </div>
    </div>
  );
}
