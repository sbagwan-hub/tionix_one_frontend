export interface AssetPartItem {
  pk_part_id?: number;
  fk_ast_id?: number;
  fk_prod_id: number;
  prod_code?: string;
  prod_name?: string;
  unit?: string;
  fk_unt_id?: number;
  description: string;
  quantity: number | string;
}

export interface Asset {
  pk_ast_id: number;
  asset_code: string;
  fk_acct_id: number;
  account: string;
  fk_prod_id: number;
  prod_code: string;
  prod_name: string;
  description: string;
  status: boolean;
  condition: string;
  exp_date?: string;
  sys_defined: boolean;
  last_status?: string;
  date_time_stamp?: string;
  username?: string;
  parts: AssetPartItem[];
}

export interface CreateAssetDto {
  asset_code: string;
  fk_acct_id: number;
  fk_prod_id: number;
  description: string;
  status: boolean;
  condition: string;
  exp_date?: string;
  parts: Array<{
    pk_part_id?: number;
    fk_prod_id: number;
    description: string;
    quantity: number;
  }>;
  additional_asset_codes?: string[];
}

export interface UpdateAssetDto {
  asset_code?: string;
  fk_acct_id?: number;
  fk_prod_id?: number;
  description?: string;
  status?: boolean;
  condition?: string;
  exp_date?: string | null;
  parts?: Array<{
    pk_part_id?: number;
    fk_prod_id: number;
    description: string;
    quantity: number;
  }>;
}

export interface AccountLookup {
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
