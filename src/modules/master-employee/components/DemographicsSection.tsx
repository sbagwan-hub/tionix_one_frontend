'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMasterSalary } from '@/modules/master-salary/hooks/useMasterSalary';
import { EmployeeRecord } from '../types';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const DemographicsSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const skintonesQuery = useMasterSalary('skintones');
  const castesQuery = useMasterSalary('castes');
  const religionsQuery = useMasterSalary('religions');

  return (
    <div className="flex flex-col gap-4 h-full justify-between">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand border-b border-border/20 pb-1.5">
        Demographics & Referral References
      </h3>
      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Skin Tone
            </Label>
            <Select
              value={formData.fk_st_id ? String(formData.fk_st_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_st_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(skintonesQuery.list.data || []).map((sk: any) => (
                  <SelectItem key={sk.pk_st_id} value={String(sk.pk_st_id)}>
                    {sk.skintone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Religion
            </Label>
            <Select
              value={formData.fk_rg_id ? String(formData.fk_rg_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_rg_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(religionsQuery.list.data || []).map((rl: any) => (
                  <SelectItem key={rl.pk_rg_id} value={String(rl.pk_rg_id)}>
                    {rl.religion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Caste
            </Label>
            <Select
              value={formData.fk_cs_id ? String(formData.fk_cs_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_cs_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(castesQuery.list.data || []).map((cs: any) => (
                  <SelectItem key={cs.pk_cs_id} value={String(cs.pk_cs_id)}>
                    {cs.caste}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormInput
            label="Identification Mark"
            value={formData.mark || ''}
            onChange={(e) => onInputChange('mark', e.target.value)}
            placeholder="e.g. mole on cheek"
            className="h-9 text-sm rounded-sm"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Total Experience
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Years"
                className="h-9 text-sm rounded-sm bg-background/50"
                disabled={disabled}
                value={formData.experience && formData.experience.includes('.') ? formData.experience.split('.')[0] : ''}
                onChange={(e) => {
                  const y = e.target.value || '0';
                  const m = formData.experience && formData.experience.includes('.') ? formData.experience.split('.')[1] : '0';
                  onInputChange('experience', `${y.padStart(2, '0')}.${m.padStart(2, '0')}`);
                }}
              />
              <Input
                type="number"
                placeholder="Months"
                className="h-9 text-sm rounded-sm bg-background/50"
                disabled={disabled}
                value={formData.experience && formData.experience.includes('.') ? formData.experience.split('.')[1] : ''}
                onChange={(e) => {
                  const y = formData.experience && formData.experience.includes('.') ? formData.experience.split('.')[0] : '0';
                  const m = e.target.value || '0';
                  onInputChange('experience', `${y.padStart(2, '0')}.${m.padStart(2, '0')}`);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Referred By
            </Label>
            <Select
              value={formData.fk_r_emp_id ? String(formData.fk_r_emp_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_r_emp_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1">Vijay Kumar</SelectItem>
                <SelectItem value="2">Ananya Sharma</SelectItem>
                <SelectItem value="3">Rahul Verma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Witness 1 (Leaving)
            </Label>
            <Select
              value={formData.fk_w1_emp_id ? String(formData.fk_w1_emp_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_w1_emp_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Witness 1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="10">Ramesh Shah</SelectItem>
                <SelectItem value="11">Riya Sen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Witness 2 (Leaving)
            </Label>
            <Select
              value={formData.fk_w2_emp_id ? String(formData.fk_w2_emp_id) : 'none'}
              onValueChange={(val) => onInputChange('fk_w2_emp_id', val === 'none' ? null : parseInt(val, 10))}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 rounded-sm text-sm w-full">
                <SelectValue placeholder="Witness 2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="10">Ramesh Shah</SelectItem>
                <SelectItem value="11">Riya Sen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
