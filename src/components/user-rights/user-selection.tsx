'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface UserSelectionProps {
  accessScope: string;
  setAccessScope: (value: string) => void;
}

const userOptions = [
  { label: 'John Doe (Administrator)', value: '1' },
  { label: 'Jane Smith (Manager)', value: '2' },
  { label: 'Alex Rivera (Fin Operations)', value: '3' },
];

export default function UserSelection({ accessScope, setAccessScope }: UserSelectionProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [modifyOtherUsers, setModifyOtherUsers] = useState(false);

  return (
    <div className="border-border bg-card ring-border/50 dark:border-input/60 dark:bg-card mb-2 overflow-hidden rounded-sm border p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <Label
            htmlFor="user-profile"
            className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Select User <span className="text-destructive">*</span>
          </Label>

          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger
              id="user-profile"
              className="border-input bg-input text-foreground focus:border-ring focus:ring-ring/50 dark:bg-input/40 dark:text-foreground w-full cursor-alias rounded-sm border px-3 py-1.5 text-sm font-medium transition outline-none"
            >
              <SelectValue placeholder="Choose a user profile..." />
            </SelectTrigger>

            <SelectContent
              className="border-border bg-popover border p-0"
              position="popper"
              side="bottom"
            >
              {userOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-accent focus:bg-brand/50 cursor-pointer px-2.5 py-2.5 text-xs transition-colors hover:text-white focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <span className="text-muted-foreground mb-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase">
            Data Access Scope
          </span>

          <RadioGroup
            value={accessScope}
            onValueChange={(value) => setAccessScope(value)}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="all-records" />
              <Label
                htmlFor="all-records"
                className="text-foreground cursor-pointer text-sm font-medium"
              >
                All Records
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="self" id="self-records" />
              <Label
                htmlFor="self-records"
                className="text-foreground cursor-pointer text-sm font-medium"
              >
                Self Records Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="self-start md:self-end">
          <div className="border-border hover:border-ring dark:border-input/60 dark:bg-muted/20 flex cursor-pointer items-center gap-3 rounded-sm border bg-white px-3 py-2 transition">
            <Checkbox
              id="modify-other-users"
              checked={modifyOtherUsers}
              onCheckedChange={(checked) => setModifyOtherUsers(Boolean(checked))}
              className="h-4 w-4 rounded-xs border border-gray-400"
            />

            <div className="flex flex-col">
              <Label htmlFor="modify-other-users" className="text-foreground text-sm font-semibold">
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
