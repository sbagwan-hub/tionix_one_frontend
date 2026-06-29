import React from 'react';
import { LinkageFieldsConfig } from '../types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LinkageFieldsProps {
  value: LinkageFieldsConfig;
  onChange: (value: LinkageFieldsConfig) => void;
  isEditing: boolean;
}

export function LinkageFields({ value, onChange, isEditing }: LinkageFieldsProps) {
  const handleSelectChange = (key: keyof LinkageFieldsConfig, val: string) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const ruleOptions = [
    'Rule I',
    'Rule II',
    'Rule III',
    'Rule IV',
    'Rule V',
    'Rule VI',
  ];

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <h3 className="text-lg font-bold text-primary">ERP Field Linkage & Policy Selector</h3>

        <div className="space-y-4 max-w-md">
          {/* Active Rule Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Attendance Rule
            </Label>
            <Select
              disabled={!isEditing}
              value={value.selectedRuleTag}
              onValueChange={(val) => handleSelectChange('selectedRuleTag', val)}
            >
              <SelectTrigger className="w-full h-10 border-border/60">
                <SelectValue placeholder="Select active rule" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover z-[10000]">
                {ruleOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground/80">
              Select the primary active evaluation rule for daily attendance calculations.
            </p>
          </div>

          {/* Employee ID Linkage Field */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Employee ID Reference Field
            </Label>
            <Select
              disabled={!isEditing}
              value={value.empIdField}
              onValueChange={(val) => handleSelectChange('empIdField', val)}
            >
              <SelectTrigger className="w-full h-10 border-border/60">
                <SelectValue placeholder="Select Employee ID field" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover z-[10000]">
                <SelectItem value="ddEmpId">ddEmpId (Default)</SelectItem>
                <SelectItem value="pk_emp_id">pk_emp_id</SelectItem>
                <SelectItem value="emp_code">emp_code</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time In Linkage Field */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Time In Reference Field
            </Label>
            <Select
              disabled={!isEditing}
              value={value.timeInField}
              onValueChange={(val) => handleSelectChange('timeInField', val)}
            >
              <SelectTrigger className="w-full h-10 border-border/60">
                <SelectValue placeholder="Select Time In field" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover z-[10000]">
                <SelectItem value="ddTimeIn">ddTimeIn (Default)</SelectItem>
                <SelectItem value="time_in">time_in</SelectItem>
                <SelectItem value="s_work">s_work</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
