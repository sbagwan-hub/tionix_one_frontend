'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Undo2, Save, RotateCw, HelpCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Toolbar from '@/components/shared/toolbar';
import { useAttendanceRule, useUpsertAttendanceRule } from '../hooks/use-attendance-rules';
import { RuleI } from './rule-i';
import { RuleII } from './rule-ii';
import { RuleIII } from './rule-iii';
import { RuleIV } from './rule-iv';
import { RuleV } from './rule-v';
import { RuleVI } from './rule-vi';
import { RuleIIConfig, RuleIIIConfig, RuleIVConfig, RuleIVConfigExtra, RuleVConfig, RuleVConfigExtra, RuleVIConfig } from '../types';

interface SidebarItem {
  id: number;
  label: string;
  type: 'linkage' | 'rule' | 'import';
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 11, label: 'Linkage Fields', type: 'linkage' },
  { id: 1, label: 'Rule I', type: 'rule' },
  { id: 2, label: 'Rule II', type: 'rule' },
  { id: 3, label: 'Rule III', type: 'rule' },
  { id: 4, label: 'Rule IV', type: 'rule' },
  { id: 5, label: 'Rule V', type: 'rule' },
  { id: 6, label: 'Rule VI', type: 'rule' },
  { id: 7, label: 'Rule VII', type: 'rule' },
  { id: 8, label: 'Rule VIII', type: 'rule' },
  { id: 9, label: 'Rule IX', type: 'rule' },
  { id: 10, label: 'Rule X', type: 'rule' },
  { id: 12, label: 'Import Condition (Monthly)', type: 'import' },
];

const DEFAULT_RULE_II: RuleIIConfig = {
  days_allowed: 2,
  min_completed_minutes: 390,
  days_onward: 3,
  working_time_minutes: 240,
};

const DEFAULT_RULE_III: RuleIIIConfig = {
  ranges: [
    { from_min: 1, to_min: 30, deduct_min: 30 },
    { from_min: 31, to_min: 60, deduct_min: 90 },
    { from_min: 61, to_min: 120, deduct_min: 150 },
    { from_min: 121, to_min: 240, deduct_min: 240 },
  ],
};

const DEFAULT_RULE_IV: RuleIVConfig = {
  ranges: [
    { from_min: 11, to_min: 20, late_mark: 1 },
    { from_min: 21, to_min: 30, late_mark: 2 },
    { from_min: 31, to_min: 60, late_mark: 3 },
  ],
  every_late_mark: 3,
  yearly_hours: 12,
  max_monthly_adjusted_hours: 2,
  absent_threshold_minutes: 240,
  half_day_min_minutes: 241,
  half_day_max_minutes: 480,
};

const DEFAULT_RULE_IV_EXTRA: RuleIVConfigExtra = {
  is_worker_contractor: false,
  incentive_max_days_less: 2,
  incentive_overtime_hours: 2,
};

const DEFAULT_RULE_V: RuleVConfig = {
  ruleA: {
    name: 'Rule A',
    minutes: 4,
    no_deduction_days: 5,
    deduct_from_day: 5,
    applicable_late: true,
    applicable_early: true,
  },
};

const DEFAULT_RULE_V_EXTRA: RuleVConfigExtra = {
  ruleB: {
    name: 'Rule B',
    minutes: 4,
    no_deduction_days: 15,
    deduct_from_day: 5,
  },
};

const DEFAULT_RULE_VI: RuleVIConfig = {
  late_minutes_1: 0,
  late_days_1: 0,
  late_minutes_2: 0,
  late_days_2: 0,
  late_half_day_minutes: 0,
  late_half_day_after_minutes: 0,
  late_half_day_after_days: 0,
  absent_threshold_hours: 0,
  manual_adjustment_years: 0,
};

export function AttendanceRulesScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);

  // Form states matching rule configs
  const [ruleIIVal, setRuleIIVal] = useState<RuleIIConfig>(DEFAULT_RULE_II);
  const [ruleIIIVal, setRuleIIIVal] = useState<RuleIIIConfig>(DEFAULT_RULE_III);
  const [ruleIVVal, setRuleIVVal] = useState<RuleIVConfig>(DEFAULT_RULE_IV);
  const [ruleIVExtraVal, setRuleIVExtraVal] = useState<RuleIVConfigExtra>(DEFAULT_RULE_IV_EXTRA);
  const [ruleVVal, setRuleVVal] = useState<RuleVConfig>(DEFAULT_RULE_V);
  const [ruleVExtraVal, setRuleVExtraVal] = useState<RuleVConfigExtra>(DEFAULT_RULE_V_EXTRA);
  const [ruleVIVal, setRuleVIVal] = useState<RuleVIConfig>(DEFAULT_RULE_VI);

  // Queries & Mutations
  const { data: record, isLoading, refetch } = useAttendanceRule(selectedId);
  const upsertMutation = useUpsertAttendanceRule();

  const activeItem = SIDEBAR_ITEMS.find((item) => item.id === selectedId) || SIDEBAR_ITEMS[1];

  // Load backend data into local form states
  useEffect(() => {
    if (record) {
      try {
        const parsedFields = JSON.parse(record.temp_fields);
        const parsedFields2 = record.temp_fields2 ? JSON.parse(record.temp_fields2) : null;

        if (selectedId === 2) {
          setRuleIIVal({ ...DEFAULT_RULE_II, ...parsedFields });
        } else if (selectedId === 3) {
          setRuleIIIVal({ ...DEFAULT_RULE_III, ...parsedFields });
        } else if (selectedId === 4) {
          setRuleIVVal({ ...DEFAULT_RULE_IV, ...parsedFields });
          setRuleIVExtraVal({ ...DEFAULT_RULE_IV_EXTRA, ...parsedFields2 });
        } else if (selectedId === 5) {
          setRuleVVal({ ...DEFAULT_RULE_V, ...parsedFields });
          setRuleVExtraVal({ ...DEFAULT_RULE_V_EXTRA, ...parsedFields2 });
        } else if (selectedId === 6) {
          setRuleVIVal({ ...DEFAULT_RULE_VI, ...parsedFields });
        }
      } catch (e) {
        console.error('Failed to parse rule fields from DB:', e);
      }
    } else {
      // Clear or load defaults if record is missing
      if (selectedId === 2) setRuleIIVal(DEFAULT_RULE_II);
      else if (selectedId === 3) setRuleIIIVal(DEFAULT_RULE_III);
      else if (selectedId === 4) {
        setRuleIVVal(DEFAULT_RULE_IV);
        setRuleIVExtraVal(DEFAULT_RULE_IV_EXTRA);
      } else if (selectedId === 5) {
        setRuleVVal(DEFAULT_RULE_V);
        setRuleVExtraVal(DEFAULT_RULE_V_EXTRA);
      } else if (selectedId === 6) {
        setRuleVIVal(DEFAULT_RULE_VI);
      }
    }
  }, [record, selectedId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUndo = () => {
    setIsEditing(false);
    refetch();
  };

  const handleSave = async () => {
    let tempFields = '';
    let tempFields2: string | null = null;

    if (selectedId === 2) {
      tempFields = JSON.stringify(ruleIIVal);
    } else if (selectedId === 3) {
      tempFields = JSON.stringify(ruleIIIVal);
    } else if (selectedId === 4) {
      tempFields = JSON.stringify(ruleIVVal);
      tempFields2 = JSON.stringify(ruleIVExtraVal);
    } else if (selectedId === 5) {
      tempFields = JSON.stringify(ruleVVal);
      tempFields2 = JSON.stringify(ruleVExtraVal);
    } else if (selectedId === 6) {
      tempFields = JSON.stringify(ruleVIVal);
    } else {
      tempFields = JSON.stringify({});
    }

    try {
      await upsertMutation.mutateAsync({
        id: selectedId,
        temp_fields: tempFields,
        temp_fields2: tempFields2,
        isExisting: !!record,
      });
      setIsEditing(false);
      toast.success('Rules updated successfully.');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save rules.');
    }
  };

  const handleDefault = (ruleNum: number) => {
    if (ruleNum === 2) setRuleIIVal(DEFAULT_RULE_II);
    else if (ruleNum === 3) setRuleIIIVal(DEFAULT_RULE_III);
    else if (ruleNum === 4) {
      setRuleIVVal(DEFAULT_RULE_IV);
      setRuleIVExtraVal(DEFAULT_RULE_IV_EXTRA);
    } else if (ruleNum === 5) {
      setRuleVVal(DEFAULT_RULE_V);
      setRuleVExtraVal(DEFAULT_RULE_V_EXTRA);
    } else if (ruleNum === 6) {
      setRuleVIVal(DEFAULT_RULE_VI);
    }
    toast.info('Default settings loaded. Remember to save.');
  };

  const crudActions = isEditing
    ? ([
      {
        label: 'Save',
        icon: Save,
        variant: 'primary',
        onClick: handleSave,
        disabled: upsertMutation.isPending,
      },
      {
        label: 'Cancel',
        icon: Undo2,
        variant: 'outline',
        onClick: handleUndo,
        disabled: upsertMutation.isPending,
      },
    ] as const)
    : ([
      {
        label: 'Edit',
        icon: Edit,
        variant: 'secondary',
        onClick: handleEdit,
        disabled: selectedId === 1 || selectedId > 6, // Rule I and VII-X are informational
      },
    ] as const);

  const utilityActions = [
    { icon: RotateCw, title: 'Refresh', onClick: () => { refetch(); } },
    { icon: HelpCircle, title: 'Help', onClick: () => { toast.info('Configure rules and save updates.'); } },
    { icon: LogOut, title: 'Exit', onClick: () => { router.push('/dashboard'); } },
  ] as const;

  return (
    <div className="flex h-full flex-col bg-background text-foreground select-none">
      {/* Header Toolbar */}
      <div className="shrink-0 p-4">
        <Toolbar title={`Attendance Rules (Settings) - ${activeItem.label}`} actions={crudActions} utilities={utilityActions} />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-1 min-h-0 divide-x divide-border border rounded-lg bg-card overflow-hidden m-4 mt-0">
        {/* Left Sidebar Menu */}
        <aside className="w-64 shrink-0 bg-muted/20 overflow-y-auto flex flex-col p-2 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                disabled={isEditing}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border ${isSelected
                  ? 'bg-primary/10 text-primary border-primary/20 shadow-sm font-bold'
                  : 'text-foreground/75 hover:bg-muted/60 border-transparent hover:text-foreground disabled:opacity-50'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 overflow-y-auto bg-background/50 relative flex flex-col min-w-0">
          {/* Subtle Glows */}
          <div className="absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full bg-radial from-primary/5 to-transparent opacity-40 blur-3xl" />

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <RotateCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex-1 min-h-0 relative z-10">
              {selectedId === 1 && <RuleI />}
              {selectedId === 2 && (
                <RuleII
                  value={ruleIIVal}
                  onChange={setRuleIIVal}
                  isEditing={isEditing}
                  onDefault={() => handleDefault(2)}
                />
              )}
              {selectedId === 3 && (
                <RuleIII
                  value={ruleIIIVal}
                  onChange={setRuleIIIVal}
                  isEditing={isEditing}
                  onDefault={() => handleDefault(3)}
                />
              )}
              {selectedId === 4 && (
                <RuleIV
                  value={ruleIVVal}
                  onChange={setRuleIVVal}
                  extraValue={ruleIVExtraVal}
                  onExtraChange={setRuleIVExtraVal}
                  isEditing={isEditing}
                  onDefault={() => handleDefault(4)}
                />
              )}
              {selectedId === 5 && (
                <RuleV
                  value={ruleVVal}
                  onChange={setRuleVVal}
                  extraValue={ruleVExtraVal}
                  onExtraChange={setRuleVExtraVal}
                  isEditing={isEditing}
                  onDefault={() => handleDefault(5)}
                />
              )}
              {selectedId === 6 && (
                <RuleVI
                  value={ruleVIVal}
                  onChange={setRuleVIVal}
                  isEditing={isEditing}
                  onDefault={() => handleDefault(6)}
                />
              )}

              {/* Informational View for Rule VII-X or linkage/import */}
              {(selectedId > 6 || selectedId > 10) && (
                <div className="flex h-full flex-col justify-center items-center p-6 space-y-4 max-w-md mx-auto text-center">
                  <h3 className="text-sm font-bold text-muted-foreground">{activeItem.label} Information</h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed bg-muted/20 border border-border p-4 rounded-lg">
                    This setting configuration is currently running under default system policies. Custom parameters can be modified via DB scripts or customized as features expand.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
