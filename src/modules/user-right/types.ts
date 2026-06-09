export interface UserListItem {
  pk_user_id: number;
  username: string;
  sys_defined: boolean;
}

export interface UserOut {
  pk_user_id: number;
  username: string;
  sys_defined: boolean;
  own_records: boolean;
  other_records: boolean;
}

export interface FormRightRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  add: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  print: boolean;
  export: boolean;
  authorize: boolean;
}

export interface FormReportRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  view: boolean;
  print: boolean;
  export: boolean;
}

export interface FormOtherRow {
  form_name: string;
  module_name: string;
  module_caption: string;
  module_id: number;
  form_id: number;
  rights: boolean;
}

export interface SpecialRow {
  form: string;
  rights: boolean;
}

export interface BranchRow {
  fk_set_id: number;
}

export interface DashboardRow {
  id: number;
}

export interface ProcessRow {
  fk_prod_id: string;
}

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

export interface CreateNewFormIn {
  form_name: string;
  category: 'master' | 'transaction' | 'report' | 'other';
  prefix?: string | null | undefined;
  last_id?: string | null | undefined;
  start_with?: string | null | undefined;
  len?: string | null | undefined;
  module_name: string;
  module_caption?: string | null | undefined;
  news?: boolean | null | undefined;
}

// Default / empty row factories
export const emptyRightRow = (overrides?: Partial<FormRightRow>): FormRightRow => ({
  form_name: '',
  module_name: '',
  module_caption: '',
  module_id: 0,
  form_id: 0,
  add: false,
  edit: false,
  delete: false,
  view: false,
  print: false,
  export: false,
  authorize: false,
  ...overrides,
});

export const emptyReportRow = (overrides?: Partial<FormReportRow>): FormReportRow => ({
  form_name: '',
  module_name: '',
  module_caption: '',
  module_id: 0,
  form_id: 0,
  view: false,
  print: false,
  export: false,
  ...overrides,
});

export const emptyOtherRow = (overrides?: Partial<FormOtherRow>): FormOtherRow => ({
  form_name: '',
  module_name: '',
  module_caption: '',
  module_id: 0,
  form_id: 0,
  rights: false,
  ...overrides,
});

export const emptySavePayload = (userId: number, operatorId: number): SaveUserRightsIn => ({
  user_id: userId,
  operator_id: operatorId,
  own_records: false,
  other_records: false,
  masters: [],
  transactions: [],
  reports: [],
  others: [],
  specials: [],
  branches: [],
  dashboards: [],
  processes: [],
});
