import React from 'react';
import { SalarySettingsData } from '../../types';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';

interface ProvidentFundEsicBonusProps {
  value: SalarySettingsData;
  onChange: (value: SalarySettingsData) => void;
  isEditing: boolean;
}

export function ProvidentFundEsicBonus({ value, onChange, isEditing }: ProvidentFundEsicBonusProps) {
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

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex flex-col space-y-6 w-full">

        {/* Provident & Pension Section */}
        <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Provident Fund & Pension Scheme</h3>

          <div className="flex flex-col space-y-4">
            <FormInput
              label="Provident Fund (% of Basic Salary + Dearness Allowance)"
              type="number"
              disabled={!isEditing}
              value={value.pfBasicRate}
              onChange={(e) => handleNumChange('pfBasicRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Basic Salary + Dearness Allowance Upto"
              type="number"
              disabled={!isEditing}
              value={value.pfBasicLimit}
              onChange={(e) => handleNumChange('pfBasicLimit', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Provident Fund (% of Employer Contribution)"
              type="number"
              disabled={!isEditing}
              value={value.pfEmployerShareRate}
              onChange={(e) => handleNumChange('pfEmployerShareRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Pension Scheme (% of Employer Contribution)"
              type="number"
              disabled={!isEditing}
              value={value.pensionEmployerRate}
              onChange={(e) => handleNumChange('pensionEmployerRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Deposit Linked Insurance Scheme (% of Employer Contribution)"
              type="number"
              disabled={!isEditing}
              value={value.dlisEmployerRate}
              onChange={(e) => handleNumChange('dlisEmployerRate', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Administration Charges Section */}
        <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Administration Charges</h3>

          <div className="flex flex-col space-y-4">
            <FormInput
              label="Administration Charges for Provident Fund (% of Employer Contribution)"
              type="number"
              disabled={!isEditing}
              value={value.pfAdminRate}
              onChange={(e) => handleNumChange('pfAdminRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Minimum (Provident Fund)"
              type="number"
              disabled={!isEditing}
              value={value.pfAdminMin}
              onChange={(e) => handleNumChange('pfAdminMin', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Administration Charges for Deposit Linked Insurance Scheme (% of Employer Contribution)"
              type="number"
              disabled={!isEditing}
              value={value.dlisAdminRate}
              onChange={(e) => handleNumChange('dlisAdminRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Minimum (Deposit Linked Insurance Scheme)"
              type="number"
              disabled={!isEditing}
              value={value.dlisAdminMin}
              onChange={(e) => handleNumChange('dlisAdminMin', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* ESIC Section */}
        <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">ESIC Settings</h3>

          <div className="flex flex-col space-y-4">
            <FormInput
              label="ESIC (% of Gross Salary excluding Travelling Allowance)"
              type="number"
              disabled={!isEditing}
              value={value.esicGrossRate}
              onChange={(e) => handleNumChange('esicGrossRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Gross Salary (excluding Travelling Allowance) Upto"
              type="number"
              disabled={!isEditing}
              value={value.esicGrossLimit}
              onChange={(e) => handleNumChange('esicGrossLimit', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="ESIC (% of Employer Contribution)"
              type="number"
              disabled={!isEditing}
              value={value.esicEmployerRate}
              onChange={(e) => handleNumChange('esicEmployerRate', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Bonus & Hourly Section */}
        <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Bonus & Hourly Calculations</h3>

          <div className="flex flex-col space-y-4">
            <FormInput
              label="Bonus (% of Basic Salary + Dearness Allowance)"
              type="number"
              disabled={!isEditing}
              value={value.bonusRate}
              onChange={(e) => handleNumChange('bonusRate', e.target.value)}
              className="w-full"
            />
            <FormInput
              label="Average Salary (/ Hours)"
              type="number"
              disabled={!isEditing}
              value={value.averageSalaryHours}
              onChange={(e) => handleNumChange('averageSalaryHours', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
