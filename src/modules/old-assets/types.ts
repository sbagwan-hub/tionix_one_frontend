export interface OldAsset {
  pk_ast_id: number;
  asset_code: string;
  description: string;
  fk_acct_id: number;
  a_account: string;
  fk_s_acct_id: number | null;
  account: string | null;
  fk_prod_id: number;
  prod_code: string;
  prod_name: string;
  pur_date: string;
  pur_rate: string | number;
  invoice_no: string;
  serial_no: string;
  fk_loc_id: number;
  location: string;
  fk_cat_id: number | null;
  p_category: string | null;
  fk_brd_id: number | null;
  brand: string | null;
  p_size: string;
  cat_no: string;
  exp_date: string | null;
  cur_value: string | number | null;
  usage: string;
  condition: string;
  c_location: string;
  c_person: string;
  c_details: string;
  c_address: string;
  issued_date: string | null;
  remarks: string;
  status: boolean;
  last_status: string;
  username: string | null;
  sys_defined?: boolean;
}

export interface CreateOldAssetDto {
  asset_code: string;
  description: string;
  fk_acct_id: number;
  fk_s_acct_id?: number | null;
  fk_prod_id: number;
  status: boolean;
  pur_date: string;
  pur_rate: number;
  invoice_no?: string;
  serial_no?: string;
  fk_loc_id: number;
  fk_cat_id?: number | null;
  p_size?: string;
  fk_brd_id?: number | null;
  cat_no?: string;
  exp_date?: string | null;
  cur_value?: number | null;
  usage?: string;
  condition?: string;
  c_location?: string;
  c_person?: string;
  c_details?: string;
  c_address?: string;
  issued_date?: string | null;
  remarks?: string;
}

export type UpdateOldAssetDto = Partial<CreateOldAssetDto>;

export interface AccountLookup {
  pk_acct_id: number;
  acct_code: string;
  account: string;
  group_name: string;
}

export interface SupplierLookup {
  pk_acct_id: number;
  acct_code: string;
  account: string;
  group_name: string;
}

export interface ProductLookup {
  pk_prod_id: number;
  prod_code: string;
  prod_name: string;
  unit: string;
  fk_unt_id: number;
  nonmoving: boolean;
}

export interface BrandLookup {
  pk_brd_id: number;
  brand: string;
}

export interface CategoryLookup {
  pk_p_cat_id: number;
  p_category: string;
}

export interface LocationLookup {
  pk_loc_id: number;
  location: string;
}
