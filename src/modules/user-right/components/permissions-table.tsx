'use client';
import React, { useState, useEffect } from 'react';
import PermissionTabs from './permission-tabs';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/common/form-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import PermissionGrid, { COL_LABELS } from './permission-grid';
import { Loading } from '@/components/common/loading';
import {
  FormRightRow,
  FormReportRow,
  FormOtherRow,
  SpecialRow,
  BranchRow,
  DashboardRow,
  ProcessRow,
} from '../types';

type TabId =
  | 'masters'
  | 'transactions'
  | 'reports'
  | 'others'
  | 'specials'
  | 'branches'
  | 'dashboards'
  | 'processes';

interface PermissionTableProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  editable: boolean;
  markDirty: () => void;
  loading?: boolean;

  masters: FormRightRow[];
  setMasters: (rows: FormRightRow[]) => void;

  transactions: FormRightRow[];
  setTransactions: (rows: FormRightRow[]) => void;

  reports: FormReportRow[];
  setReports: (rows: FormReportRow[]) => void;

  others: FormOtherRow[];
  setOthers: (rows: FormOtherRow[]) => void;

  specials: SpecialRow[];
  setSpecials: (rows: SpecialRow[]) => void;

  branches: BranchRow[];
  setBranches: (rows: BranchRow[]) => void;

  dashboards: DashboardRow[];
  setDashboards: (rows: DashboardRow[]) => void;

  processes: ProcessRow[];
  setProcesses: (rows: ProcessRow[]) => void;

  className?: string;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'masters', label: 'Masters' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'reports', label: 'Reports' },
  { id: 'others', label: 'Others' },
];

const TAB_LABELS = TABS.map((t) => t.label);

const MASTERS_COLS = ['add', 'edit', 'delete', 'view', 'print', 'export'] as const;
const TRANSACTIONS_COLS = ['add', 'edit', 'delete', 'view', 'print', 'export'] as const;
const REPORTS_COLS = ['view', 'print', 'export'] as const;
const OTHERS_COLS = ['rights'] as const;

export default function PermissionTable({
  activeTab,
  setActiveTab,
  editable,
  markDirty,
  loading,
  masters,
  setMasters,
  transactions,
  setTransactions,
  reports,
  setReports,
  others,
  setOthers,
  specials,
  setSpecials,
  branches,
  setBranches,
  dashboards,
  setDashboards,
  processes,
  setProcesses,
  className,
}: PermissionTableProps) {
  const [localActiveTab, setLocalActiveTab] = useState<TabId>(activeTab);
  const [branchInput, setBranchInput] = useState('');
  const [dashboardInput, setDashboardInput] = useState('');
  const [processInput, setProcessInput] = useState('');

  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);

  const addBranch = () => {
    const v = parseInt(branchInput.trim(), 10);
    if (!isNaN(v)) {
      if (!branches.some((b) => b.fkSetId === v)) {
        setBranches([...branches, { fkSetId: v }]);
        markDirty();
      }
      setBranchInput('');
    }
  };

  const removeBranch = (idx: number) => {
    setBranches(branches.filter((_, i) => i !== idx));
    markDirty();
  };

  const addDashboard = () => {
    const v = parseInt(dashboardInput.trim(), 10);
    if (!isNaN(v)) {
      if (!dashboards.some((d) => d.Id === v)) {
        setDashboards([...dashboards, { Id: v }]);
        markDirty();
      }
      setDashboardInput('');
    }
  };

  const removeDashboard = (idx: number) => {
    setDashboards(dashboards.filter((_, i) => i !== idx));
    markDirty();
  };

  const addProcess = () => {
    const v = processInput.trim().slice(0, 10);
    if (v) {
      if (!processes.some((p) => p.fkProdId === v)) {
        setProcesses([...processes, { fkProdId: v }]);
        markDirty();
      }
      setProcessInput('');
    }
  };

  const removeProcess = (idx: number) => {
    setProcesses(processes.filter((_, i) => i !== idx));
    markDirty();
  };

  return (
    <div
      className={cn(
        'border-border bg-card dark:border-input/70 dark:bg-card flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-sm border',
        className,
      )}
    >
      <PermissionTabs
        tabs={TAB_LABELS}
        activeTab={TABS.find((t) => t.id === localActiveTab)?.label || 'Masters'}
        setActiveTab={(lbl) => {
          const t = TABS.find((t) => t.label === lbl);
          if (t) setActiveTab(t.id);
        }}
      />

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto px-4 py-0">
        {loading ? (
          <div className="flex h-full min-h-[250px] items-center justify-center py-16">
            <Loading
              size="lg"
              text="Loading permissions..."
              className="text-primary animate-pulse"
            />
          </div>
        ) : (
          <>
            <div className={cn(activeTab !== 'masters' && 'hidden')}>
              <PermissionGrid
                rows={masters}
                setRows={setMasters}
                cols={MASTERS_COLS}
                colLabels={COL_LABELS}
                editable={editable}
                markDirty={markDirty}
                emptyText="No modules loaded for this user."
              />
            </div>

            <div className={cn(activeTab !== 'transactions' && 'hidden')}>
              <PermissionGrid
                rows={transactions}
                setRows={setTransactions}
                cols={TRANSACTIONS_COLS}
                colLabels={COL_LABELS}
                hasAuth={true}
                editable={editable}
                markDirty={markDirty}
                emptyText="No modules loaded for this user."
              />
            </div>

            <div className={cn(activeTab !== 'reports' && 'hidden')}>
              <PermissionGrid
                rows={reports}
                setRows={setReports}
                cols={REPORTS_COLS}
                colLabels={COL_LABELS}
                isReport={true}
                editable={editable}
                markDirty={markDirty}
                emptyText="No reports found."
              />
            </div>

            <div className={cn(activeTab !== 'others' && 'hidden')}>
              <PermissionGrid
                rows={others}
                setRows={setOthers}
                cols={OTHERS_COLS}
                colLabels={COL_LABELS}
                editable={editable}
                markDirty={markDirty}
                emptyText="No other forms found."
              />
            </div>

            <div className={cn(activeTab !== 'specials' && 'hidden')}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {specials?.map((s, idx) => (
                  <label
                    key={idx}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 transition-all select-none',
                      s.Rights
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'border-border bg-card text-muted-foreground',
                      editable
                        ? 'cursor-pointer hover:border-emerald-500/30'
                        : 'cursor-not-allowed opacity-75',
                    )}
                  >
                    <Checkbox
                      checked={s.Rights}
                      disabled={!editable}
                      className="border-muted-foreground data-[state=checked]:border-primary"
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setSpecials(
                          specials.map((row, i) =>
                            i === idx ? { ...row, Rights: isChecked } : row,
                          ),
                        );
                        markDirty();
                      }}
                    />
                    <span className="truncate text-sm font-semibold">{s.Form}</span>
                  </label>
                ))}
              </div>
              {specials?.length === 0 && (
                <p className="text-muted-foreground py-12 text-center text-sm italic">
                  No special flags defined.
                </p>
              )}
            </div>

            {/* ── BRANCHES ── */}
            <div className={cn('max-h-full overflow-auto', activeTab !== 'branches' && 'hidden')}>
              <div className="max-w-2xl space-y-4">
                {editable && (
                  <div className="flex items-center gap-2">
                    <FormInput
                      type="number"
                      placeholder="Set ID (numeric)"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addBranch()}
                      containerClassName="w-48"
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={addBranch}>
                      <Plus className="mr-1 size-4" /> Add Branch
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {branches?.map((b, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary text-secondary-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all"
                    >
                      Set ID: <strong>{b.fkSetId}</strong>
                      {editable && (
                        <button
                          onClick={() => removeBranch(idx)}
                          className="text-muted-foreground hover:text-destructive ml-1 transition-colors focus:outline-none"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {branches?.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">No branches assigned.</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── DASHBOARDS ── */}
            <div className={cn('max-h-full overflow-auto', activeTab !== 'dashboards' && 'hidden')}>
              <div className="max-w-2xl space-y-4">
                {editable && (
                  <div className="flex items-center gap-2">
                    <FormInput
                      type="number"
                      placeholder="Dashboard ID"
                      value={dashboardInput}
                      onChange={(e) => setDashboardInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addDashboard()}
                      containerClassName="w-48"
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={addDashboard}>
                      <Plus className="mr-1 size-4" /> Add Dashboard
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {dashboards?.map((d, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary text-secondary-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all"
                    >
                      Dashboard: <strong>#{d.Id}</strong>
                      {editable && (
                        <button
                          onClick={() => removeDashboard(idx)}
                          className="text-muted-foreground hover:text-destructive ml-1 transition-colors focus:outline-none"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {dashboards?.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">No dashboards assigned.</p>
                  )}
                </div>
              </div>
            </div>

            <div className={cn('max-h-full overflow-auto', activeTab !== 'processes' && 'hidden')}>
              <div className="max-w-2xl space-y-4">
                {editable && (
                  <div className="flex items-center gap-2">
                    <FormInput
                      placeholder="Product ID (max 10 chars)"
                      value={processInput}
                      maxLength={10}
                      onChange={(e) => setProcessInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addProcess()}
                      containerClassName="w-56"
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={addProcess}>
                      <Plus className="mr-1 size-4" /> Add Product
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {processes?.map((p, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary text-secondary-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all"
                    >
                      Prod ID: <strong>{p.fkProdId}</strong>
                      {editable && (
                        <button
                          onClick={() => removeProcess(idx)}
                          className="text-muted-foreground hover:text-destructive ml-1 transition-colors focus:outline-none"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {processes?.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">No processes assigned.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
