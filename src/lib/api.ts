// lib/api.ts – typed API client for the FastAPI backend

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
  return res.json();
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface UserListItem {
  pk_user_id: string;
  user_name: string;
}

export interface FormRightRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  r_add: boolean | null;
  r_edit: boolean | null;
  r_delete: boolean | null;
  r_view: boolean | null;
  r_print: boolean | null;
  r_export: boolean | null;
  r_authorize?: boolean | null;
}

export interface FormReportRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  r_view: boolean | null;
  r_print: boolean | null;
  r_export: boolean | null;
}

export interface FormOtherRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  r_rights: boolean | null;
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

export interface SelectionRow {
  name: string;
  selected: boolean;
}

export interface UserOut {
  pk_user_id: string;
  user_name: string;
  sys_defined: boolean;
  own_records: boolean;
  other_records: boolean;
}

export interface UserRightsOut {
  user: UserOut;
  masters: FormRightRow[];
  transactions: FormRightRow[];
  reports: FormReportRow[];
  others: FormOtherRow[];
  specials: SpecialFlags;
  units: SelectionRow[];
  dashboards: SelectionRow[];
  processes: SelectionRow[];
}

export interface SaveUserRightsIn {
  user_id: string;
  operator_id: string;
  own_records: boolean;
  other_records: boolean;
  masters: {
    form_name: string;
    r_add: boolean | null;
    r_edit: boolean | null;
    r_delete: boolean | null;
    r_view: boolean | null;
    r_print: boolean | null;
    r_export: boolean | null;
  }[];
  transactions: {
    form_name: string;
    r_add: boolean | null;
    r_edit: boolean | null;
    r_delete: boolean | null;
    r_view: boolean | null;
    r_print: boolean | null;
    r_export: boolean | null;
    r_authorize: boolean | null;
  }[];
  reports: {
    form_name: string;
    r_view: boolean | null;
    r_print: boolean | null;
    r_export: boolean | null;
  }[];
  others: { form_name: string; r_rights: boolean | null }[];
  specials: SpecialFlags;
  units: SelectionRow[];
  dashboards: SelectionRow[];
  processes: SelectionRow[];
}

// ── Endpoints ────────────────────────────────────────────────────────────────
export const api = {
  listUsers: () => req<UserListItem[]>('/users'),
  getUserRights: (userId: string) => req<UserRightsOut>(`/user-rights/${userId}`),
  saveUserRights: (payload: SaveUserRightsIn) =>
    req<void>('/user-rights', { method: 'POST', body: JSON.stringify(payload) }),
};
