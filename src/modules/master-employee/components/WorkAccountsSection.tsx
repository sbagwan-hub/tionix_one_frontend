'use client';

import * as React from 'react';
import { FormInput } from '@/components/common/form-input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { EmployeeRecord, ContactDetail } from '../types';
import { DatePicker } from '@/components/common/date-picker';

interface SectionProps {
  formData: Partial<EmployeeRecord>;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const WorkAccountsSection: React.FC<SectionProps> = ({
  formData,
  onInputChange,
  disabled = false,
}) => {
  const contacts = formData.contacts || [];

  const handleAddContact = () => {
    const newContact: ContactDetail = {
      id: Date.now().toString(),
      type: 'Phone',
      detail: '',
    };
    onInputChange('contacts', [...contacts, newContact]);
  };

  const handleUpdateContact = (id: string, field: string, value: string) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onInputChange('contacts', updated);
  };

  const handleRemoveContact = (id: string) => {
    const filtered = contacts.filter((c) => c.id !== id);
    onInputChange('contacts', filtered);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <h3 className="text-brand border-border/20 border-b pb-1.5 text-sm font-bold tracking-wider uppercase">
        Work & Account Details
      </h3>
      <div className="flex flex-1 flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Joining Date *"
            value={formData.doj ? formData.doj.slice(0, 10) : ''}
            onChange={(val) => onInputChange('doj', val)}
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Cash Account
            </Label>
            <Select
              value={formData.fk_acct_id ? String(formData.fk_acct_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_acct_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 w-full rounded-sm text-sm">
                <SelectValue placeholder="Cash Ledger" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1">Cash Account (Main)</SelectItem>
                <SelectItem value="2">Petty Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="UAN / PF No."
            value={formData.pf_no || ''}
            onChange={(e) => onInputChange('pf_no', e.target.value)}
            placeholder="UAN Registration"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
          <FormInput
            label="ESIC No."
            value={formData.esic_no || ''}
            onChange={(e) => onInputChange('esic_no', e.target.value)}
            placeholder="ESIC ID"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="PAN No."
            value={formData.pan_no || ''}
            onChange={(e) => onInputChange('pan_no', e.target.value.toUpperCase())}
            placeholder="PAN Card ID"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
            maxLength={10}
          />
          <FormInput
            label="Short Address"
            value={formData.s_address || ''}
            onChange={(e) => onInputChange('s_address', e.target.value)}
            placeholder="Short address label"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Bank Name
            </Label>
            <Select
              value={formData.fk_bnk_id ? String(formData.fk_bnk_id) : 'none'}
              onValueChange={(val) =>
                onInputChange('fk_bnk_id', val === 'none' ? null : parseInt(val, 10))
              }
              disabled={disabled}
            >
              <SelectTrigger className="bg-background/50 h-9 w-full rounded-sm text-sm">
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1">State Bank of India</SelectItem>
                <SelectItem value="2">HDFC Bank</SelectItem>
                <SelectItem value="3">ICICI Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 flex flex-col justify-end gap-1.5 pb-1">
            <label className="text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase">
              <Checkbox
                checked={formData.sb || false}
                onCheckedChange={(val) => onInputChange('sb', !!val)}
                disabled={disabled}
              />
              Same Bank
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Account No."
            value={formData.account_no || ''}
            onChange={(e) => onInputChange('account_no', e.target.value)}
            placeholder="Bank Account"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
          <FormInput
            label="RTGS/NEFT/IFSC"
            value={formData.rtgs || ''}
            onChange={(e) => onInputChange('rtgs', e.target.value)}
            placeholder="IFSC Code"
            className="h-9 rounded-sm text-sm"
            disabled={disabled}
          />
        </div>

        {/* Additional Contacts - expands to take remaining space */}
        <div className="mt-1 flex min-h-[160px] flex-1 flex-col gap-2.5">
          <div className="border-border/10 flex items-center justify-between border-b pb-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Contacts Detail
            </Label>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-sm"
              onClick={handleAddContact}
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex max-h-[260px] flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-2">
                <Select
                  value={contact.type}
                  onValueChange={(val) => handleUpdateContact(contact.id, 'type', val)}
                  disabled={disabled}
                >
                  <SelectTrigger className="bg-background/50 h-9 w-28 rounded-sm text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Fax">Fax</SelectItem>
                    <SelectItem value="E-Mail">E-Mail</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={contact.detail}
                  onChange={(e) => handleUpdateContact(contact.id, 'detail', e.target.value)}
                  placeholder="Contact detail"
                  className="h-9 flex-1 rounded-sm text-sm"
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-9 w-9 rounded-sm"
                  onClick={() => handleRemoveContact(contact.id)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="text-muted-foreground border-border/40 bg-muted/5 flex flex-1 items-center justify-center rounded-sm border border-dashed py-4 text-center text-xs">
                {`No contact detail recorded. Click '+' to insert.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
