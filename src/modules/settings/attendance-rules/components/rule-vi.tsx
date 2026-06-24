import React from 'react';
import { RuleVIConfig } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RuleVIProps {
  value: RuleVIConfig;
  onChange: (value: RuleVIConfig) => void;
  isEditing: boolean;
  onDefault: () => void;
}

export function RuleVI({ value, onChange, isEditing, onDefault }: RuleVIProps) {
  const handleNumChange = (key: keyof RuleVIConfig, valStr: string) => {
    const val = parseInt(valStr, 10) || 0;
    onChange({
      ...value,
      [key]: val,
    });
  };

  return (
    <div className="flex min-h-full flex-col p-6 space-y-6 w-full">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-lg font-bold text-primary">Rule VI: Special Late Deductions & Policies</h3>

        <div className="space-y-6 text-sm">
          {/* Paragraph 1 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>If an employee is late by</span>
            <Input
              type="number"
              value={value.late_minutes_1}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_minutes_1', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>minutes till</span>
            <Input
              type="number"
              value={value.late_days_1}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_days_1', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>days there is no deduction.</span>
          </div>

          {/* Paragraph 2 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>If an employee is late by</span>
            <Input
              type="number"
              value={value.late_minutes_2}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_minutes_2', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>minutes till</span>
            <Input
              type="number"
              value={value.late_days_2}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_days_2', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>days there is no deduction, but mark as late.</span>
          </div>

          {/* Paragraph 3 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>If an employee is late by more than</span>
            <Input
              type="number"
              value={value.late_half_day_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_half_day_minutes', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>minutes any day, it will be mark as late & half day.</span>
          </div>

          {/* Paragraph 4 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>If an employee is late by more than</span>
            <Input
              type="number"
              value={value.late_half_day_after_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_half_day_after_minutes', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>minutes after</span>
            <Input
              type="number"
              value={value.late_half_day_after_days}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('late_half_day_after_days', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>days late mark, it will be mark as half day.</span>
          </div>

          {/* Paragraph 5 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Working hours less than</span>
            <Input
              type="number"
              value={value.absent_threshold_hours}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('absent_threshold_hours', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>hours will be considered as absent.</span>
          </div>

          {/* Paragraph 6 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Manual adjustment of attendance only</span>
            <Input
              type="number"
              value={value.manual_adjustment_years}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('manual_adjustment_years', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>/years.</span>
          </div>
        </div>

        {/* Default Button */}
        {isEditing && (
          <div className="flex justify-end pt-4">
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
    </div>
  );
}
