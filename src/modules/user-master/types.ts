export interface User {
  pk_user_id: number;
  username: string;
  password?: string;
  answer?: string;
  security_question?: string;
  sal?: string;
  sync?: string;
  sys_defined?: boolean;
  datetime_stamp?: string;
  fk_user_id?: number;
  last_status?: string;
  fk_ec_id?: string;
  own_records?: boolean;
  other_records?: boolean;
  mobile?: string;
  fk_emp_id?: string;
}

export interface UserCreateInput {
  username: string;
  password: string;
  answer: string;
  security_question: string;
  sal?: string;
  sys_defined?: boolean;
  fk_user_id?: number;
  last_status?: string;
  fk_ec_id?: string;
  own_records?: boolean;
  other_records?: boolean;
  mobile?: string;
  fk_emp_id?: string;
}

export interface UserUpdateInput extends Partial<UserCreateInput> {}
