'use client';

import * as React from 'react';
import {
  Circle,
  Info,
  Layers,
  KeyRound,
  ShieldAlert,
  Clock,
  User,
  Eye,
  PlusCircle,
  Settings2,
  FolderOpen,
} from 'lucide-react';
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
  const currentRecord = records[cursor];

  return (
    <div className="from-card to-card/70 border-border/60 shadow-foreground/[0.02] relative flex h-full min-h-[480px] flex-col rounded-xl border bg-gradient-to-b p-6 shadow-md transition-all duration-300 md:col-span-5">
      {/* Dynamic Status Badges */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          Form Inspector
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

      <div className="mt-2 space-y-4">
        {/* Field: Group Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="group_name"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            Group Name {isEditing && <span className="text-destructive font-bold">*</span>}
          </Label>
          <div className="relative">
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
                  : 'No account group highlighted'
              }
              autoComplete="off"
              className="border-border/80 bg-background/40 focus:bg-background shadow-3xs focus-visible:ring-primary/40 disabled:bg-muted/30 h-9.5 text-xs transition-all duration-200 focus-visible:ring-1 disabled:opacity-65"
            />
          </div>
        </div>

        {/* Field: Parent Group */}
        <div className="space-y-1.5">
          <Label
            htmlFor="parent_group"
            className="text-foreground/80 flex items-center gap-1 text-xs font-semibold tracking-wide"
          >
            Parent Group {isEditing && <span className="text-destructive font-bold">*</span>}
          </Label>

          <div className="group relative">
            <FolderOpen className="text-muted-foreground/50 group-focus-within:text-primary absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
            <Input
              id="parent_group"
              value={selectedParent ? selectedParent.group_name : ''}
              disabled
              placeholder={isEditing ? 'Choose parent from hierarchy tree...' : 'Root Context'}
              className={`border-border/50 bg-muted/30 text-muted-foreground h-9.5 cursor-not-allowed pl-9 text-xs font-medium transition-all duration-200 select-none ${
                isEditing && !selectedParent
                  ? 'border-amber-500/30 bg-amber-500/[0.02] placeholder:font-medium placeholder:text-amber-600/70 dark:placeholder:text-amber-400/60'
                  : ''
              }`}
            />
          </div>

          {isEditing && (
            <div className="bg-muted/20 border-border/30 text-muted-foreground/90 mt-1.5 flex items-start gap-2 rounded-md border p-2 text-[11px] leading-normal">
              <Info className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                {`Click any structural node in the tree list grid to immediately assign or re-nest
                this element's location.`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Inherited Properties Module */}
      {selectedParent && isEditing && (
        <div className="border-border/60 bg-muted/10 animate-in fade-in slide-in-from-top-1.5 mt-5 flex flex-col gap-3 rounded-lg border p-4 duration-200">
          <div className="border-border/40 flex items-center gap-1.5 border-b pb-2">
            <Layers className="text-muted-foreground/60 h-3.5 w-3.5" />
            <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Cascaded Inherited Vectors
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="bg-background border-border/40 shadow-3xs rounded-md border p-2 text-center">
              <span className="text-muted-foreground/80 mb-0.5 block text-[10px] font-medium">
                DC Variant
              </span>
              <span className="text-foreground text-[13px] font-semibold tracking-wide">
                {selectedParent.dc}
              </span>
            </div>
            <div className="bg-background border-border/40 shadow-3xs rounded-md border p-2 text-center">
              <span className="text-muted-foreground/80 mb-0.5 block text-[10px] font-medium">
                Prefix ID
              </span>
              <span className="text-foreground text-[13px] font-semibold tracking-wide">
                {selectedParent.prefix}
              </span>
            </div>
            <div className="bg-background border-border/40 shadow-3xs rounded-md border p-2 text-center">
              <span className="text-muted-foreground/80 mb-0.5 block text-[10px] font-medium">
                Group Vector
              </span>
              <span className="text-foreground text-[13px] font-semibold tracking-wide">
                {selectedParent.grouping}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Audit & System Telemetry Footer */}
      {selectedId && !isEditing && (
        <div className="border-border/40 bg-muted/20 shadow-3xs animate-in fade-in zoom-in-98 mt-auto rounded-xl border p-4 text-xs duration-300">
          <div className="space-y-2.5">
            {/* Meta Row 1: ID */}
            <div className="border-border/30 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="text-muted-foreground/60 h-3.5 w-3.5" />
                <span className="text-muted-foreground text-[11px]">Node Identifier</span>
              </div>
              <span className="text-foreground bg-background border-border/80 shadow-3xs rounded border px-2 py-0.5 font-mono text-[12px] font-semibold">
                {selectedId}
              </span>
            </div>

            {/* Meta Row 2: Authority Level */}
            <div className="border-border/30 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-muted-foreground/60 h-3.5 w-3.5" />
                <span className="text-muted-foreground text-[11px]">System Integrity</span>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                  isSysDefined
                    ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {isSysDefined ? 'Protected Core' : 'Custom Field'}
              </span>
            </div>

            {/* Meta Row 3: User Author */}
            {currentRecord?.user_name && (
              <div className="border-border/30 flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground/60 h-3.5 w-3.5" />
                  <span className="text-muted-foreground text-[11px]">Created By</span>
                </div>
                <span className="text-foreground text-[11px] font-semibold">
                  {currentRecord.user_name}
                </span>
              </div>
            )}

            {/* Meta Row 4: Updated Stamp */}
            {currentRecord?.date_time_stamp && (
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground/60 h-3.5 w-3.5" />
                  <span className="text-muted-foreground text-[11px]">
                    Last Integrity Validation
                  </span>
                </div>
                <span className="text-muted-foreground/90 font-mono text-[11px] font-medium">
                  {new Date(currentRecord.date_time_stamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
