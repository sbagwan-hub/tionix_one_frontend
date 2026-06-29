'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Edit, Undo2, Save, RotateCw, HelpCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Toolbar from '@/components/shared/toolbar';
import { useAuthStore } from '@/stores/auth-store';
import {
  useAttendanceRules,
  useSaveAttendanceRules,
  useAttendanceRulesRights,
} from '../hooks/use-attendance-rules';
import { RuleI } from './rule-i';
import { RuleII } from './rule-ii';
import { RuleIII } from './rule-iii';
import { RuleIV } from './rule-iv';
import { RuleV } from './rule-v';
import { RuleVI } from './rule-vi';
import { LinkageFields } from './linkage-fields';
import { ImportCondition } from './import-condition';
import {
  RuleIIConfig,
  RuleIIIConfig,
  RuleIVConfig,
  RuleIVConfigExtra,
  RuleVConfig,
  RuleVConfigExtra,
  RuleVIConfig,
  LinkageFieldsConfig,
  ImportConditionConfig,
  AttendanceRules,
} from '../types';

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

const DEFAULT_LINKAGE: LinkageFieldsConfig = {
  selectedRuleTag: 'Rule I',
  empIdField: 'ddEmpId',
  timeInField: 'ddTimeIn',
};

const DEFAULT_IMPORT: ImportConditionConfig = {
  enabled: true,
  fullDayMinutes: 360,
  halfDayMinutes: 180,
};

export function AttendanceRulesScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number>(11); // Start on Linkage Fields by default
  const [isEditing, setIsEditing] = useState(false);

  // Form states matching rule configs
  const [ruleIIVal, setRuleIIVal] = useState<RuleIIConfig>(DEFAULT_RULE_II);
  const [ruleIIIVal, setRuleIIIVal] = useState<RuleIIIConfig>(DEFAULT_RULE_III);
  const [ruleIVVal, setRuleIVVal] = useState<RuleIVConfig>(DEFAULT_RULE_IV);
  const [ruleIVExtraVal, setRuleIVExtraVal] = useState<RuleIVConfigExtra>(DEFAULT_RULE_IV_EXTRA);
  const [ruleVVal, setRuleVVal] = useState<RuleVConfig>(DEFAULT_RULE_V);
  const [ruleVExtraVal, setRuleVExtraVal] = useState<RuleVConfigExtra>(DEFAULT_RULE_V_EXTRA);
  const [ruleVIVal, setRuleVIVal] = useState<RuleVIConfig>(DEFAULT_RULE_VI);
  const [linkageVal, setLinkageVal] = useState<LinkageFieldsConfig>(DEFAULT_LINKAGE);
  const [importVal, setImportVal] = useState<ImportConditionConfig>(DEFAULT_IMPORT);

  // Auth & Rights
  const user = useAuthStore((state) => state.user);
  const userRights = useAuthStore((state) => state.userRights);
  const isAdmin = userRights?.user?.sys_defined === true;
  const userId = user?.id || '';
  const { data: hasEditRights } = useAttendanceRulesRights(userId, isAdmin);

  // Queries & Mutations
  const { data: aggregateData, isLoading, refetch } = useAttendanceRules();
  const saveMutation = useSaveAttendanceRules();

  const activeItem = SIDEBAR_ITEMS.find((item) => item.id === selectedId) || SIDEBAR_ITEMS[0];

  // Load backend aggregate data into local form states
  useEffect(() => {
    if (aggregateData) {
      // Map Rule II
      setRuleIIVal({
        days_allowed: aggregateData.rule2.allowDays,
        min_completed_minutes: aggregateData.rule2.completed,
        days_onward: aggregateData.rule2.onwardDays,
        working_time_minutes: aggregateData.rule2.consider,
      });

      // Map Rule III
      if (aggregateData.rule3Bands && aggregateData.rule3Bands.length > 0) {
        setRuleIIIVal({
          ranges: aggregateData.rule3Bands.map((band) => ({
            from_min: band.from,
            to_min: band.to,
            deduct_min: band.deduct,
          })),
        });
      } else {
        setRuleIIIVal(DEFAULT_RULE_III);
      }

      // Map Rule IV
      if (aggregateData.rule4) {
        setRuleIVVal({
          ranges: (aggregateData.rule4.bands || []).map((band) => ({
            from_min: band.from,
            to_min: band.to,
            late_mark: band.deduct,
          })),
          every_late_mark: aggregateData.rule4.lateMarkThreshold,
          yearly_hours: aggregateData.rule4.totalHours,
          max_monthly_adjusted_hours: aggregateData.rule4.halfDayHourCredit,
          absent_threshold_minutes: aggregateData.rule4.workHourFrom,
          half_day_min_minutes: aggregateData.rule4.workHourFrom + 1,
          half_day_max_minutes: aggregateData.rule4.workHourTo,
        });

        setRuleIVExtraVal({
          is_worker_contractor: aggregateData.rule4.isWorker,
          incentive_max_days_less: aggregateData.rule4.workHourDays,
          incentive_overtime_hours: aggregateData.rule4.workHourHours,
        });
      } else {
        setRuleIVVal(DEFAULT_RULE_IV);
        setRuleIVExtraVal(DEFAULT_RULE_IV_EXTRA);
      }

      // Map Rule V
      if (aggregateData.rule5) {
        setRuleVVal({
          ruleA: {
            name: aggregateData.rule5.headingA || 'Campus Staff',
            minutes: aggregateData.rule5.tillA,
            no_deduction_days: aggregateData.rule5.lateA,
            deduct_from_day: aggregateData.rule5.onwardA,
            applicable_late: aggregateData.rule5.isLate,
            applicable_early: aggregateData.rule5.isEarly,
          },
        });

        setRuleVExtraVal({
          ruleB: {
            name: aggregateData.rule5.headingB || 'Head Office Staff',
            minutes: aggregateData.rule5.tillB,
            no_deduction_days: aggregateData.rule5.lateB,
            deduct_from_day: aggregateData.rule5.onwardB,
          },
        });
      } else {
        setRuleVVal(DEFAULT_RULE_V);
        setRuleVExtraVal(DEFAULT_RULE_V_EXTRA);
      }

      // Map Rule VI
      if (aggregateData.rule6) {
        setRuleVIVal({
          late_minutes_1: aggregateData.rule6.late1,
          late_days_1: aggregateData.rule6.days1,
          late_minutes_2: aggregateData.rule6.late2,
          late_days_2: aggregateData.rule6.days2,
          late_half_day_minutes: aggregateData.rule6.late3,
          late_half_day_after_minutes: aggregateData.rule6.late4,
          late_half_day_after_days: aggregateData.rule6.days4,
          absent_threshold_hours: aggregateData.rule6.hours,
          manual_adjustment_years: aggregateData.rule6.manualTimesPerYear,
        });
      } else {
        setRuleVIVal(DEFAULT_RULE_VI);
      }

      // Map Linkage
      setLinkageVal({
        selectedRuleTag: aggregateData.selectedRuleTag || 'Rule I',
        empIdField: aggregateData.empIdField || 'ddEmpId',
        timeInField: aggregateData.timeInField || 'ddTimeIn',
      });

      // Map Import Condition
      if (aggregateData.incentiveMonthly) {
        setImportVal({
          enabled: aggregateData.incentiveMonthly.enabled,
          fullDayMinutes: aggregateData.incentiveMonthly.fullDayMinutes,
          halfDayMinutes: aggregateData.incentiveMonthly.halfDayMinutes,
        });
      } else {
        setImportVal(DEFAULT_IMPORT);
      }
    }
  }, [aggregateData]);

  const handleEdit = () => {
    if (!hasEditRights) {
      toast.error('You do not have permission to edit attendance rules.');
      return;
    }
    setIsEditing(true);
  };

  const handleUndo = () => {
    setIsEditing(false);
    refetch();
  };

  const handleSave = async () => {
    const payload: AttendanceRules = {
      selectedRuleTag: linkageVal.selectedRuleTag,
      empIdField: linkageVal.empIdField,
      timeInField: linkageVal.timeInField,
      rule2: {
        allowDays: ruleIIVal.days_allowed,
        completed: ruleIIVal.min_completed_minutes,
        onwardDays: ruleIIVal.days_onward,
        consider: ruleIIVal.working_time_minutes,
      },
      rule3Bands: ruleIIIVal.ranges.map((range) => ({
        from: range.from_min,
        to: range.to_min,
        deduct: range.deduct_min,
      })),
      rule4: {
        bands: ruleIVVal.ranges.map((range) => ({
          from: range.from_min,
          to: range.to_min,
          deduct: range.late_mark,
        })),
        lateMarkThreshold: ruleIVVal.every_late_mark,
        totalHours: ruleIVVal.yearly_hours,
        halfDayHourCredit: ruleIVVal.max_monthly_adjusted_hours,
        workHourFrom: ruleIVVal.absent_threshold_minutes,
        workHourTo: ruleIVVal.half_day_max_minutes,
        workHourDays: ruleIVExtraVal.incentive_max_days_less,
        workHourHours: ruleIVExtraVal.incentive_overtime_hours,
        isWorker: ruleIVExtraVal.is_worker_contractor,
      },
      incentiveMonthly: {
        enabled: importVal.enabled,
        fullDayMinutes: importVal.fullDayMinutes,
        halfDayMinutes: importVal.halfDayMinutes,
      },
      rule5: {
        headingA: ruleVVal.ruleA.name,
        headingB: ruleVExtraVal.ruleB.name,
        lateA: ruleVVal.ruleA.no_deduction_days,
        tillA: ruleVVal.ruleA.minutes,
        onwardA: ruleVVal.ruleA.deduct_from_day,
        lateB: ruleVExtraVal.ruleB.no_deduction_days,
        tillB: ruleVExtraVal.ruleB.minutes,
        onwardB: ruleVExtraVal.ruleB.deduct_from_day,
        isLate: ruleVVal.ruleA.applicable_late,
        isEarly: ruleVVal.ruleA.applicable_early,
      },
      rule6: {
        late1: ruleVIVal.late_minutes_1,
        days1: ruleVIVal.late_days_1,
        late2: ruleVIVal.late_minutes_2,
        days2: ruleVIVal.late_days_2,
        late3: ruleVIVal.late_half_day_minutes,
        late4: ruleVIVal.late_half_day_after_minutes,
        days4: ruleVIVal.late_half_day_after_days,
        hours: ruleVIVal.absent_threshold_hours,
        manualTimesPerYear: ruleVIVal.manual_adjustment_years,
      },
    };

    try {
      await saveMutation.mutateAsync(payload);
      setIsEditing(false);
      toast.success('Rules updated successfully.');
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message || 'Failed to save rules.');
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
    } else if (ruleNum === 11) {
      setLinkageVal(DEFAULT_LINKAGE);
    } else if (ruleNum === 12) {
      setImportVal(DEFAULT_IMPORT);
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
        disabled: saveMutation.isPending,
      },
      {
        label: 'Cancel',
        icon: Undo2,
        variant: 'outline',
        onClick: handleUndo,
        disabled: saveMutation.isPending,
      },
    ] as const)
    : ([
      {
        label: 'Edit',
        icon: Edit,
        variant: 'secondary',
        onClick: handleEdit,
        disabled: selectedId === 1 || (selectedId >= 7 && selectedId <= 10) || !hasEditRights, // Rule I and VII-X are informational
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
        <aside className="w-64 shrink-0 bg-muted/20 overflow-y-auto neat-scrollbar flex flex-col p-2 pb-12 space-y-1">
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
            <div className="flex-1 relative z-10 flex flex-col">
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
              {selectedId === 11 && (
                <LinkageFields
                  value={linkageVal}
                  onChange={setLinkageVal}
                  isEditing={isEditing}
                />
              )}
              {selectedId === 12 && (
                <ImportCondition
                  value={importVal}
                  onChange={setImportVal}
                  isEditing={isEditing}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
