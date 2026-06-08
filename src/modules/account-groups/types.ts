export interface AcctGroup {
  pk_grp_id: number;
  group_name: string;
  fk_prt_id: number;
  fk_main_id: number;
  fk_sub_id: number;
  grouping: number;
  prefix: string;
  dc: 'DR' | 'CR' | 'D' | 'C';
  sync: 'N' | 'C' | 'E';
  sys_defined: boolean;
  date_time_stamp: string;
  fk_user_id: string;
  last_status: string;
  parent_name?: string;
  username?: string;
}

export interface TreeNode extends AcctGroup {
  children: TreeNode[];
}

export interface CreateAcctGroupDto {
  pk_grp_id?: number;
  group_name: string;
  fk_prt_id: number;
  grouping: number;
  prefix: string;
  dc: 'DR' | 'CR' | 'D' | 'C';
  sync?: 'N' | 'C' | 'E';
  sys_defined?: boolean;
  fk_user_id: string;
}

export interface UpdateAcctGroupDto {
  group_name?: string;
  fk_prt_id?: number;
  sync?: 'N' | 'C' | 'E';
  fk_user_id?: string;
}
