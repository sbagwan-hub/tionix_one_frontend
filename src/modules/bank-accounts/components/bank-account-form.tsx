'use client';

import * as React from 'react';
import { Info, Eye, PlusCircle, Settings2, FolderOpen, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AcctGroup } from '../../account-groups/types';
import { BankAccount, HolderDetail } from '../types';

interface BankAccountFormProps {
  bankName: string;
  setBankName: (val: string) => void;
  accountNo: string;
  setAccountNo: (val: string) => void;
  rtgsNeftIfsc: string;
  setRtgsNeftIfsc: (val: string) => void;
  accountType: string;
  setAccountType: (val: string) => void;
  accountCode: string;
  setAccountCode: (val: string) => void;
  bankAccountName: string;
  setBankAccountName: (val: string) => void;
  selectedGroup: AcctGroup | null;
  setSelectedGroup: (val: AcctGroup | null) => void;
  openingBalance: number;
  setOpeningBalance: (val: number) => void;
  openingBalanceSec: number;
  setOpeningBalanceSec: (val: number) => void;
  gstNo: string;
  setGstNo: (val: string) => void;
  holderDetails: HolderDetail[];
  setHolderDetails: (val: HolderDetail[]) => void;
  nominee: string;
  setNominee: (val: string) => void;

  isEditing: boolean;
  mode: 'view' | 'add' | 'edit';
  selectedId: number | string | null;
  isSysDefined: boolean;
  records: BankAccount[];
  cursor: number;
  formInputRef: React.RefObject<HTMLInputElement | null>;
  employees: Array<{ pk_emp_id: number; employee: string }>;
}

export function BankAccountForm({
  bankName,
  setBankName,
  accountNo,
  setAccountNo,
  rtgsNeftIfsc,
  setRtgsNeftIfsc,
  accountType,
  setAccountType,
  accountCode,
  setAccountCode,
  bankAccountName,
  setBankAccountName,
  selectedGroup,
  setSelectedGroup,
  openingBalance,
  setOpeningBalance,
  openingBalanceSec,
  setOpeningBalanceSec,
  gstNo,
  setGstNo,
  holderDetails,
  setHolderDetails,
  nominee,
  setNominee,

  isEditing,
  mode,
  selectedId,
  isSysDefined,
  records,
  cursor,
  formInputRef,
  employees,
}: BankAccountFormProps) {
  
  const handleHolderChange = (index: number, field: keyof HolderDetail, value: string) => {
    const updated = [...holderDetails];
    updated[index] = { ...updated[index], [field]: value };
    setHolderDetails(updated);
  };

  const bankOptions = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
  ];

  const accountTypeOptions = [
    'Current Account',
    'Savings Account',
    'Cash Credit',
    'Overdraft',
  ];

  return (
    <div className="from-card to-card/70 border-border/60 relative flex h-full min-h-0 flex-col rounded-xl border bg-gradient-to-b p-5 transition-all duration-300 md:col-span-7 md:overflow-y-auto">
      {/* Dynamic Status Badges */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-foreground text-[10px] font-bold tracking-widest uppercase">
          Bank Account Form
        </span>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-2xs transition-all duration-300 select-none ${
            !isEditing
              ? 'border-blue-500/10 bg-blue-500/5 text-blue-600 dark:text-blue-400'
              : mode === 'add'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}
        >
          {!isEditing ? (
            <>
              <Eye className="h-3 w-3" />
              <span>Read-Only Mode</span>
            </>
          ) : mode === 'add' ? (
            <>
              <PlusCircle className="h-3 w-3 animate-pulse" />
              <span>Add Mode</span>
            </>
          ) : (
            <>
              <Settings2 className="h-3 w-3" />
              <span>Edit Mode</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Row 1: Bank Name & Account No. */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Bank Name {isEditing && <span className="text-destructive">*</span>}
            </Label>
            {isEditing ? (
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger className="border-border/85 bg-background/50 h-9 text-xs">
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankOptions.map((b) => (
                    <SelectItem key={b} value={b} className="text-xs">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={bankName} disabled className="h-9 text-xs" />
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Account No. {isEditing && <span className="text-destructive">*</span>}
            </Label>
            <Input
              ref={formInputRef}
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter Account Number"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 2: RTGS/NEFT/IFSC & Account Type */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">RTGS/NEFT/IFSC</Label>
            <Input
              value={rtgsNeftIfsc}
              onChange={(e) => setRtgsNeftIfsc(e.target.value.toUpperCase())}
              disabled={!isEditing}
              placeholder="e.g. SBIN0001234"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Account Type {isEditing && <span className="text-destructive">*</span>}
            </Label>
            {isEditing ? (
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="border-border/85 bg-background/50 h-9 text-xs">
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypeOptions.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={accountType} disabled className="h-9 text-xs" />
            )}
          </div>
        </div>

        {/* Row 3: Account Code & Bank Account Name */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Account Code {isEditing && <span className="text-destructive">*</span>}
            </Label>
            <Input
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter Account Code"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Bank Account {isEditing && <span className="text-destructive">*</span>}
            </Label>
            <Input
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter Bank Account Display Name"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 4: Group & GST No. */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Group {isEditing && <span className="text-destructive">*</span>}
            </Label>
            <div className="group relative">
              <FolderOpen className="text-foreground/50 group-focus-within:text-primary absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
              <Input
                value={selectedGroup ? selectedGroup.group_name : ''}
                disabled
                placeholder={isEditing ? 'Select a group from tree on right...' : 'Root Context'}
                className="bg-muted/30 text-foreground h-9 pl-9 text-xs font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              GST No. {isEditing && <span className="text-destructive">*</span>}
            </Label>
            <Input
              value={gstNo}
              onChange={(e) => setGstNo(e.target.value.toUpperCase())}
              disabled={!isEditing}
              placeholder="Enter GST Number"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Row 5: Opening Balances */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">Opening Balance</Label>
            <Input
              type="number"
              step="0.01"
              value={openingBalance || ''}
              onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              placeholder="0.00"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-xs font-semibold">
              Opening Balance (Secondary Currency)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={openingBalanceSec || ''}
              onChange={(e) => setOpeningBalanceSec(parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              placeholder="0.00"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Holder Details Grid (Rows 1 to 4) */}
        <div className="border-border/60 bg-muted/10 rounded-lg border p-4 space-y-3">
          <span className="text-foreground/80 block text-xs font-bold tracking-wider uppercase">
            Holder Details
          </span>
          <div className="space-y-2.5">
            {holderDetails.map((holder, idx) => (
              <div key={holder.id} className="grid grid-cols-12 gap-3.5 items-center">
                <span className="col-span-1 text-xs text-muted-foreground font-semibold text-center">
                  {idx + 1}
                </span>

                <div className="col-span-6">
                  {isEditing ? (
                    <Select
                      value={holder.name}
                      onValueChange={(val) => handleHolderChange(idx, 'name', val)}
                    >
                      <SelectTrigger className="bg-background h-8.5 text-xs">
                        <SelectValue placeholder="Select Holder Name" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem
                            key={emp.pk_emp_id}
                            value={emp.employee}
                            className="text-xs"
                          >
                            {emp.employee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={holder.name} disabled className="h-8.5 text-xs" />
                  )}
                </div>

                <div className="col-span-5">
                  <Input
                    value={holder.client_id}
                    onChange={(e) => handleHolderChange(idx, 'client_id', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Client ID"
                    className="h-8.5 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nominee Field */}
        <div className="space-y-1.5">
          <Label className="text-foreground/80 text-xs font-semibold">Nominee</Label>
          <Input
            value={nominee}
            onChange={(e) => setNominee(e.target.value)}
            disabled={!isEditing}
            placeholder="Enter Nominee Name"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {isEditing && !selectedGroup && (
        <div className="bg-muted/20 border-border/30 text-foreground/90 mt-4 flex items-start gap-2 rounded-md border p-2 text-[11px] leading-normal">
          <Info className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {`Please select an Account Group from the hierarchy tree on the right to place this bank account.`}
          </span>
        </div>
      )}
    </div>
  );
}
