import React from 'react';
import { SalarySettingsData } from '../../types';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup as UIRadioGroup, RadioGroupItem as UIRadioGroupItem } from '@/components/ui/radio-group';

interface LabourWelfareFundProps {
  value: SalarySettingsData;
  onChange: (value: SalarySettingsData) => void;
  isEditing: boolean;
}

export function LabourWelfareFund({ value, onChange, isEditing }: LabourWelfareFundProps) {
  const handleChange = (key: keyof SalarySettingsData, val: any) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleNumChange = (key: keyof SalarySettingsData, valStr: string) => {
    const num = parseFloat(valStr) || 0;
    handleChange(key, num);
  };

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      
      {/* General Settings Card */}
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6 w-full">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Labour Welfare Fund Deduction Policy</h3>
        
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mode of Deduction</Label>
            <Select
              disabled={!isEditing}
              value={value.lwfMode}
              onValueChange={(val) => handleChange('lwfMode', val)}
            >
              <SelectTrigger className="w-full h-9 border-border/60">
                <SelectValue placeholder="Select deduction mode" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover z-[10000]">
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/40">
            <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Deduction Months</Label>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Month 1</Label>
                <Select
                  disabled={!isEditing}
                  value={value.lwfMonth1}
                  onValueChange={(val) => handleChange('lwfMonth1', val)}
                >
                  <SelectTrigger className="w-full h-9 border-border/60">
                    <SelectValue placeholder="Select Month 1" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover z-[10000]">
                    {monthOptions.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Month 2</Label>
                <Select
                  disabled={!isEditing || value.lwfMode !== 'Half Yearly'}
                  value={value.lwfMonth2}
                  onValueChange={(val) => handleChange('lwfMonth2', val)}
                >
                  <SelectTrigger className="w-full h-9 border-border/60">
                    <SelectValue placeholder="Select Month 2" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover z-[10000]">
                    {monthOptions.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Selector Section */}
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Rule Configuration</Label>
        </div>

        <UIRadioGroup
          disabled={!isEditing}
          value={value.lwfRule}
          onValueChange={(val) => handleChange('lwfRule', val)}
          className="flex flex-col space-y-6"
        >
          {/* Rule I Card */}
          <div className={`relative rounded-xl border p-6 transition-all duration-300 ${
            value.lwfRule === 'Rule I' 
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' 
              : 'border-border/60 bg-card/20 opacity-70'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <UIRadioGroupItem value="Rule I" id="r1" className="text-primary border-primary focus:ring-primary" />
              <Label htmlFor="r1" className="text-sm font-bold text-foreground cursor-pointer">Rule I</Label>
            </div>
            
            <div className="flex flex-col space-y-4">
              <FormInput
                label="Employee Contribution"
                type="number"
                disabled={!isEditing || value.lwfRule !== 'Rule I'}
                value={value.lwfRule1Employee || ''}
                onChange={(e) => handleNumChange('lwfRule1Employee', e.target.value)}
                className="w-full"
              />
              <FormInput
                label="Employer Contribution"
                type="number"
                disabled={!isEditing || value.lwfRule !== 'Rule I'}
                value={value.lwfRule1Employer || ''}
                onChange={(e) => handleNumChange('lwfRule1Employer', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Rule II Card */}
          <div className={`relative rounded-xl border p-6 transition-all duration-300 ${
            value.lwfRule === 'Rule II' 
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' 
              : 'border-border/60 bg-card/20 opacity-70'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <UIRadioGroupItem value="Rule II" id="r2" className="text-primary border-primary focus:ring-primary" />
              <Label htmlFor="r2" className="text-sm font-bold text-foreground cursor-pointer">Rule II</Label>
            </div>

            <div className="flex flex-col space-y-4">
              <FormInput
                label="Upto Limit"
                type="number"
                disabled={!isEditing || value.lwfRule !== 'Rule II'}
                value={value.lwfRule2UptoLimit}
                onChange={(e) => handleNumChange('lwfRule2UptoLimit', e.target.value)}
                className="w-full"
              />

              <div className="border-t border-border/40 my-2 pt-2" />

              <div className="flex flex-col space-y-4">
                <div className="space-y-3 p-4 bg-background/40 rounded-lg border border-border/40">
                  <div className="text-xs font-bold text-primary tracking-wide">Upto {value.lwfRule2UptoLimit}</div>
                  <FormInput
                    label="Employee Contribution"
                    type="number"
                    disabled={!isEditing || value.lwfRule !== 'Rule II'}
                    value={value.lwfRule2UptoEmployee}
                    onChange={(e) => handleNumChange('lwfRule2UptoEmployee', e.target.value)}
                  />
                  <FormInput
                    label="Employer Contribution"
                    type="number"
                    disabled={!isEditing || value.lwfRule !== 'Rule II'}
                    value={value.lwfRule2UptoEmployer}
                    onChange={(e) => handleNumChange('lwfRule2UptoEmployer', e.target.value)}
                  />
                </div>

                <div className="space-y-3 p-4 bg-background/40 rounded-lg border border-border/40">
                  <div className="text-xs font-bold text-primary tracking-wide">Above {value.lwfRule2UptoLimit}</div>
                  <FormInput
                    label="Employee Contribution"
                    type="number"
                    disabled={!isEditing || value.lwfRule !== 'Rule II'}
                    value={value.lwfRule2AboveEmployee}
                    onChange={(e) => handleNumChange('lwfRule2AboveEmployee', e.target.value)}
                  />
                  <FormInput
                    label="Employer Contribution"
                    type="number"
                    disabled={!isEditing || value.lwfRule !== 'Rule II'}
                    value={value.lwfRule2AboveEmployer}
                    onChange={(e) => handleNumChange('lwfRule2AboveEmployer', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </UIRadioGroup>
      </div>

    </div>
  );
}
