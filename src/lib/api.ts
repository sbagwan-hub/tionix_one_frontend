// lib/api.ts – typed API client matching the exact FastAPI backend

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (json && typeof json === 'object' && 'data' in json) return json.data as T;
  return json as T;
}

// ── User list ─────────────────────────────────────────────────────────────────
export interface UserListItem {
  pkUserId: number;
  UserName: string;
  SysDefined: boolean;
}

// ── Form rows ─────────────────────────────────────────────────────────────────
export interface FormRightRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  RAdd: boolean;
  REdit: boolean;
  RDelete: boolean;
  RView: boolean;
  RPrint: boolean;
  RExport: boolean;
  RAuthorize: boolean;
}

export interface FormReportRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  RView: boolean;
  RPrint: boolean;
  RExport: boolean;
}

export interface FormOtherRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  RRights: boolean;
}

// ── Special / Branch / Dashboard / Process ────────────────────────────────────
export interface SpecialRow {
  Form: string;
  Rights: boolean;
}

export interface BranchRow {
  fkSetId: number | null;
}

export interface DashboardRow {
  Id: number;
}

export interface ProcessRow {
  fkProdId: number | null;
}

export interface SelectionRow {
  name: string;
  selected: boolean;
}

export interface SpecialFlags {
  cb_pr: boolean;
  cb_cr: boolean;
  cb_sr: boolean;
  cb_ur: boolean;
  cb_c_rating: boolean;
  cb_s_rating: boolean;
  cb_cpr: boolean;
  cb_spr: boolean;
  cb_account: boolean;
  cb_employee: boolean;
  cb_job_entry: boolean;
  cb_tax_invoice: boolean;
  cb_sec: boolean;
  cb_order_acceptance: boolean;
  cb_authorizer: boolean;
  cb_pm: boolean;
  cb_sapo: boolean;
  cb_sapr: boolean;
  cb_sl: boolean;
  cb_open_close_unreceived: boolean;
}

// ── User detail ───────────────────────────────────────────────────────────────
export interface UserOut {
  pkUserId: number;
  UserName: string;
  SysDefined: boolean;
  OwnRecords: boolean;
  OtherRecords: boolean;
}

// ── Full rights payload ───────────────────────────────────────────────────────
export interface UserRightsOut {
  user: UserOut;
  masters: FormRightRow[];
  transactions: FormRightRow[];
  reports: FormReportRow[];
  others: FormOtherRow[];
  specials: SpecialRow[];
  branches: BranchRow[];
  dashboards: DashboardRow[];
  processes: ProcessRow[];
}

// ── Save payload ──────────────────────────────────────────────────────────────
export interface SaveUserRightsIn {
  user_id: number;
  operator_id: number;
  own_records: boolean;
  other_records: boolean;
  masters: FormRightRow[];
  transactions: FormRightRow[];
  reports: FormReportRow[];
  others: FormOtherRow[];
  specials: SpecialRow[];
  branches: BranchRow[];
  dashboards: DashboardRow[];
  processes: ProcessRow[];
}

export const api = {
  listUsers: () => req<UserListItem[]>('/user-rights/users'),

  getUserRights: (userId: number) => req<UserRightsOut>(`/user-rights/${userId}`),

  saveUserRights: (payload: SaveUserRightsIn) =>
    req<void>('/user-rights', { method: 'POST', body: JSON.stringify(payload) }),
};
