export interface ContactDetail {
  id: string;
  type: string; // Phone, Fax, E-Mail
  detail: string;
}

export interface RelativeDetail {
  id: string;
  relative_name: string;
  relationship: string;
  marital_status: string;
  dob?: string;
  qualification?: string;
  occupation?: string;
  school_allowance?: string;
}

export interface LicenseDetail {
  id: string;
  certificate_name: string;
  has_original?: boolean;
  valid_until?: string;
  fk_dt_id?: number;
  doc_file?: string | null;
}

export interface EmployeeRecord {
  pk_emp_id: number;
  emp_code: string;
  employee: string;
  doj: string;
  gender: string;
  marital_status: string;
  p_address: string;
  n_address: string;
  account_no: string;
  pf_no: string;
  esic_no: string;
  pan_no: string;
  blood_grp: string;
  wp: string;
  aadhar: string;
  username: string;
  password?: string;
  question: string;
  answer: string;
  messaging: boolean;
  geolocation: boolean;
  type: string;
  att_type: boolean;
  sb: boolean;
  rtgs: string;
  s_address: string;
  last_status: string;
  date_time_stamp: string;

  // Optional setup relations/metrics
  fk_tit_id?: number | null;
  dob?: string;
  photo?: string | null;
  fk_qual_id?: number | null;
  anni?: string;
  fk_dep_id?: number | null;
  fk_deg_id?: number | null;
  fk_bnk_id?: number | null;
  dol?: string;
  cv_copy?: string;
  le_copy?: string;
  fk_m_doc_id?: number | null;
  ext?: string;
  sync?: string;
  sys_defined?: boolean;
  fk_user_id?: number;
  fk_set_id?: number | null;
  height?: number;
  weight?: number;
  fk_rg_id?: number | null;
  fk_cs_id?: number | null;
  fk_st_id?: number | null;
  mark?: string;
  experience?: string;
  fk_r_emp_id?: number | null;
  police?: string;
  add_police?: string;
  cont_police?: string;
  fk_w1_emp_id?: number | null;
  fk_w2_emp_id?: number | null;
  personality1?: string;
  fk_p1_des_id?: number | null;
  p1_address?: string;
  p1_contact?: string;
  personality2?: string;
  fk_p2_des_id?: number | null;
  p2_address?: string;
  p2_contact?: string;
  fk_acct_id?: number | null;
  inform_pf?: boolean;
  inform_esic?: boolean;
  employment?: string;

  contacts?: ContactDetail[];
  relatives?: RelativeDetail[];
  licenses?: LicenseDetail[];

  mobile?: string;
  alt_mobile?: string;
  email?: string;
}

export interface EmployeeFilterParams {
  employee?: string;
  emp_code?: string;
  department?: string;
  designation?: string;
  page?: number;
  pageSize?: number;
}
