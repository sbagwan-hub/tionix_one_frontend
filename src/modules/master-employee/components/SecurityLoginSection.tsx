'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmployeeRecord } from '../types';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const SecurityLoginSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  return (
    <div className="flex h-full flex-col gap-4">
      <h3 className="text-brand border-border/20 border-b pb-1.5 text-sm font-bold tracking-wider uppercase">
        Security & Login Setup
      </h3>
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Username *"
            value={formData.username || ''}
            onChange={(e) => onInputChange('username', e.target.value)}
            placeholder="Login username"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
            maxLength={15}
          />
          <FormInput
            label="Password *"
            value={formData.password || ''}
            onChange={(e) => onInputChange('password', e.target.value)}
            placeholder="Login password"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
            showPasswordToggle
            maxLength={10}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground block text-xs font-medium tracking-tight select-none">
              Security Question
            </Label>
            <Select
              value={formData.question || 'What is your favorite food?'}
              onValueChange={(val) => onInputChange('question', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 w-full rounded-sm text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="What is your favorite food?">
                  {`What is your favorite food?`}
                </SelectItem>
                <SelectItem value="What was your first pet's name?">
                  {`What was your first pet's name?`}
                </SelectItem>
                <SelectItem value="What is your mother's maiden name?">
                  {`What is your mother's maiden name?`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormInput
            label="Answer *"
            value={formData.answer || ''}
            onChange={(e) => onInputChange('answer', e.target.value)}
            placeholder="Security answer"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="border-border/10 mt-4 flex flex-col gap-2.5 border-t py-2.5">
        <label className="text-muted-foreground flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={formData.inform_pf || false}
            onCheckedChange={(val) => onInputChange('inform_pf', !!val)}
            disabled={disabled}
          />
          {`Inform Universal Account No. (UAN) about Leaving`}
        </label>
        <label className="text-muted-foreground flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={formData.inform_esic || false}
            onCheckedChange={(val) => onInputChange('inform_esic', !!val)}
            disabled={disabled}
          />
          {`Inform Employees' State Insurance Scheme (ESIC) about Leaving`}
        </label>
      </div>
    </div>
  );
};
