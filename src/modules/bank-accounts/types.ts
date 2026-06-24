export interface HolderDetail {
  id: string;
  name: string;
  client_id: string;
}

export interface BankAccount {
  pk_bank_acct_id: number | string;
  bank_name: string;
  account_no: string;
  rtgs_neft_ifsc: string;
  account_type: 'Current Account' | 'Savings Account' | 'Cash Credit' | 'Overdraft' | string;
  account_code: string;
  bank_account_name: string;
  fk_grp_id: number;
  group_name?: string;
  opening_balance: number;
  opening_balance_sec: number;
  gst_no: string;
  holder_details: HolderDetail[];
  nominee: string;
  sync?: 'N' | 'C' | 'E';
  sys_defined?: boolean;
  date_time_stamp?: string;
  fk_user_id?: string;
  last_status?: string;
}

export interface CreateBankAccountDto {
  bank_name: string;
  account_no: string;
  rtgs_neft_ifsc: string;
  account_type: string;
  account_code: string;
  bank_account_name: string;
  fk_grp_id: number;
  opening_balance: number;
  opening_balance_sec: number;
  gst_no: string;
  holder_details: HolderDetail[];
  nominee: string;
  fk_user_id?: string;
}

export interface UpdateBankAccountDto {
  bank_name?: string;
  account_no?: string;
  rtgs_neft_ifsc?: string;
  account_type?: string;
  account_code?: string;
  bank_account_name?: string;
  fk_grp_id?: number;
  opening_balance?: number;
  opening_balance_sec?: number;
  gst_no?: string;
  holder_details?: HolderDetail[];
  nominee?: string;
  fk_user_id?: string;
}
