'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { EmployeeRecord } from '../types';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const PoliceStationSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand border-b border-border/20 pb-1.5">
        Nearest Police Station
      </h3>
      <div className="flex flex-col gap-3.5 mt-2">
        <FormInput
          label="Station Name"
          value={formData.police || ''}
          onChange={(e) => onInputChange('police', e.target.value)}
          placeholder="Station Name"
          className="h-9 text-sm rounded-sm"
          disabled={disabled}
        />
        <FormInput
          label="Station Address"
          value={formData.add_police || ''}
          onChange={(e) => onInputChange('add_police', e.target.value)}
          placeholder="Address"
          className="h-9 text-sm rounded-sm"
          disabled={disabled}
        />
        <FormInput
          label="Station Contact"
          value={formData.cont_police || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/[^\d+]/g, '');
            onInputChange('cont_police', val);
          }}
          placeholder="Contact No."
          className="h-9 text-sm rounded-sm"
          disabled={disabled}
          maxLength={25}
        />
      </div>
    </div>
  );
};
