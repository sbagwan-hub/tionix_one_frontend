import React from 'react';
import { RuleIIIConfig } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RuleIIIProps {
  value: RuleIIIConfig;
  onChange: (value: RuleIIIConfig) => void;
  isEditing: boolean;
  onDefault: () => void;
}

export function RuleIII({ value, onChange, isEditing, onDefault }: RuleIIIProps) {
  const handleRangeChange = (index: number, key: 'from_min' | 'to_min' | 'deduct_min', valStr: string) => {
    const val = parseInt(valStr, 10) || 0;
    const newRanges = [...value.ranges];
    newRanges[index] = {
      ...newRanges[index],
      [key]: val,
    };
    onChange({
      ...value,
      ranges: newRanges,
    });
  };

  return (
    <div className="flex min-h-full flex-col p-6 space-y-6 w-full">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-lg font-bold text-primary">Rule III: Shift Late Coming Deductions</h3>

        <div className="space-y-4">
          {value.ranges.map((range, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3 text-sm leading-8">
              <span className="w-10 text-muted-foreground font-semibold">From</span>
              <Input
                type="number"
                value={range.from_min}
                disabled={!isEditing}
                onChange={(e) => handleRangeChange(index, 'from_min', e.target.value)}
                className="w-20 h-9 text-center font-semibold"
              />
              <span>min</span>

              <span className="text-muted-foreground font-semibold">To</span>
              <Input
                type="number"
                value={range.to_min}
                disabled={!isEditing}
                onChange={(e) => handleRangeChange(index, 'to_min', e.target.value)}
                className="w-20 h-9 text-center font-semibold"
              />
              <span>min</span>

              <span className="text-muted-foreground font-semibold">Deduct</span>
              <Input
                type="number"
                value={range.deduct_min}
                disabled={!isEditing}
                onChange={(e) => handleRangeChange(index, 'deduct_min', e.target.value)}
                className="w-20 h-9 text-center font-semibold animate-pulse-once"
              />
              <span>min From actual working hours.</span>
            </div>
          ))}
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
      <div className="text-xs text-muted-foreground bg-muted/30 border rounded-lg p-4 leading-relaxed space-y-2">
        <p>
          <span className="font-bold text-primary mr-1">Note 1:</span>
          This formula works only when the employee comes late. Otherwise, the system will consider actual working hours for early going, which can be corrected manually.
        </p>
        <p>
          <span className="font-bold text-primary mr-1">Note 2:</span>
          Above formulae will work after buffer time allowed for late coming in Salary Structure. Beyond above setting, the system will consider actual working hours, which can be corrected manually.
        </p>
      </div>
    </div>
  );
}
