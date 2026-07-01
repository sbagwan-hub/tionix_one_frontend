import axiosClient from '@/lib/axios';
import { SalarySettingsData, PtSlab, TdsSlab } from './types';

// Slot mappings for accounts
const ACCOUNT_SLOT_MAP: { [key: number]: keyof SalarySettingsData } = {
  1: 'accountPt',
  2: 'accountPfEmployee',
  3: 'accountPfEmployer',
  4: 'accountPensionEmployer',
  5: 'accountDlisEmployer',
  6: 'accountPfAdmin',
  7: 'accountDlisAdmin',
  8: 'accountEsicEmployee',
  9: 'accountEsicEmployer',
  10: 'accountTds',
  11: 'accountNoticeRetentionOffice',
  12: 'accountNoticeRetentionWorker',
  13: 'accountNoticeRetentionContractor',
  14: 'accountSalaryOffice',
  15: 'accountSalaryWorker',
  16: 'accountSalaryContractor',
  17: 'accountAdvanceIssue',
  18: 'accountLoanIssue',
  19: 'accountAdvanceReturn',
  20: 'accountLoanReturn',
  21: 'accountInterest',
  22: 'accountIncentiveOffice',
  23: 'accountIncentiveWorker',
  24: 'accountIncentiveContractor',
  25: 'accountBonus',
  26: 'accountExgratia',
  27: 'accountGratuity',
  28: 'accountLwfEmployee',
  29: 'accountLwfEmployer'
};

const DEFAULT_SALARY_SETTINGS: SalarySettingsData = {
  pfBasicRate: 12,
  pfBasicLimit: 15000,
  pfEmployerShareRate: 3.67,
  pensionEmployerRate: 8.33,
  dlisEmployerRate: 0.5,
  pfAdminRate: 0.5,
  pfAdminMin: 75,
  dlisAdminRate: 0.01,
  dlisAdminMin: 75,
  esicGrossRate: 0.75,
  esicGrossLimit: 21000,
  esicEmployerRate: 3.25,
  bonusRate: 8.33,
  averageSalaryHours: 8,

  lwfMode: 'Half Yearly',
  lwfMonth1: 'June',
  lwfMonth2: 'December',
  lwfRule: 'Rule 1',
  lwfRule1Employee: 25,
  lwfRule1Employer: 50,
  lwfRule2UptoLimit: 3000,
  lwfRule2UptoEmployee: 0,
  lwfRule2UptoEmployer: 0,
  lwfRule2AboveEmployee: 0,
  lwfRule2AboveEmployer: 0,

  tdsTaxSlabsFor: 'General',
  tdsSlabs: [],
  tdsCessRate: 4,

  ptMaleSlabs: [],
  ptFemaleSlabs: [],

  accountPt: 'PROFESSION TAX',
  accountPfEmployee: 'PROVIDENT FUND',
  accountPfEmployer: 'PROVIDENT FUND',
  accountPensionEmployer: 'PROVIDENT FUND',
  accountDlisEmployer: 'PROVIDENT FUND',
  accountPfAdmin: 'PROVIDENT FUND',
  accountDlisAdmin: 'PROVIDENT FUND',
  accountEsicEmployee: 'ESIC',
  accountEsicEmployer: 'ESIC',
  accountTds: 'TDS ACCOUNT',
  accountNoticeRetentionOffice: 'SALARY',
  accountNoticeRetentionWorker: 'SALARY',
  accountNoticeRetentionContractor: 'SALARY',

  accountSalaryOffice: 'SALARY',
  accountSalaryWorker: 'SALARY',
  accountSalaryContractor: 'SALARY',
  accountAdvanceIssue: 'ADVANCE',
  accountLoanIssue: 'LOAN',
  accountAdvanceReturn: 'ADVANCE',
  accountLoanReturn: 'LOAN',
  accountInterest: 'INTEREST CHARGES',
  accountIncentiveOffice: 'SALARY',
  accountIncentiveWorker: 'SALARY',
  accountIncentiveContractor: 'SALARY',
  accountBonus: 'BONUS',
  accountExgratia: 'EXGRATIA',
  accountGratuity: 'GRATUITY',
  accountLwfEmployee: 'LABOUR WELFARE FUND',
  accountLwfEmployer: 'LABOUR WELFARE FUND'
};

export const salarySettingsApi = {
  getSalarySettings: async (): Promise<SalarySettingsData> => {
    // 1. Fetch from individual backend APIs
    const [acctRes, ptRes, tdsRes] = await Promise.all([
      axiosClient.get<{ success: boolean; data: any[] }>('/settings/salary-settings/salary-settings/account-settings'),
      axiosClient.get<{ success: boolean; data: any[] }>('/settings/salary-settings/salary-settings/pt'),
      axiosClient.get<{ success: boolean; data: any[] }>('/settings/salary-settings/salary-settings/tds')
    ]);

    // 2. Fetch local storage fallbacks for PF/ESIC/Bonus/LWF
    let localData: Partial<SalarySettingsData> = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tionix_salary_settings_local');
        if (stored) {
          localData = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to load local settings:', e);
      }
    }

    const settings: SalarySettingsData = {
      ...DEFAULT_SALARY_SETTINGS,
      ...localData
    };

    // 3. Map account settings slots to frontend keys
    if (acctRes.data?.success && Array.isArray(acctRes.data.data)) {
      acctRes.data.data.forEach((row) => {
        const key = ACCOUNT_SLOT_MAP[row.pk_set_id];
        if (key) {
          (settings as any)[key] = (row.fk_acct_id || '').trim();
        }
      });
    }

    // 4. Map Professional Tax slabs
    if (ptRes.data?.success && Array.isArray(ptRes.data.data)) {
      const ptSlabs: PtSlab[] = ptRes.data.data.map((row) => ({
        upto: Number(row.pt_from),
        to: row.pt_to ? Number(row.pt_to) : 999999,
        amount: Number(row.pt_per),
        month: 'February',
        monthAmount: row.pt_feb ? Number(row.pt_feb) : Number(row.pt_per),
        yearlyAmount: Number(row.pt_tot)
      }));
      settings.ptMaleSlabs = ptSlabs;
      settings.ptFemaleSlabs = JSON.parse(JSON.stringify(ptSlabs));
    }

    // 5. Map TDS Slabs
    if (tdsRes.data?.success && Array.isArray(tdsRes.data.data)) {
      // Filter by General or matching type
      const activeType = settings.tdsTaxSlabsFor || 'General';
      const typeSlabs = tdsRes.data.data.filter((row) => row.type === activeType);
      
      settings.tdsSlabs = typeSlabs.map((row) => ({
        upto: Number(row.it_from),
        to: row.it_to ? Number(row.it_to) : 999999,
        fixed: row.it_amt ? Number(row.it_amt) : 0,
        percent: Number(row.it_per)
      }));
    }

    return settings;
  },

  saveSalarySettings: async (payload: SalarySettingsData): Promise<void> => {
    // 1. Save local settings to localStorage
    if (typeof window !== 'undefined') {
      try {
        const localData = {
          pfBasicRate: payload.pfBasicRate,
          pfBasicLimit: payload.pfBasicLimit,
          pfEmployerShareRate: payload.pfEmployerShareRate,
          pensionEmployerRate: payload.pensionEmployerRate,
          dlisEmployerRate: payload.dlisEmployerRate,
          pfAdminRate: payload.pfAdminRate,
          pfAdminMin: payload.pfAdminMin,
          dlisAdminRate: payload.dlisAdminRate,
          dlisAdminMin: payload.dlisAdminMin,
          esicGrossRate: payload.esicGrossRate,
          esicGrossLimit: payload.esicGrossLimit,
          esicEmployerRate: payload.esicEmployerRate,
          bonusRate: payload.bonusRate,
          averageSalaryHours: payload.averageSalaryHours,
          lwfMode: payload.lwfMode,
          lwfMonth1: payload.lwfMonth1,
          lwfMonth2: payload.lwfMonth2,
          lwfRule: payload.lwfRule,
          lwfRule1Employee: payload.lwfRule1Employee,
          lwfRule1Employer: payload.lwfRule1Employer,
          lwfRule2UptoLimit: payload.lwfRule2UptoLimit,
          lwfRule2UptoEmployee: payload.lwfRule2UptoEmployee,
          lwfRule2UptoEmployer: payload.lwfRule2UptoEmployer,
          lwfRule2AboveEmployee: payload.lwfRule2AboveEmployee,
          lwfRule2AboveEmployer: payload.lwfRule2AboveEmployer,
          tdsTaxSlabsFor: payload.tdsTaxSlabsFor,
          tdsCessRate: payload.tdsCessRate
        };
        localStorage.setItem('tionix_salary_settings_local', JSON.stringify(localData));
      } catch (e) {
        console.error('Failed to save settings locally:', e);
      }
    }

    // 2. Prepare API calls
    const promises: Promise<any>[] = [];

    // Save account settings slots
    Object.entries(ACCOUNT_SLOT_MAP).forEach(([slotId, key]) => {
      const val = payload[key] as string;
      if (val) {
        promises.push(
          axiosClient.put(`/settings/salary-settings/salary-settings/account-settings/${slotId}`, {
            fk_acct_id: val
          })
        );
      }
    });

    // Save PT Slabs (Using Male slabs as source of truth for the singular PT settings table)
    if (Array.isArray(payload.ptMaleSlabs)) {
      const ptRows = payload.ptMaleSlabs.map((slab, index) => ({
        pk_id_pt: String(index + 1),
        pt_from: slab.upto,
        pt_to: slab.to || null,
        pt_per: slab.amount,
        pt_feb: slab.monthAmount || null,
        pt_tot: slab.yearlyAmount
      }));
      promises.push(
        axiosClient.put('/settings/salary-settings/salary-settings/pt', ptRows)
      );
    }

    // Save TDS Slabs
    if (Array.isArray(payload.tdsSlabs)) {
      const tdsType = payload.tdsTaxSlabsFor || 'General';
      const tdsRows = payload.tdsSlabs.map((slab, index) => ({
        pk_it_id: String(index + 1),
        type: tdsType,
        it_from: slab.upto,
        it_to: slab.to || null,
        it_amt: slab.fixed || null,
        it_per: slab.percent
      }));
      promises.push(
        axiosClient.put('/settings/salary-settings/salary-settings/tds', {
          type: tdsType,
          rows: tdsRows
        })
      );
    }

    await Promise.all(promises);
  }
};
