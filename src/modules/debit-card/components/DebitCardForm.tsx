'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormInput } from '@/components/common/form-input';
import { DebitCardDto } from '../types';

interface DebitCardFormProps {
  form: UseFormReturn<any>;
  is_editing: boolean;
  bank_accounts: any[];
  employees: any[];
  card_input_ref: React.RefObject<HTMLInputElement | null>;
}

export const DebitCardForm: React.FC<DebitCardFormProps> = ({
  form,
  is_editing,
  bank_accounts,
  employees,
  card_input_ref,
}) => {
  return (
    <div className="bg-card/30 border-border/40 flex h-full flex-col items-center justify-center rounded-lg border p-6 backdrop-blur-md">
      <form className="flex w-full max-w-xl flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* Bank Account Dropdown */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Bank Account *
          </Label>
          <div className="col-span-9">
            {is_editing ? (
              <Select
                value={form.watch('fk_ban_id') ? String(form.watch('fk_ban_id')) : ''}
                onValueChange={(val) => form.setValue('fk_ban_id', val, { shouldDirty: true })}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 text-xs">
                  <SelectValue placeholder="Select Bank Account" />
                </SelectTrigger>
                <SelectContent>
                  {bank_accounts.map((b) => (
                    <SelectItem key={b.pk_ban_id} value={String(b.pk_ban_id)} className="text-xs">
                      {b.bank_account_name} ({b.account_no})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={
                  bank_accounts.find((b) => String(b.pk_ban_id) === String(form.watch('fk_ban_id')))?.[
                    'bank_account_name'
                  ] || ''
                }
                disabled
                className="h-9 text-xs"
              />
            )}
          </div>
        </div>

        {/* Debit Card No */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Debit Card No *
          </Label>
          <div className="col-span-9">
            <FormInput
              id="card-no"
              placeholder="Enter Debit Card Number"
              disabled={!is_editing}
              {...form.register('card_no')}
              ref={(e) => {
                form.register('card_no').ref(e);
                (card_input_ref as any).current = e;
              }}
              className="h-9 text-xs"
            />
            {form.formState.errors.card_no && (
              <p className="text-destructive mt-1 text-xxs font-medium">
                {form.formState.errors.card_no.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Holder's Name */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Holder's Name *
          </Label>
          <div className="col-span-9">
            {is_editing ? (
              <Select
                value={form.watch('holder_name') || ''}
                onValueChange={(val) => form.setValue('holder_name', val, { shouldDirty: true })}
              >
                <SelectTrigger className="border-border/85 bg-background/50 h-9 text-xs">
                  <SelectValue placeholder="Select Holder" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.pk_emp_id} value={e.employee} className="text-xs">
                      {e.employee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={form.watch('holder_name') || ''} disabled className="h-9 text-xs" />
            )}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Expiry Date *
          </Label>
          <div className="col-span-9">
            <Input
              type="date"
              disabled={!is_editing}
              {...form.register('expiry_date')}
              className="border-border/60 h-9 w-full text-xs"
            />
            {form.formState.errors.expiry_date && (
              <p className="text-destructive mt-1 text-xxs font-medium">
                {form.formState.errors.expiry_date.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
