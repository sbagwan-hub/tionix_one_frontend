'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserListItem } from '../types';

interface UserSelectionProps {
  users: UserListItem[];
  selectedUser: UserListItem | null;
  onSelectUser: (user: UserListItem | null) => void;
  ownRecords: boolean;
  setOwnRecords: (val: boolean) => void;
  otherRecords: boolean;
  setOtherRecords: (val: boolean) => void;
  editable: boolean; // true if form fields can be changed
}

export default function UserSelection({
  users = [],
  selectedUser,
  onSelectUser,
  ownRecords,
  setOwnRecords,
  otherRecords,
  setOtherRecords,
  editable,
}: UserSelectionProps) {
  const accessScope = ownRecords ? 'self' : 'all';
  const isInteractionDisabled = !editable || !selectedUser;

  const handleScopeChange = (value: string) => {
    setOwnRecords(value === 'self');
  };

  const handleUserChange = (valStr: string) => {
    const userId = parseInt(valStr, 10);
    const user = users.find((u) => u.pk_user_id === userId) || null;
    onSelectUser(user);
  };

  return (
    <div className="border-border/60 bg-muted/40 mb-3 rounded-md border p-4 shadow-none dark:bg-zinc-950/40">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* User Dropdown Selection */}
        <div className="space-y-1.5">
          <Label
            htmlFor="user-profile"
            className="text-foreground block text-xs font-medium tracking-tight"
          >
            Select User <span className="text-destructive">*</span>
          </Label>

          <Select
            value={selectedUser?.pk_user_id?.toString() ?? ''}
            onValueChange={handleUserChange}
            disabled={editable}
          >
            <SelectTrigger
              id="user-profile"
              className="border-border bg-background text-foreground focus:border-ring focus:ring-ring h-8 w-full rounded-md border px-3 text-xs font-medium shadow-none transition-all outline-none focus:ring-1"
            >
              <SelectValue placeholder="Choose a user profile..." />
            </SelectTrigger>

            <SelectContent
              position="popper"
              side="bottom"
              sideOffset={4}
              className="border-border bg-popover text-popover-foreground max-h-60 min-w-[var(--radix-select-trigger-width)] rounded-md border p-1 shadow-none"
            >
              {users.map((user) => (
                <SelectItem
                  key={user.pk_user_id}
                  value={user.pk_user_id.toString()}
                  className="cursor-pointer rounded-sm px-2 py-1.5 text-xs font-medium tracking-tight"
                >
                  <span className="flex items-center gap-1">
                    {user.username}
                    {user.sys_defined && (
                      <span className="bg-primary/10 text-primary ml-2 rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase select-none dark:bg-amber-950 dark:text-amber-300">
                        sys
                      </span>
                    )}
                  </span>
                </SelectItem>
              ))}
              {users.length === 0 && (
                <div className="text-foreground py-6 text-center text-xs">No users found</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Data Access Scope */}
        <div className="flex flex-col space-y-2">
          <span className="text-foreground text-xs font-medium tracking-tight">
            Data Access Scope
          </span>

          <RadioGroup
            value={accessScope}
            onValueChange={handleScopeChange}
            disabled={isInteractionDisabled}
            className="flex h-8 flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="all-records" className="border-border h-4 w-4" />
              <Label
                htmlFor="all-records"
                className={cn(
                  'text-foreground text-xs font-medium tracking-tight select-none',
                  isInteractionDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
              >
                All Records
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="self" id="self-records" className="border-border h-4 w-4" />
              <Label
                htmlFor="self-records"
                className={cn(
                  'text-foreground text-xs font-medium tracking-tight select-none',
                  isInteractionDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
              >
                Self Records Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Modify Other User Records Option */}
        <div className="self-start md:self-end">
          <label
            htmlFor="modify-other-users"
            className={cn(
              'border-border bg-background flex h-14 w-full items-start gap-3 rounded-md border px-3 py-2 transition-colors select-none',
              isInteractionDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-muted/30 cursor-pointer',
            )}
          >
            <Checkbox
              id="modify-other-users"
              checked={otherRecords}
              onCheckedChange={(checked) =>
                !isInteractionDisabled && setOtherRecords(Boolean(checked))
              }
              disabled={isInteractionDisabled}
              className="border-border data-[state=checked]:border-primary mt-0.5 h-4 w-4 rounded-sm"
            />

            <div className="flex flex-col space-y-0.5">
              <span className="text-foreground text-xs font-medium tracking-tight">
                Modify Other User Records
              </span>
              <span className="text-foreground text-[11px] leading-normal tracking-tight">
                Allows global management rights
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
