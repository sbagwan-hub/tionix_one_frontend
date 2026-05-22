'use client';

import { Search } from 'lucide-react';

interface UserSelectionProps {
  accessScope: string;
  setAccessScope: (value: string) => void;
}

export default function UserSelection({ accessScope, setAccessScope }: UserSelectionProps) {
  return (
    <div className="border-border bg-card ring-border/50 dark:border-input/60 dark:bg-card mb-2 overflow-hidden rounded-sm border p-4 ring-1 ring-inset">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-[0.18em] uppercase">
            Select User <span className="text-destructive">*</span>
          </label>

          <div className="relative">
            <select className="border-input bg-input text-foreground focus:border-ring focus:ring-ring/50 dark:bg-input/40 dark:text-foreground w-full appearance-none rounded-sm border px-3 py-1.5 text-sm font-medium transition outline-none">
              <option value="">Choose a user profile...</option>
              <option value="1">John Doe (Administrator)</option>
              <option value="2">Jane Smith (Manager)</option>
              <option value="3">Alex Rivera (Fin Operations)</option>
            </select>

            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <Search size={14} />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-muted-foreground mb-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase">
            Data Access Scope
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-foreground flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                name="access"
                checked={accessScope === 'all'}
                onChange={() => setAccessScope('all')}
                className="border-input text-primary focus:ring-primary/50 h-4 w-4"
              />
              All Records
            </label>

            <label className="text-foreground flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                name="access"
                checked={accessScope === 'self'}
                onChange={() => setAccessScope('self')}
                className="border-input text-primary focus:ring-primary/50 h-4 w-4"
              />
              Self Records Only
            </label>
          </div>
        </div>

        <div className="self-start md:self-end">
          <label className="border-border bg-muted/50 hover:border-ring dark:border-input/60 dark:bg-muted/20 flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2 transition">
            <input
              type="checkbox"
              className="border-input text-primary focus:ring-primary/50 h-4 w-4 rounded"
            />

            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">
                Modify Other User Records
              </span>

              <span className="text-muted-foreground text-[11px]">
                Allows global management rights
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
