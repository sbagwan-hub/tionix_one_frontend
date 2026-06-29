import React from 'react';
import { RuleIIConfig } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RuleIIProps {
  value: RuleIIConfig;
  onChange: (value: RuleIIConfig) => void;
  isEditing: boolean;
  onDefault: () => void;
}

export function RuleII({ value, onChange, isEditing, onDefault }: RuleIIProps) {
  const handleNumChange = (key: keyof RuleIIConfig, valStr: string) => {
    const val = valStr === '' ? 0 : parseInt(valStr, 10);
    onChange({
      ...value,
      [key]: isNaN(val) ? 0 : val,
    });
  };

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-lg font-bold text-primary">Rule II: Monthly Late/Early Allowances</h3>

        <div className="space-y-6 text-sm">
          {/* Paragraph 1 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Only</span>
            <Input
              type="number"
              value={value.days_allowed === 0 ? '' : value.days_allowed}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('days_allowed', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>days allowed in a month for late coming/early going, provided employee has completed</span>
            <Input
              type="number"
              value={value.min_completed_minutes === 0 ? '' : value.min_completed_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('min_completed_minutes', e.target.value)}
              className="w-24 h-9 text-center font-semibold"
            />
            <span>minutes excluding meal break.</span>
          </div>

          {/* Paragraph 2 */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <Input
              type="number"
              value={value.days_onward === 0 ? '' : value.days_onward}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('days_onward', e.target.value)}
              className="w-20 h-9 text-center font-semibold"
            />
            <span>days onward, for late coming/early going in a month, will consider</span>
            <Input
              type="number"
              value={value.working_time_minutes === 0 ? '' : value.working_time_minutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('working_time_minutes', e.target.value)}
              className="w-24 h-9 text-center font-semibold"
            />
            <span>minutes as actual working time excluding meal break.</span>
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

      {/* Note footer */}
      <div className="text-xs text-muted-foreground bg-muted/30 border rounded-lg p-4 leading-relaxed">
        <span className="font-bold text-primary mr-1">Note:</span>
        Above formulae will work after buffer time allowed for late coming/early going in Salary Structure. Beyond above setting, the system will consider actual working hours, which can be corrected manually.
      </div>
    </div>
  );
}
