'use client';
// components/SpecialFlagsPanel.tsx

import { SpecialFlags } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FLAG_LABELS: { key: keyof SpecialFlags; label: string; group: string }[] = [
  { key: 'cb_pr', label: 'Purchase Return', group: 'Access Rights' },
  { key: 'cb_cr', label: 'Customer Return', group: 'Access Rights' },
  { key: 'cb_sr', label: 'Sales Return', group: 'Access Rights' },
  { key: 'cb_ur', label: 'User Right', group: 'Access Rights' },
  { key: 'cb_c_rating', label: 'Customer Rating', group: 'Ratings' },
  { key: 'cb_s_rating', label: 'Supplier Rating', group: 'Ratings' },
  { key: 'cb_cpr', label: 'Customer Price', group: 'Pricing' },
  { key: 'cb_spr', label: 'Supplier Price', group: 'Pricing' },
  { key: 'cb_account', label: 'Account', group: 'Masters' },
  { key: 'cb_employee', label: 'Employee', group: 'Masters' },
  { key: 'cb_job_entry', label: 'Job Entry', group: 'Masters' },
  { key: 'cb_tax_invoice', label: 'Tax Invoice', group: 'Transactions' },
  { key: 'cb_sec', label: 'SEC', group: 'Transactions' },
  { key: 'cb_order_acceptance', label: 'Order Acceptance', group: 'Transactions' },
  { key: 'cb_authorizer', label: 'Authorizer', group: 'Transactions' },
  { key: 'cb_pm', label: 'Project Manager', group: 'Transactions' },
  { key: 'cb_sapo', label: 'SA Purchase Order', group: 'Purchase' },
  { key: 'cb_sapr', label: 'SA Purchase Return', group: 'Purchase' },
  { key: 'cb_sl', label: 'Stock Ledger', group: 'Stock' },
  { key: 'cb_open_close_unreceived', label: 'Open/Close Unreceived', group: 'Stock' },
];

interface Props {
  flags: SpecialFlags;
  editable: boolean;
  onChange: (f: SpecialFlags) => void;
  ownRecords: boolean;
  otherRecords: boolean;
  onOwnRecordsChange: (v: boolean) => void;
  onOtherRecordsChange: (v: boolean) => void;
}

export default function SpecialFlagsPanel({
  flags,
  editable,
  onChange,
  ownRecords,
  otherRecords,
  onOwnRecordsChange,
  onOtherRecordsChange,
}: Props) {
  const toggle = (key: keyof SpecialFlags) => {
    if (!editable) return;
    onChange({ ...flags, [key]: !flags[key] });
  };

  const groups = Array.from(new Set(FLAG_LABELS.map((f) => f.group)));

  return (
    <div className="space-y-6">
      {/* Record access radio */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-amber-400 uppercase">
          Record Access
        </h3>
        <RadioGroup
          value={ownRecords ? 'own' : 'all'}
          onValueChange={(v) => onOwnRecordsChange(v === 'own')}
          className="flex gap-6"
        >
          <label className={`flex items-center gap-2 ${!editable ? 'opacity-60' : ''}`}>
            <RadioGroupItem value="all" disabled={!editable} />
            <span className="text-sm text-slate-200">All Records</span>
          </label>
          <label className={`flex items-center gap-2 ${!editable ? 'opacity-60' : ''}`}>
            <RadioGroupItem value="own" disabled={!editable} />
            <span className="text-sm text-slate-200">Own Records Only</span>
          </label>
        </RadioGroup>
        <label
          className={`mt-3 flex cursor-pointer items-center gap-2 ${!editable ? 'opacity-60' : ''}`}
        >
          <Checkbox
            checked={otherRecords}
            disabled={!editable}
            onCheckedChange={(v) => onOtherRecordsChange(!!v)}
          />
          <span className="text-sm text-slate-200">{`Edit/Delete Other Users' Records`}</span>
        </label>
      </div>

      {/* Special permission flags */}
      {groups.map((group) => (
        <div key={group} className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-amber-400 uppercase">
            {group}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FLAG_LABELS.filter((f) => f.group === group).map(({ key, label }) => (
              <label
                key={key}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${flags[key] ? 'border border-emerald-500/30 bg-emerald-500/10' : 'border border-transparent'} ${editable ? 'cursor-pointer hover:bg-slate-700' : 'opacity-70'} `}
              >
                <Checkbox
                  checked={!!flags[key]}
                  disabled={!editable}
                  onCheckedChange={() => toggle(key)}
                />
                <span className={`text-sm ${flags[key] ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
