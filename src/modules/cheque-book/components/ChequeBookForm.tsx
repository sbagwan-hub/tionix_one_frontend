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

interface ChequeBookFormProps {
  form: UseFormReturn<any>;
  is_editing: boolean;
  bank_accounts: any[];
  start_no_input_ref: React.RefObject<HTMLInputElement | null>;
}

export const ChequeBookForm: React.FC<ChequeBookFormProps> = ({
  form,
  is_editing,
  bank_accounts,
  start_no_input_ref,
}) => {
  return (
    <div className="bg-card/30 border-border/40 flex h-full flex-col items-center justify-center rounded-lg border p-6 backdrop-blur-md">
      <form className="flex w-full max-w-xl flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* Bank Account */}
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

        {/* Starting Cheque No */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Starting Cheque No *
          </Label>
          <div className="col-span-9">
            <FormInput
              id="start-no"
              type="number"
              placeholder="Enter starting number"
              disabled={!is_editing}
              {...form.register('start_no')}
              ref={(e) => {
                form.register('start_no').ref(e);
                (start_no_input_ref as any).current = e;
              }}
              className="h-9 text-xs"
            />
            {form.formState.errors.start_no && (
              <p className="text-destructive mt-1 text-xxs font-medium">
                {form.formState.errors.start_no.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Ending Cheque No */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Ending Cheque No *
          </Label>
          <div className="col-span-9">
            <FormInput
              id="end-no"
              type="number"
              placeholder="Enter ending number"
              disabled={!is_editing}
              {...form.register('end_no')}
              className="h-9 text-xs"
            />
            {form.formState.errors.end_no && (
              <p className="text-destructive mt-1 text-xxs font-medium">
                {form.formState.errors.end_no.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Total Cheques */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Total Cheques
          </Label>
          <div className="col-span-9">
            <Input
              type="number"
              readOnly
              {...form.register('total_cheques')}
              className="bg-muted/50 border-border/40 h-9 font-mono text-xs font-bold"
            />
          </div>
        </div>

        {/* Date of Issue */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="text-muted-foreground col-span-3 text-xs font-medium tracking-wider uppercase">
            Date of Issue
          </Label>
          <div className="col-span-9">
            <Input
              type="date"
              disabled={!is_editing}
              {...form.register('date_issue')}
              className="border-border/60 h-9 w-full text-xs"
            />
            {form.formState.errors.date_issue && (
              <p className="text-destructive mt-1 text-xxs font-medium">
                {form.formState.errors.date_issue.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
