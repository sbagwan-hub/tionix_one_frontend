import React from 'react';
import { ImportConditionConfig } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ImportConditionProps {
  value: ImportConditionConfig;
  onChange: (value: ImportConditionConfig) => void;
  isEditing: boolean;
}

export function ImportCondition({ value, onChange, isEditing }: ImportConditionProps) {
  const handleNumChange = (key: keyof ImportConditionConfig, valStr: string) => {
    const val = valStr === '' ? 0 : parseInt(valStr, 10);
    onChange({
      ...value,
      [key]: isNaN(val) ? 0 : val,
    });
  };

  const handleBoolChange = (checked: boolean) => {
    onChange({
      ...value,
      enabled: checked,
    });
  };

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-lg font-bold text-primary">Import Condition (Monthly Incentives)</h3>

        <div className="space-y-6 text-sm">
          {/* Enabled Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="incentive-enabled"
              checked={value.enabled}
              disabled={!isEditing}
              onCheckedChange={(checked) => handleBoolChange(!!checked)}
            />
            <Label htmlFor="incentive-enabled" className="text-sm font-bold text-foreground cursor-pointer">
              Enable Monthly Attendance Incentives Calculation
            </Label>
          </div>

          {/* Full Day Minutes */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Consider Full Day attendance if actual worked time is at least</span>
            <Input
              type="number"
              value={value.fullDayMinutes === 0 ? '' : value.fullDayMinutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('fullDayMinutes', e.target.value)}
              className="w-24 h-9 text-center font-semibold"
            />
            <span>minutes excluding lunch break.</span>
          </div>

          {/* Half Day Minutes */}
          <div className="flex flex-wrap items-center gap-2 leading-8">
            <span>Consider Half Day attendance if actual worked time is at least</span>
            <Input
              type="number"
              value={value.halfDayMinutes === 0 ? '' : value.halfDayMinutes}
              disabled={!isEditing}
              onChange={(e) => handleNumChange('halfDayMinutes', e.target.value)}
              className="w-24 h-9 text-center font-semibold"
            />
            <span>minutes and less than full day requirement.</span>
          </div>
        </div>
      </div>

      {/* Note footer */}
      <div className="text-xs text-muted-foreground bg-muted/30 border rounded-lg p-4 leading-relaxed">
        <span className="font-bold text-primary mr-1">Note:</span>
        These configurations determine the minimum thresholds for monthly incentive allowances during attendance import logs processing.
      </div>
    </div>
  );
}
