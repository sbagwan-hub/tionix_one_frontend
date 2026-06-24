import React from 'react';
import { RuleVConfig, RuleVConfigExtra } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RuleVProps {
  value: RuleVConfig;
  onChange: (value: RuleVConfig) => void;
  extraValue: RuleVConfigExtra;
  onExtraChange: (extraValue: RuleVConfigExtra) => void;
  isEditing: boolean;
  onDefault: () => void;
}

export function RuleV({
  value,
  onChange,
  extraValue,
  onExtraChange,
  isEditing,
  onDefault,
}: RuleVProps) {
  
  const handleRuleAStringChange = (key: keyof RuleVConfig['ruleA'], val: string) => {
    onChange({
      ...value,
      ruleA: {
        ...value.ruleA,
        [key]: val,
      },
    });
  };

  const handleRuleANumChange = (key: keyof RuleVConfig['ruleA'], valStr: string) => {
    const val = parseInt(valStr, 10) || 0;
    onChange({
      ...value,
      ruleA: {
        ...value.ruleA,
        [key]: val,
      },
    });
  };

  const handleRuleABoolChange = (key: keyof RuleVConfig['ruleA'], val: boolean) => {
    onChange({
      ...value,
      ruleA: {
        ...value.ruleA,
        [key]: val,
      },
    });
  };

  const handleRuleBStringChange = (key: keyof RuleVConfigExtra['ruleB'], val: string) => {
    onExtraChange({
      ...extraValue,
      ruleB: {
        ...extraValue.ruleB,
        [key]: val,
      },
    });
  };

  const handleRuleBNumChange = (key: keyof RuleVConfigExtra['ruleB'], valStr: string) => {
    const val = parseInt(valStr, 10) || 0;
    onExtraChange({
      ...extraValue,
      ruleB: {
        ...extraValue.ruleB,
        [key]: val,
      },
    });
  };

  return (
    <div className="flex min-h-full flex-col p-6 space-y-6 w-full">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        
        {/* Rule A */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">Rule A:</span>
            <Input
              type="text"
              value={value.ruleA.name}
              disabled={!isEditing}
              onChange={(e) => handleRuleAStringChange('name', e.target.value)}
              className="w-48 h-8 font-semibold"
              placeholder="Rule A Name"
            />
          </div>

          <div className="pl-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm leading-8">
              <span>If an employee is late/early go by less than</span>
              <Input
                type="number"
                value={value.ruleA.minutes}
                disabled={!isEditing}
                onChange={(e) => handleRuleANumChange('minutes', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>minutes up till</span>
              <Input
                type="number"
                value={value.ruleA.no_deduction_days}
                disabled={!isEditing}
                onChange={(e) => handleRuleANumChange('no_deduction_days', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>days there is no deduction.</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm leading-8">
              <span>If an employee is late/early go for the</span>
              <Input
                type="number"
                value={value.ruleA.deduct_from_day}
                disabled={!isEditing}
                onChange={(e) => handleRuleANumChange('deduct_from_day', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>th day, every late minute from that day onwards is deductible.</span>
            </div>

            <div className="flex flex-col space-y-2 pt-1 pl-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="applicable-late"
                  checked={value.ruleA.applicable_late}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => handleRuleABoolChange('applicable_late', !!checked)}
                />
                <Label htmlFor="applicable-late" className="text-xs font-semibold cursor-pointer">
                  Applicable for Late Coming.
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="applicable-early"
                  checked={value.ruleA.applicable_early}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => handleRuleABoolChange('applicable_early', !!checked)}
                />
                <Label htmlFor="applicable-early" className="text-xs font-semibold cursor-pointer">
                  Applicable for Early Going.
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Rule B */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">Rule B:</span>
            <Input
              type="text"
              value={extraValue.ruleB.name}
              disabled={!isEditing}
              onChange={(e) => handleRuleBStringChange('name', e.target.value)}
              className="w-48 h-8 font-semibold"
              placeholder="Rule B Name"
            />
          </div>

          <div className="pl-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm leading-8">
              <span>Late arrival up to</span>
              <Input
                type="number"
                value={extraValue.ruleB.minutes}
                disabled={!isEditing}
                onChange={(e) => handleRuleBNumChange('minutes', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>minutes up till</span>
              <Input
                type="number"
                value={extraValue.ruleB.no_deduction_days}
                disabled={!isEditing}
                onChange={(e) => handleRuleBNumChange('no_deduction_days', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>days there is no deduction.</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm leading-8">
              <span>If an employee is late for the</span>
              <Input
                type="number"
                value={extraValue.ruleB.deduct_from_day}
                disabled={!isEditing}
                onChange={(e) => handleRuleBNumChange('deduct_from_day', e.target.value)}
                className="w-18 h-8 text-center font-semibold"
              />
              <span>th day, every late minute from that day onwards is deductible.</span>
            </div>

            <p className="text-muted-foreground text-xs italic pl-1">
              However, minutes of late arrival can be compensated by working extra time after the shift time end.
            </p>
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
        For late coming/early going, Employee has to inform his/her supervisor and make sure it will be updated in system. Warning Letter will be issued, if 4 or more uninformed late coming/early going in a month.
      </div>
    </div>
  );
}
