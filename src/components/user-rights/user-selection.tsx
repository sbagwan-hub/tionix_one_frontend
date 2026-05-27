'use client';

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
  editable: boolean;
}

export default function UserSelection({
  users,
  selectedUser,
  onSelectUser,
  ownRecords,
  setOwnRecords,
  otherRecords,
  setOtherRecords,
  editable,
}: UserSelectionProps) {
  // Map ownRecords (boolean) to accessScope ("self" or "all")
  const accessScope = ownRecords ? 'self' : 'all';

  const handleScopeChange = (value: string) => {
    setOwnRecords(value === 'self');
  };

  const handleUserChange = (valStr: string) => {
    const userId = parseInt(valStr);
    const user = users.find((u) => u.pkUserId === userId) || null;
    onSelectUser(user);
  };

  return (
    <div className="border-border bg-card ring-border/50 dark:border-input/60 dark:bg-card mb-2 overflow-hidden rounded-sm border p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* User Dropdown Selection */}
        <div>
          <Label
            htmlFor="user-profile"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Select User <span className="text-destructive">*</span>
          </Label>

          <Select
            value={selectedUser?.pkUserId?.toString() ?? ''}
            onValueChange={handleUserChange}
            disabled={editable}
          >
            <SelectTrigger
              id="user-profile"
              className="border-input bg-input text-foreground focus:border-ring focus:ring-ring/50 dark:bg-input/40 dark:text-foreground w-full rounded-sm border px-3 py-1.5 text-sm font-medium transition outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SelectValue placeholder="Choose a user profile..." />
            </SelectTrigger>

            <SelectContent
              className="border-border bg-popover max-h-60 overflow-y-auto border p-0"
              position="popper"
              side="bottom"
            >
              {users?.map((user) => (
                <SelectItem
                  key={user.pkUserId}
                  value={user.pkUserId.toString()}
                  className="hover:bg-accent focus:bg-brand/50 cursor-pointer px-2.5 py-2.5 text-xs transition-colors hover:text-white focus:text-white"
                >
                  {user.UserName} {user.SysDefined ? '(System)' : ''}
                </SelectItem>
              ))}
              {users?.length === 0 && (
                <div className="text-muted-foreground p-2 text-center text-xs">No users found</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Data Access Scope */}
        <div className="flex flex-col">
          <span className="text-muted-foreground mb-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase">
            Data Access Scope
          </span>

          <RadioGroup
            value={accessScope}
            onValueChange={handleScopeChange}
            disabled={!editable || !selectedUser}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="all-records" disabled={!editable || !selectedUser} />
              <Label
                htmlFor="all-records"
                className={`text-sm font-medium ${editable && selectedUser ? 'text-foreground cursor-pointer' : 'text-muted-foreground cursor-not-allowed'}`}
              >
                All Records
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="self"
                id="self-records"
                disabled={!editable || !selectedUser}
              />
              <Label
                htmlFor="self-records"
                className={`text-sm font-medium ${editable && selectedUser ? 'text-foreground cursor-pointer' : 'text-muted-foreground cursor-not-allowed'}`}
              >
                Self Records Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Modify Other User Records Option */}
        <div className="self-start md:self-end">
          <div
            className={`border-border dark:bg-muted/20 flex items-center gap-3 rounded-sm border bg-white px-3 py-2 transition ${
              editable && selectedUser
                ? 'hover:border-ring cursor-pointer'
                : 'cursor-not-allowed opacity-50'
            }`}
          >
            <Checkbox
              id="modify-other-users"
              checked={otherRecords}
              onCheckedChange={(checked) =>
                editable && selectedUser && setOtherRecords(Boolean(checked))
              }
              disabled={!editable || !selectedUser}
              className="h-4 w-4 rounded-xs border border-gray-400 disabled:cursor-not-allowed"
            />

            <div className="flex flex-col">
              <Label
                htmlFor="modify-other-users"
                className={`text-sm font-semibold ${editable && selectedUser ? 'text-foreground cursor-pointer' : 'text-muted-foreground cursor-not-allowed'}`}
              >
                Modify Other User Records
              </Label>

              <span className="text-muted-foreground text-[11px]">
                Allows global management rights
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
