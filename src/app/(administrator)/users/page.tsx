'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  api,
  BranchRow,
  DashboardRow,
  FormOtherRow,
  FormReportRow,
  FormRightRow,
  ProcessRow,
  SpecialRow,
  UserListItem,
  UserRightsOut,
} from '@/lib/api';

// ── Logged-in operator (replace with real session) ────────────────────────────
const OPERATOR_ID = 2;

// ── Tab types ─────────────────────────────────────────────────────────────────
type Tab =
  | 'masters'
  | 'transactions'
  | 'reports'
  | 'others'
  | 'specials'
  | 'branches'
  | 'dashboards'
  | 'processes';

const TABS: { id: Tab; label: string }[] = [
  { id: 'masters', label: 'Masters' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'reports', label: 'Reports' },
  { id: 'others', label: 'Others' },
  { id: 'specials', label: 'Specials' },
  { id: 'branches', label: 'Branches' },
  { id: 'dashboards', label: 'Dashboards' },
  { id: 'processes', label: 'Processes' },
];

// ── Checkbox cell ─────────────────────────────────────────────────────────────
function Chk({
  value,
  editable,
  onChange,
}: {
  value: boolean;
  editable: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={!editable}
      onClick={() => onChange?.(!value)}
      className={`flex h-5 w-5 items-center justify-center rounded border text-xs font-bold transition-all ${!editable ? 'cursor-default opacity-60' : 'cursor-pointer hover:scale-110'} ${value ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-500 bg-slate-700 text-slate-400'} `}
    >
      {value ? '✓' : '–'}
    </button>
  );
}

// ── Right rows grid (Masters / Transactions) ──────────────────────────────────
const RIGHT_COLS = ['RAdd', 'REdit', 'RDelete', 'RView', 'RPrint', 'RExport'] as const;
const TRAN_COLS = [...RIGHT_COLS, 'RAuthorize'] as const;

function RightsGrid({
  rows,
  editable,
  showAuthorize,
  onChange,
}: {
  rows: FormRightRow[];
  editable: boolean;
  showAuthorize: boolean;
  onChange: (rows: FormRightRow[]) => void;
}) {
  const cols = showAuthorize ? TRAN_COLS : RIGHT_COLS;
  const update = (idx: number, col: string, val: boolean) => {
    onChange(rows.map((r, i) => (i === idx ? { ...r, [col]: val } : r)));
  };

  // group by module_caption
  const groups: { caption: string; items: { row: FormRightRow; idx: number }[] }[] = [];
  rows.forEach((row, idx) => {
    const cap = row.module_caption || row.module_name || 'General';
    let g = groups.find((g) => g.caption === cap);
    if (!g) {
      g = { caption: cap, items: [] };
      groups.push(g);
    }
    g.items.push({ row, idx });
  });

  return (
    <div className="overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="sticky top-0 z-10">
            <th className="w-72 border-b border-slate-600 bg-slate-800 px-3 py-2 text-left font-medium text-slate-300">
              Form
            </th>
            {cols.map((c) => (
              <th
                key={c}
                className="w-14 border-b border-slate-600 bg-slate-800 px-2 py-2 text-center font-medium text-slate-300"
              >
                {c.replace('R', '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <>
              <tr key={`h-${g.caption}`}>
                <td
                  colSpan={cols.length + 1}
                  className="border-b border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold tracking-widest text-amber-400 uppercase"
                >
                  {g.caption}
                </td>
              </tr>
              {g.items.map(({ row, idx }) => (
                <tr key={idx} className="group border-b border-slate-700/40 hover:bg-slate-700/40">
                  <td className="truncate px-3 py-1.5 text-slate-200 group-hover:text-white">
                    {row.form_name}
                  </td>
                  {cols.map((c) => (
                    <td key={c} className="px-2 py-1.5 text-center">
                      <Chk
                        value={(row as any)[c]}
                        editable={editable}
                        onChange={(v) => update(idx, c, v)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="py-10 text-center text-slate-500 italic">No forms.</p>}
    </div>
  );
}

// ── Reports grid ──────────────────────────────────────────────────────────────
function ReportsGrid({
  rows,
  editable,
  onChange,
}: {
  rows: FormReportRow[];
  editable: boolean;
  onChange: (r: FormReportRow[]) => void;
}) {
  const update = (idx: number, col: string, val: boolean) =>
    onChange(rows.map((r, i) => (i === idx ? { ...r, [col]: val } : r)));
  return (
    <div className="overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="sticky top-0 z-10">
            <th className="w-72 border-b border-slate-600 bg-slate-800 px-3 py-2 text-left font-medium text-slate-300">
              Form
            </th>
            {['RView', 'RPrint', 'RExport'].map((c) => (
              <th
                key={c}
                className="w-16 border-b border-slate-600 bg-slate-800 px-2 py-2 text-center font-medium text-slate-300"
              >
                {c.replace('R', '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-700/40 hover:bg-slate-700/40">
              <td className="px-3 py-1.5 text-slate-200">{row.form_name}</td>
              {(['RView', 'RPrint', 'RExport'] as const).map((c) => (
                <td key={c} className="px-2 py-1.5 text-center">
                  <Chk value={row[c]} editable={editable} onChange={(v) => update(idx, c, v)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="py-10 text-center text-slate-500 italic">No reports.</p>}
    </div>
  );
}

// ── Others grid ───────────────────────────────────────────────────────────────
function OthersGrid({
  rows,
  editable,
  onChange,
}: {
  rows: FormOtherRow[];
  editable: boolean;
  onChange: (r: FormOtherRow[]) => void;
}) {
  const update = (idx: number, val: boolean) =>
    onChange(rows.map((r, i) => (i === idx ? { ...r, RRights: val } : r)));
  return (
    <div className="overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="sticky top-0 z-10">
            <th className="w-72 border-b border-slate-600 bg-slate-800 px-3 py-2 text-left font-medium text-slate-300">
              Form
            </th>
            <th className="w-16 border-b border-slate-600 bg-slate-800 px-2 py-2 text-center font-medium text-slate-300">
              Rights
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-700/40 hover:bg-slate-700/40">
              <td className="px-3 py-1.5 text-slate-200">{row.form_name}</td>
              <td className="px-2 py-1.5 text-center">
                <Chk value={row.RRights} editable={editable} onChange={(v) => update(idx, v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="py-10 text-center text-slate-500 italic">No other forms.</p>
      )}
    </div>
  );
}

// ── Specials grid (Form + Rights bit) ────────────────────────────────────────
function SpecialsGrid({
  rows,
  editable,
  onChange,
}: {
  rows: SpecialRow[];
  editable: boolean;
  onChange: (r: SpecialRow[]) => void;
}) {
  const toggle = (idx: number) =>
    onChange(rows.map((r, i) => (i === idx ? { ...r, Rights: !r.Rights } : r)));
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {rows.map((row, idx) => (
        <label
          key={idx}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all ${row.Rights ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-700 bg-slate-800'} ${!editable ? 'cursor-default opacity-70' : 'hover:border-slate-500'} `}
        >
          <input
            type="checkbox"
            checked={row.Rights}
            disabled={!editable}
            onChange={() => toggle(idx)}
            className="accent-emerald-500"
          />
          <span
            className={`truncate text-sm ${row.Rights ? 'text-emerald-300' : 'text-slate-300'}`}
          >
            {row.Form}
          </span>
        </label>
      ))}
      {rows.length === 0 && (
        <p className="col-span-full py-10 text-center text-slate-500 italic">No special flags.</p>
      )}
    </div>
  );
}

// ── Branches panel (fkSetId) ──────────────────────────────────────────────────
function BranchesPanel({
  rows,
  editable,
  onChange,
}: {
  rows: BranchRow[];
  editable: boolean;
  onChange: (r: BranchRow[]) => void;
}) {
  const [newId, setNewId] = useState('');
  const add = () => {
    const id = parseInt(newId);
    if (!isNaN(id)) {
      onChange([...rows, { fkSetId: id }]);
      setNewId('');
    }
  };
  const remove = (idx: number) => onChange(rows.filter((_, i) => i !== idx));
  return (
    <div className="space-y-3">
      {editable && (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Branch Set ID"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="w-48 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
          />
          <button
            onClick={add}
            className="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/30"
          >
            + Add
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200"
          >
            Set #{r.fkSetId ?? '—'}
            {editable && (
              <button onClick={() => remove(idx)} className="ml-1 text-red-400 hover:text-red-300">
                ✕
              </button>
            )}
          </div>
        ))}
        {rows.length === 0 && <p className="text-slate-500 italic">No branches assigned.</p>}
      </div>
    </div>
  );
}

// ── Dashboards panel (Id) ─────────────────────────────────────────────────────
function DashboardsPanel({
  rows,
  editable,
  onChange,
}: {
  rows: DashboardRow[];
  editable: boolean;
  onChange: (r: DashboardRow[]) => void;
}) {
  const [newId, setNewId] = useState('');
  const add = () => {
    const id = parseInt(newId);
    if (!isNaN(id)) {
      onChange([...rows, { Id: id }]);
      setNewId('');
    }
  };
  const remove = (idx: number) => onChange(rows.filter((_, i) => i !== idx));
  return (
    <div className="space-y-3">
      {editable && (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Dashboard ID"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="w-48 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
          />
          <button
            onClick={add}
            className="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/30"
          >
            + Add
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200"
          >
            Dashboard #{r.Id}
            {editable && (
              <button onClick={() => remove(idx)} className="ml-1 text-red-400 hover:text-red-300">
                ✕
              </button>
            )}
          </div>
        ))}
        {rows.length === 0 && <p className="text-slate-500 italic">No dashboards assigned.</p>}
      </div>
    </div>
  );
}

// ── Processes panel (fkProdId) ────────────────────────────────────────────────
function ProcessesPanel({
  rows,
  editable,
  onChange,
}: {
  rows: ProcessRow[];
  editable: boolean;
  onChange: (r: ProcessRow[]) => void;
}) {
  const [newId, setNewId] = useState('');
  const add = () => {
    const id = parseInt(newId);
    if (!isNaN(id)) {
      onChange([...rows, { fkProdId: id }]);
      setNewId('');
    }
  };
  const remove = (idx: number) => onChange(rows.filter((_, i) => i !== idx));
  return (
    <div className="space-y-3">
      {editable && (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Process/Product ID"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="w-48 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
          />
          <button
            onClick={add}
            className="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/30"
          >
            + Add
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200"
          >
            Product #{r.fkProdId ?? '—'}
            {editable && (
              <button onClick={() => remove(idx)} className="ml-1 text-red-400 hover:text-red-300">
                ✕
              </button>
            )}
          </div>
        ))}
        {rows.length === 0 && <p className="text-slate-500 italic">No processes assigned.</p>}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UserRightsPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [rights, setRights] = useState<UserRightsOut | null>(null);
  const [tab, setTab] = useState<Tab>('masters');
  const [editable, setEditable] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // editable local state
  const [masters, setMasters] = useState<FormRightRow[]>([]);
  const [transactions, setTransactions] = useState<FormRightRow[]>([]);
  const [reports, setReports] = useState<FormReportRow[]>([]);
  const [others, setOthers] = useState<FormOtherRow[]>([]);
  const [specials, setSpecials] = useState<SpecialRow[]>([]);
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [dashboards, setDashboards] = useState<DashboardRow[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [ownRecords, setOwnRecords] = useState(false);
  const [otherRecords, setOtherRecords] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.listUsers().then(setUsers).catch(console.error);
  }, []);

  const loadRights = useCallback(
    async (user: UserListItem) => {
      if (dirty && !confirm('Discard unsaved changes?')) return;
      setLoading(true);
      setEditable(false);
      setDirty(false);
      try {
        const data = await api.getUserRights(user.pkUserId);
        setRights(data);
        setMasters(data.masters);
        setTransactions(data.transactions);
        setReports(data.reports);
        setOthers(data.others);
        setSpecials(data.specials);
        setBranches(data.branches);
        setDashboards(data.dashboards);
        setProcesses(data.processes);
        setOwnRecords(data.user.OwnRecords);
        setOtherRecords(data.user.OtherRecords);
        setSelectedUser(user);
        setTab('masters');
      } catch (e: any) {
        showToast(e.message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [dirty],
  );

  const handleSave = async () => {
    if (!selectedUser) return;
    if (!confirm(`Save rights for ${selectedUser.UserName}?`)) return;
    setSaving(true);
    try {
      await api.saveUserRights({
        user_id: selectedUser.pkUserId,
        operator_id: OPERATOR_ID,
        own_records: ownRecords,
        other_records: otherRecords,
        masters,
        transactions,
        reports,
        others,
        specials,
        branches,
        dashboards,
        processes,
      });
      showToast(`Rights saved for ${selectedUser.UserName}`);
      setEditable(false);
      setDirty(false);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditable(false);
    setDirty(false);
    if (selectedUser) loadRights(selectedUser);
  };

  const filteredUsers = users.filter((u) =>
    u.UserName.toLowerCase().includes(search.toLowerCase()),
  );

  const mark = () => setDirty(true);

  return (
    <div className="flex min-h-screen bg-slate-950 font-mono text-slate-100">
      {/* ── Sidebar ── */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-4">
          <h1 className="text-lg font-bold tracking-tight text-amber-400">User Rights</h1>
          <p className="mt-0.5 text-xs text-slate-500">Access Control Manager</p>
        </div>
        <div className="border-b border-slate-800 p-3">
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filteredUsers.map((u) => (
            <button
              key={u.pkUserId}
              onClick={() => loadRights(u)}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                selectedUser?.pkUserId === u.pkUserId
                  ? 'border-r-2 border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold">
                {u.UserName[0]?.toUpperCase()}
              </span>
              <span className="truncate">{u.UserName}</span>
              {u.SysDefined && (
                <span className="ml-auto rounded bg-slate-700 px-1 py-0.5 text-[10px] text-slate-400">
                  SYS
                </span>
              )}
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-600">No users found</p>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-6 py-3">
          {selectedUser && !editable && (
            <button
              onClick={() => setEditable(true)}
              className="rounded-lg border border-blue-600/40 bg-blue-600/20 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-600/30"
            >
              ✎ Edit
            </button>
          )}
          {editable && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg border border-emerald-600/40 bg-emerald-600/20 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-600/30 disabled:opacity-50"
              >
                {saving ? 'Saving…' : '✓ Save'}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600"
              >
                ✕ Cancel
              </button>
            </>
          )}

          {selectedUser && (
            <div className="ml-auto flex items-center gap-2">
              {rights && (
                <div className="mr-3 flex gap-4 text-xs text-slate-400">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={ownRecords}
                      disabled={!editable}
                      onChange={(e) => {
                        setOwnRecords(e.target.checked);
                        mark();
                      }}
                      className="accent-amber-500"
                    />
                    Own Records
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={otherRecords}
                      disabled={!editable}
                      onChange={(e) => {
                        setOtherRecords(e.target.checked);
                        mark();
                      }}
                      className="accent-amber-500"
                    />
                    Edit Others
                  </label>
                </div>
              )}
              <span className="text-sm font-semibold text-amber-300">{selectedUser.UserName}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${editable ? 'border-blue-500/30 bg-blue-500/20 text-blue-300' : 'border-slate-600 bg-slate-700 text-slate-400'}`}
              >
                {editable ? 'EDIT' : 'VIEW'}
              </span>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="animate-pulse text-sm text-amber-400">Loading rights…</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !selectedUser && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl opacity-20">🔐</div>
              <p className="text-slate-500">Select a user to manage their rights.</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && selectedUser && rights && (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950 px-6 py-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors ${
                    tab === t.id
                      ? 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
                      : 'border border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-6">
              {tab === 'masters' && (
                <RightsGrid
                  rows={masters}
                  editable={editable}
                  showAuthorize={false}
                  onChange={(r) => {
                    setMasters(r);
                    mark();
                  }}
                />
              )}
              {tab === 'transactions' && (
                <RightsGrid
                  rows={transactions}
                  editable={editable}
                  showAuthorize={true}
                  onChange={(r) => {
                    setTransactions(r);
                    mark();
                  }}
                />
              )}
              {tab === 'reports' && (
                <ReportsGrid
                  rows={reports}
                  editable={editable}
                  onChange={(r) => {
                    setReports(r);
                    mark();
                  }}
                />
              )}
              {tab === 'others' && (
                <OthersGrid
                  rows={others}
                  editable={editable}
                  onChange={(r) => {
                    setOthers(r);
                    mark();
                  }}
                />
              )}
              {tab === 'specials' && (
                <SpecialsGrid
                  rows={specials}
                  editable={editable}
                  onChange={(r) => {
                    setSpecials(r);
                    mark();
                  }}
                />
              )}
              {tab === 'branches' && (
                <BranchesPanel
                  rows={branches}
                  editable={editable}
                  onChange={(r) => {
                    setBranches(r);
                    mark();
                  }}
                />
              )}
              {tab === 'dashboards' && (
                <DashboardsPanel
                  rows={dashboards}
                  editable={editable}
                  onChange={(r) => {
                    setDashboards(r);
                    mark();
                  }}
                />
              )}
              {tab === 'processes' && (
                <ProcessesPanel
                  rows={processes}
                  editable={editable}
                  onChange={(r) => {
                    setProcesses(r);
                    mark();
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 bottom-6 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl ${
            toast.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-900/90 text-emerald-200'
              : 'border-red-500/40 bg-red-900/90 text-red-200'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
