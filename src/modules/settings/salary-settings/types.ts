export interface TdsSlab {
  upto: number;
  to: number;
  fixed: number;
  percent: number;
}

export interface PtSlab {
  upto: number;
  to: number;
  amount: number;
  month: string;
  monthAmount: number;
  yearlyAmount: number;
}

export interface SalarySettingsData {
  // 1. Provident Fund, ESIC and Bonus
  pfBasicRate: number;
  pfBasicLimit: number;
  pfEmployerShareRate: number;
  pensionEmployerRate: number;
  dlisEmployerRate: number;
  pfAdminRate: number;
  pfAdminMin: number;
  dlisAdminRate: number;
  dlisAdminMin: number;
  esicGrossRate: number;
  esicGrossLimit: number;
  esicEmployerRate: number;
  bonusRate: number;
  averageSalaryHours: number;

  // 2. Labour Welfare Fund
  lwfMode: string;
  lwfMonth1: string;
  lwfMonth2: string;
  lwfRule: string;
  lwfRule1Employee: number;
  lwfRule1Employer: number;
  lwfRule2UptoLimit: number;
  lwfRule2UptoEmployee: number;
  lwfRule2UptoEmployer: number;
  lwfRule2AboveEmployee: number;
  lwfRule2AboveEmployer: number;

  // 3. TDS
  tdsTaxSlabsFor: string;
  tdsSlabs: TdsSlab[];
  tdsCessRate: number;

  // 4. Professional Tax
  ptMaleSlabs: PtSlab[];
  ptFemaleSlabs: PtSlab[];

  // 5. Transaction Accounts I
  accountPt: string;
  accountPfEmployee: string;
  accountPfEmployer: string;
  accountPensionEmployer: string;
  accountDlisEmployer: string;
  accountPfAdmin: string;
  accountDlisAdmin: string;
  accountEsicEmployee: string;
  accountEsicEmployer: string;
  accountTds: string;
  accountNoticeRetentionOffice: string;
  accountNoticeRetentionWorker: string;
  accountNoticeRetentionContractor: string;

  // 6. Transaction Accounts II
  accountSalaryOffice: string;
  accountSalaryWorker: string;
  accountSalaryContractor: string;
  accountAdvanceIssue: string;
  accountLoanIssue: string;
  accountAdvanceReturn: string;
  accountLoanReturn: string;
  accountInterest: string;
  accountIncentiveOffice: string;
  accountIncentiveWorker: string;
  accountIncentiveContractor: string;
  accountBonus: string;
  accountExgratia: string;
  accountGratuity: string;
  accountLwfEmployee: string;
  accountLwfEmployer: string;
}
export type SalarySettingsTabType =
  | 'pf-esic-bonus'
  | 'lwf'
  | 'tds'
  | 'pt'
  | 'accounts-one'
  | 'accounts-two';
