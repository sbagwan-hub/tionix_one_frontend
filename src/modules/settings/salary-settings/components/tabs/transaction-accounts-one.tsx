import React from 'react';
import { SalarySettingsData } from '../../types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionAccountsOneProps {
  value: SalarySettingsData;
  onChange: (value: SalarySettingsData) => void;
  isEditing: boolean;
}

export function TransactionAccountsOne({ value, onChange, isEditing }: TransactionAccountsOneProps) {
  const handleChange = (key: keyof SalarySettingsData, val: string) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const accountOptions = [
    { value: 'ACC001', label: 'PROFESSION TAX' },
    { value: 'ACC002', label: 'PROVIDENT FUND' },
    { value: 'ACC003', label: 'ESIC' },
    { value: 'ACC004', label: 'TDS ACCOUNT' },
    { value: 'ACC005', label: 'SALARY' },
    { value: 'ACC006', label: 'ADVANCE' },
    { value: 'ACC007', label: 'LOAN' },
    { value: 'ACC008', label: 'INTEREST CHARGES' },
    { value: 'ACC009', label: 'BONUS' },
    { value: 'ACC010', label: 'EXGRATIA' },
    { value: 'ACC011', label: 'GRATUITY' },
    { value: 'ACC012', label: 'LABOUR WELFARE FUND' }
  ];

  const renderRow = (
    label: string,
    key: keyof SalarySettingsData,
    suffix?: string
  ) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg hover:bg-muted/30 border border-border/20 hover:border-border/60 transition-all">
        <div className="flex-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label} <span className="text-destructive">*</span>
          </Label>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-72">
          <Select
            disabled={!isEditing}
            value={value[key] as string}
            onValueChange={(val) => handleChange(key, val)}
          >
            <SelectTrigger className="w-full h-9 border-border/60 font-mono text-xs">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover z-[10000]">
              {accountOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {suffix && (
            <span className="text-[10px] text-muted-foreground/80 font-semibold whitespace-nowrap min-w-[70px]">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-6 space-y-6 w-full h-auto max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="rounded-xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Transaction Account Mappings (Part I)</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Map salary deduction and benefit fields to corporate ledger accounts.
          </p>
        </div>

        <div className="space-y-3 w-full">
          {renderRow('Professional Tax Account', 'accountPt')}
          {renderRow('Provident Fund Account', 'accountPfEmployee', 'of Employee')}
          {renderRow('Provident Fund Account', 'accountPfEmployer', 'of Employer')}
          {renderRow('Pension Scheme Account', 'accountPensionEmployer', 'of Employer')}
          {renderRow('Deposit Linked Insurance Scheme Account', 'accountDlisEmployer', 'of Employer')}
          {renderRow('Administration Charges for Provident Fund Account', 'accountPfAdmin', 'of Employer')}
          {renderRow('Administration Charges for Deposit Linked Insurance Scheme Account', 'accountDlisAdmin', 'of Employer')}
          {renderRow('ESIC Account', 'accountEsicEmployee', 'of Employee')}
          {renderRow('ESIC Account', 'accountEsicEmployer', 'of Employer')}
          {renderRow('TDS Account', 'accountTds')}
          {renderRow('Notice Retention (Office Staff)', 'accountNoticeRetentionOffice')}
          {renderRow('Notice Retention (Worker)', 'accountNoticeRetentionWorker')}
          {renderRow('Notice Retention (Contractor)', 'accountNoticeRetentionContractor')}
        </div>
      </div>
    </div>
  );
}
