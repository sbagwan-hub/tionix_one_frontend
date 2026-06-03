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
import { UserListItem } from '@/lib/api';

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
    <div className="border-border bg-card mb-2 rounded-md border p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* User Dropdown Selection */}
        <div className="space-y-2">
          <Label
            htmlFor="user-profile"
            className="text-foreground block text-[11px] font-bold tracking-widest uppercase"
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
              className={cn(
                'border-input bg-background text-foreground w-full rounded-md border px-3 py-1.5 text-sm font-medium transition-all outline-none',
                'focus:border-ring focus:ring-ring focus:ring-1',
              )}
            >
              <SelectValue placeholder="Choose a user profile..." />
            </SelectTrigger>

            <SelectContent
              position="popper"
              side="bottom"
              sideOffset={4}
              className="border-border bg-popover text-popover-foreground max-h-60 min-w-[var(--radix-select-trigger-width)] rounded-md border p-1"
            >
              {users.map((user) => (
                <SelectItem
                  key={user.pk_user_id}
                  value={user.pk_user_id.toString()}
                  className="cursor-pointer rounded-sm px-2.5 py-2 text-xs font-medium"
                >
                  {user.username} {user.sys_defined ? '(System)' : ''}
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
          <span className="text-foreground text-[11px] font-bold tracking-widest uppercase">
            Data Access Scope
          </span>

          <RadioGroup
            value={accessScope}
            onValueChange={handleScopeChange}
            disabled={isInteractionDisabled}
            className="flex flex-wrap items-center gap-4 py-1.5"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="all-records" />
              <Label
                htmlFor="all-records"
                className={cn(
                  'text-sm font-medium',
                  isInteractionDisabled
                    ? 'text-foreground cursor-not-allowed'
                    : 'text-foreground cursor-pointer',
                )}
              >
                All Records
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="self" id="self-records" />
              <Label
                htmlFor="self-records"
                className={cn(
                  'text-sm font-medium',
                  isInteractionDisabled
                    ? 'text-foreground cursor-not-allowed'
                    : 'text-foreground cursor-pointer',
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
              'border-border bg-background flex items-start gap-3 rounded-md border px-3 py-2.5 transition-all',
              isInteractionDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-input cursor-pointer',
            )}
          >
            <Checkbox
              id="modify-other-users"
              checked={otherRecords}
              onCheckedChange={(checked) =>
                !isInteractionDisabled && setOtherRecords(Boolean(checked))
              }
              disabled={isInteractionDisabled}
              className="mt-0.5"
            />

            <div className="flex flex-col space-y-0.5 select-none">
              <span
                className={cn(
                  'text-sm leading-none font-semibold',
                  isInteractionDisabled ? 'text-foreground' : 'text-foreground',
                )}
              >
                Modify Other User Records
              </span>
              <span className="text-foreground text-[11px] leading-normal">
                Allows global management rights
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
