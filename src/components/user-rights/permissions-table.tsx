'use client';
import React, { useState } from 'react';
import PermissionTabs from './permission-tabs';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  FormRightRow,
  FormReportRow,
  FormOtherRow,
  SpecialRow,
  BranchRow,
  DashboardRow,
  ProcessRow,
} from '@/lib/api';

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
  { id: 'specials', label: 'Specials' },
  { id: 'branches', label: 'Branches' },
  { id: 'dashboards', label: 'Dashboards' },
  { id: 'processes', label: 'Processes' },
];

export default function PermissionTable({
  activeTab,
  setActiveTab,
  editable,
  markDirty,
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
  const [branchInput, setBranchInput] = useState('');
  const [dashboardInput, setDashboardInput] = useState('');
  const [processInput, setProcessInput] = useState('');

  // ── Handlers for simple lists ───────────────────────────────────────────────
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

  // ── Grouping logic for grids ───────────────────────────────────────────────
  const getGroups = <T extends { module_caption?: string; module_name?: string }>(rows: T[]) => {
    const grps: { cap: string; items: { r: T; idx: number }[] }[] = [];
    rows?.forEach((r, i) => {
      const cap = r.module_caption || r.module_name || 'General';
      let g = grps.find((g) => g.cap === cap);
      if (!g) {
        g = { cap, items: [] };
        grps.push(g);
      }
      g.items.push({ r, idx: i });
    });
    return grps;
  };

  return (
    <div
      className={cn(
        'border-border bg-card dark:border-input/70 dark:bg-card flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-sm border shadow-sm',
        className,
      )}
    >
      <PermissionTabs
        tabs={TABS.map((t) => t.label)}
        activeTab={TABS.find((t) => t.id === activeTab)?.label || 'Masters'}
        setActiveTab={(lbl) => {
          const t = TABS.find((t) => t.label === lbl);
          if (t) setActiveTab(t.id);
        }}
      />

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-4">
        {/* ── MASTERS / TRANSACTIONS ── */}
        {(activeTab === 'masters' || activeTab === 'transactions') && (
          <div className="max-h-full overflow-auto">
            <Table className="min-w-full border-separate border-spacing-0 text-left">
              <TableHeader>
                <TableRow className="border-border bg-muted/50 dark:bg-muted/20 sticky top-0 z-10 border-b">
                  <TableHead className="text-muted-foreground bg-card w-2/5 p-3 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    Form Title / Functional Module
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Add
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Edit
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Delete
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    View
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Print
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Export
                  </TableHead>
                  {activeTab === 'transactions' && (
                    <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                      Auth
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-border divide-y">
                {getGroups(activeTab === 'masters' ? masters : transactions).map((group) => (
                  <React.Fragment key={group.cap}>
                    <TableRow className="bg-muted/40 dark:bg-muted/30">
                      <TableCell
                        colSpan={activeTab === 'transactions' ? 8 : 7}
                        className="text-brand px-4 py-2 text-xs font-bold tracking-wide text-amber-500/90 uppercase"
                      >
                        {group.cap}
                      </TableCell>
                    </TableRow>

                    {group.items.map(({ r, idx }) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-muted/20 dark:hover:bg-muted/10 transition"
                      >
                        <TableCell className="text-foreground p-3 text-sm font-medium">
                          {r.form_name}
                        </TableCell>
                        {(['RAdd', 'REdit', 'RDelete', 'RView', 'RPrint', 'RExport'] as const).map(
                          (col) => (
                            <TableCell key={col} className="p-3 text-center">
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={r[col]}
                                  disabled={!editable}
                                  onCheckedChange={(checked) => {
                                    const rows = activeTab === 'masters' ? masters : transactions;
                                    const setRows =
                                      activeTab === 'masters' ? setMasters : setTransactions;
                                    setRows(
                                      rows.map((row, i) =>
                                        i === idx ? { ...row, [col]: Boolean(checked) } : row,
                                      ),
                                    );
                                    markDirty();
                                  }}
                                />
                              </div>
                            </TableCell>
                          ),
                        )}
                        {activeTab === 'transactions' && (
                          <TableCell className="p-3 text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={r.RAuthorize}
                                disabled={!editable}
                                onCheckedChange={(checked) => {
                                  setTransactions(
                                    transactions.map((row, i) =>
                                      i === idx ? { ...row, RAuthorize: Boolean(checked) } : row,
                                    ),
                                  );
                                  markDirty();
                                }}
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {(activeTab === 'masters' ? masters : transactions)?.length === 0 && (
              <p className="text-muted-foreground py-12 text-center text-sm italic">
                No modules loaded for this user.
              </p>
            )}
          </div>
        )}

        {/* ── REPORTS ── */}
        {activeTab === 'reports' && (
          <div className="max-h-full overflow-auto">
            <Table className="min-w-full border-separate border-spacing-0 text-left">
              <TableHeader>
                <TableRow className="border-border bg-muted/50 dark:bg-muted/20 sticky top-0 z-10 border-b">
                  <TableHead className="text-muted-foreground bg-card w-2/5 p-3 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    Report Form Title
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    View
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Print
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Export
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-border divide-y">
                {getGroups(reports).map((group) => (
                  <React.Fragment key={group.cap}>
                    <TableRow className="bg-muted/40 dark:bg-muted/30">
                      <TableCell
                        colSpan={4}
                        className="text-brand px-4 py-2 text-xs font-bold tracking-wide text-amber-500/90 uppercase"
                      >
                        {group.cap}
                      </TableCell>
                    </TableRow>

                    {group.items.map(({ r, idx }) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-muted/20 dark:hover:bg-muted/10 transition"
                      >
                        <TableCell className="text-foreground p-3 text-sm font-medium">
                          {r.form_name}
                        </TableCell>
                        {(['RView', 'RPrint', 'RExport'] as const).map((col) => (
                          <TableCell key={col} className="p-3 text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={r[col]}
                                disabled={!editable}
                                onCheckedChange={(checked) => {
                                  setReports(
                                    reports.map((row, i) =>
                                      i === idx ? { ...row, [col]: Boolean(checked) } : row,
                                    ),
                                  );
                                  markDirty();
                                }}
                              />
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {reports?.length === 0 && (
              <p className="text-muted-foreground py-12 text-center text-sm italic">
                No reports found.
              </p>
            )}
          </div>
        )}

        {/* ── OTHERS ── */}
        {activeTab === 'others' && (
          <div className="max-h-full overflow-auto">
            <Table className="min-w-full border-separate border-spacing-0 text-left">
              <TableHeader>
                <TableRow className="border-border bg-muted/50 dark:bg-muted/20 sticky top-0 z-10 border-b">
                  <TableHead className="text-muted-foreground bg-card w-3/4 p-3 text-left text-xs font-semibold tracking-[0.14em] uppercase">
                    Form Title
                  </TableHead>
                  <TableHead className="text-muted-foreground bg-card p-3 text-center text-xs font-semibold tracking-[0.14em] uppercase">
                    Active Rights
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-border divide-y">
                {getGroups(others).map((group) => (
                  <React.Fragment key={group.cap}>
                    <TableRow className="bg-muted/40 dark:bg-muted/30">
                      <TableCell
                        colSpan={2}
                        className="text-brand px-4 py-2 text-xs font-bold tracking-wide text-amber-500/90 uppercase"
                      >
                        {group.cap}
                      </TableCell>
                    </TableRow>

                    {group.items.map(({ r, idx }) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-muted/20 dark:hover:bg-muted/10 transition"
                      >
                        <TableCell className="text-foreground p-3 text-sm font-medium">
                          {r.form_name}
                        </TableCell>
                        <TableCell className="p-3 text-center">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={r.RRights}
                              disabled={!editable}
                              onCheckedChange={(checked) => {
                                setOthers(
                                  others.map((row, i) =>
                                    i === idx ? { ...row, RRights: Boolean(checked) } : row,
                                  ),
                                );
                                markDirty();
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {others?.length === 0 && (
              <p className="text-muted-foreground py-12 text-center text-sm italic">
                No other forms found.
              </p>
            )}
          </div>
        )}

        {/* ── SPECIALS ── */}
        {activeTab === 'specials' && (
          <div>
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
                    onCheckedChange={(val) => {
                      setSpecials(
                        specials.map((row, i) =>
                          i === idx ? { ...row, Rights: Boolean(val) } : row,
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
        )}

        {/* ── BRANCHES ── */}
        {activeTab === 'branches' && (
          <div className="max-w-2xl space-y-4">
            {editable && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Set ID (numeric)"
                  value={branchInput}
                  onChange={(e) => setBranchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBranch()}
                  className="w-48 text-sm"
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
                  className="bg-secondary text-secondary-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium shadow-sm transition-all"
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
        )}

        {/* ── DASHBOARDS ── */}
        {activeTab === 'dashboards' && (
          <div className="max-w-2xl space-y-4">
            {editable && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Dashboard ID"
                  value={dashboardInput}
                  onChange={(e) => setDashboardInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDashboard()}
                  className="w-48 text-sm"
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
                  className="bg-secondary text-secondary-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium shadow-sm transition-all"
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
        )}

        {/* ── PROCESSES ── */}
        {activeTab === 'processes' && (
          <div className="max-w-2xl space-y-4">
            {editable && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Product ID (max 10 chars)"
                  value={processInput}
                  maxLength={10}
                  onChange={(e) => setProcessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addProcess()}
                  className="w-56 text-sm"
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
                  className="bg-secondary text-secondary-foreground border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium shadow-sm transition-all"
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
        )}
      </div>
    </div>
  );
}
