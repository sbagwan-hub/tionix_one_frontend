'use client';

import * as React from 'react';
import { Circle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AcctGroup } from '../types';

interface AccountGroupFormProps {
  groupName: string;
  setGroupName: (name: string) => void;
  selectedParent: AcctGroup | null;
  setSelectedParent: (parent: AcctGroup | null) => void;
  parents: AcctGroup[];
  isEditing: boolean;
  mode: 'view' | 'add' | 'edit';
  selectedId: number | null;
  isSysDefined: boolean;
  records: AcctGroup[];
  cursor: number;
  groupInputRef: React.RefObject<HTMLInputElement | null>;
}

export function AccountGroupForm({
  groupName,
  setGroupName,
  selectedParent,
  setSelectedParent,
  parents,
  isEditing,
  mode,
  selectedId,
  isSysDefined,
  records,
  cursor,
  groupInputRef,
}: AccountGroupFormProps) {
  return (
    <div className="flex flex-col gap-4 p-5 md:col-span-5">
      {isEditing && (
        <div
          className={`text-xxs inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-0.5 font-medium ${
            mode === 'add'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          <Circle className="h-2 w-2 animate-pulse fill-current" />
          {mode === 'add' ? 'Add Mode' : 'Edit Mode'}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="group_name" className="text-xs font-semibold">
          Group Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="group_name"
          ref={groupInputRef}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          disabled={!isEditing || !selectedParent}
          maxLength={40}
          placeholder={
            isEditing
              ? selectedParent
                ? 'Enter unique group name…'
                : 'Select parent from tree first…'
              : ''
          }
          autoComplete="off"
          className="bg-background/50 focus:bg-background focus:ring-ring h-8 text-xs focus:ring-1"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="parent_group" className="text-xs font-semibold">
          Parent Group <span className="text-destructive">*</span>
        </Label>
        {isEditing ? (
          <select
            id="parent_group"
            value={selectedParent ? selectedParent.pk_grp_id : ''}
            disabled
            className="border-input bg-muted focus-visible:ring-ring text-muted-foreground h-8 cursor-not-allowed rounded-md border px-3 py-1 text-xs shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
          >
            <option value="">-- Click Tree to Select --</option>
            {/* Merged unique parent lists */}
            {Array.from(new Map([...parents, ...records].map((x) => [x.pk_grp_id, x])).values())
              .filter((p) => p.pk_grp_id !== selectedId) // Prevent selecting self as parent
              .map((p) => (
                <option key={p.pk_grp_id} value={p.pk_grp_id}>
                  {p.group_name}
                </option>
              ))}
          </select>
        ) : (
          <Input
            id="parent_group"
            value={selectedParent ? selectedParent.group_name : ''}
            disabled
            placeholder=""
            autoComplete="off"
            className="bg-muted text-muted-foreground h-8 text-xs"
          />
        )}
        {isEditing && (
          <span className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
            <Info className="text-primary h-3 w-3" />
            Click a node in the tree hierarchy to assign the parent.
          </span>
        )}
      </div>

      {/* Readonly Inherited Fields Info */}
      {selectedParent && isEditing && (
        <div className="bg-muted/30 mt-2 flex flex-col gap-2 rounded border p-3">
          <span className="text-muted-foreground border-b pb-1 text-[11px] font-bold tracking-wider uppercase">
            Inherited Properties
          </span>
          <div className="text-xxs grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground block font-medium">Debit/Credit:</span>
              <span className="text-primary font-bold">{selectedParent.dc}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Group Prefix:</span>
              <span className="text-primary font-bold">{selectedParent.prefix}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-medium">Grouping Code:</span>
              <span className="text-primary font-bold">{selectedParent.grouping}</span>
            </div>
          </div>
        </div>
      )}

      {selectedId && !isEditing && (
        <div className="bg-muted/40 text-xxs mt-auto flex items-start gap-2.5 rounded border p-3">
          <Info className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div className="text-muted-foreground flex-1 space-y-0.5">
            <p>
              Group ID: <strong className="text-foreground">{selectedId}</strong>
            </p>
            <p>
              Defined Type:{' '}
              <strong className="text-foreground">
                {isSysDefined ? 'System Defined (Read Only)' : 'User Defined'}
              </strong>
            </p>
            {records[cursor]?.user_name && (
              <p>
                Created By: <strong className="text-foreground">{records[cursor].user_name}</strong>
              </p>
            )}
            {records[cursor]?.date_time_stamp && (
              <p>
                Last Audit:{' '}
                <strong className="text-foreground">
                  {new Date(records[cursor].date_time_stamp).toLocaleString()}
                </strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
