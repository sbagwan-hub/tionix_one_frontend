export interface UserRecord {
  pk_user_id: number;
  username: string;
  employee: string | null;
  mobile: string | null;
  last_status: string | null;
  date_time_stamp: string;
  creator: string | null;
  fk_emp_id: number | null;
  fk_ec_id: number | null;
  email: string | null;
  answer: string | null;
  security_question_id: number | null;
  security_question: string | null;
}

export interface EmployeeLookup {
  pk_emp_id: number;
  contact_name: string;
  emp_code: string;
}

export interface EmailConfigLookup {
  pk_ec_id: number;
  from_email: string;
}

export interface SecurityQuestionLookup {
  pk_question_id: number;
  questions: string;
}

export interface UserFilterParams {
  username?: string;
  employee?: string;
  creator?: string;
  last_status?: string;
  date_time_stamp?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateUserPayload {
  username: string;
  password?: string;
  fk_emp_id?: number | null;
  fk_ec_id?: number | null;
  answer?: string | null;
  mobile?: string | null;
  security_question_id?: number | null;
  security_question?: string | null;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  fk_emp_id?: number | null;
  fk_ec_id?: number | null;
  answer?: string | null;
  mobile?: string | null;
  security_question_id?: number | null;
  security_question?: string | null;
}
