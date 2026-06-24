import axiosClient from '@/lib/axios';
import { BankAccount, CreateBankAccountDto, UpdateBankAccountDto, HolderDetail } from './types';

// Helper to look up contact ID by name for bank or holder
async function findContactIdByName(name: string | undefined, type: 'I' | 'O'): Promise<number | null> {
  if (!name) return null;
  try {
    const endpoint = type === 'O' ? '/master/bank-accounts/lookups/banks' : '/master/bank-accounts/lookups/individuals';
    const res = await axiosClient.get<{ data: Array<{ pkContId: string; contactName: string }> }>(endpoint);
    const list = res.data.data || [];
    const found = list.find((c) => c.contactName.toLowerCase() === name.toLowerCase());
    return found ? parseInt(found.pkContId, 10) : (list[0] ? parseInt(list[0].pkContId, 10) : null);
  } catch (e) {
    console.error('Error looking up contact by name:', e);
    return null;
  }
}

// Mapper from backend ListItem/Detail to frontend BankAccount
const mapToFrontend = (item: any): BankAccount => {
  const holder_details: HolderDetail[] = [];
  if (item.fkH1ComId && item.holderName1) {
    holder_details.push({ id: String(item.fkH1ComId), name: item.holderName1, client_id: item.h1ClientId ?? '' });
  }
  if (item.fkH2ComId && item.holderName2) {
    holder_details.push({ id: String(item.fkH2ComId), name: item.holderName2, client_id: item.h2ClientId ?? '' });
  }
  if (item.fkH3ComId && item.holderName3) {
    holder_details.push({ id: String(item.fkH3ComId), name: item.holderName3, client_id: item.h3ClientId ?? '' });
  }
  if (item.fkH4ComId && item.holderName4) {
    holder_details.push({ id: String(item.fkH4ComId), name: item.holderName4, client_id: item.h4ClientId ?? '' });
  }

  return {
    pk_bank_acct_id: isNaN(parseInt(item.pkBanId, 10)) ? item.pkBanId : parseInt(item.pkBanId, 10),
    bank_name: item.bankName ?? '',
    account_no: item.accountNo ?? '',
    rtgs_neft_ifsc: item.rtgsNeftIfsc ?? '',
    account_type: item.accountType ?? '',
    account_code: item.acctCode ?? '',
    bank_account_name: item.account ?? '',
    fk_grp_id: item.fkGrpId ?? 0,
    group_name: item.groupName ?? '',
    opening_balance: parseFloat(item.openBal ?? '0'),
    opening_balance_sec: parseFloat(item.sOpenBal ?? '0'),
    gst_no: item.cgstNo ?? '',
    holder_details,
    nominee: item.nominee ?? '',
    sys_defined: item.sysDefined ?? false,
    date_time_stamp: item.dateTimeStamp ?? '',
    fk_user_id: item.fkUserId ?? '',
    last_status: item.lastStatus ?? '',
  };
};

// Local storage key for fallback/mock data
const STORAGE_KEY = 'tionix_bank_accounts';

const getLocalData = (): BankAccount[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Seed some initial mock data
    const initial: BankAccount[] = [
      {
        pk_bank_acct_id: 1,
        bank_name: 'State Bank of India',
        account_no: '33214567890',
        rtgs_neft_ifsc: 'SBIN0001234',
        account_type: 'Current Account',
        account_code: 'SBI-CUR-01',
        bank_account_name: 'SBI Main A/C',
        fk_grp_id: 33, // Example group ID
        group_name: 'Bank OD A/C',
        opening_balance: 150000.0,
        opening_balance_sec: 1800.0,
        gst_no: '27AAAAA1111A1Z1',
        holder_details: [
          { id: '1', name: 'Ramesh P', client_id: 'CLI001' },
          { id: '2', name: 'Suresh K', client_id: 'CLI002' },
        ],
        nominee: 'Sunita P',
        sys_defined: false,
        date_time_stamp: new Date().toISOString(),
      },
      {
        pk_bank_acct_id: 2,
        bank_name: 'HDFC Bank',
        account_no: '5010022334455',
        rtgs_neft_ifsc: 'HDFC0000012',
        account_type: 'Savings Account',
        account_code: 'HDFC-SAV-02',
        bank_account_name: 'HDFC Savings',
        fk_grp_id: 34,
        group_name: 'Fixed Deposit',
        opening_balance: 75000.5,
        opening_balance_sec: 0.0,
        gst_no: '27BBBBB2222B2Z2',
        holder_details: [
          { id: '1', name: 'Ramesh P', client_id: 'CLI001' },
        ],
        nominee: 'Amit P',
        sys_defined: false,
        date_time_stamp: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const saveLocalData = (data: BankAccount[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const bankAccountApi = {
  list: async (params?: Record<string, any>): Promise<BankAccount[]> => {
    try {
      const backendParams: Record<string, any> = {};
      if (params) {
        if (params.bank_name) backendParams.bankName = params.bank_name;
        if (params.account_no) backendParams.accountNo = params.account_no;
        if (params.page) backendParams.page = String(params.page);
        if (params.pageSize) backendParams.pageSize = String(params.pageSize);
      }
      const res = await axiosClient.get<{ data: { items: any[] } | any[] }>('/master/bank-accounts', { params: backendParams });
      const rawData = res.data.data;
      const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
      return items.map(mapToFrontend);
    } catch (error) {
      console.warn('Backend API not available, falling back to local storage:', error);
      let list = getLocalData();
      if (params?.bank_name) {
        list = list.filter((b) => b.bank_name.toLowerCase().includes(params.bank_name.toLowerCase()));
      }
      if (params?.account_no) {
        list = list.filter((b) => b.account_no.includes(params.account_no));
      }
      return list;
    }
  },

  get: async (id: number | string): Promise<BankAccount> => {
    try {
      const res = await axiosClient.get<{ data: any }>(`/master/bank-accounts/${id}`);
      return mapToFrontend(res.data.data);
    } catch (error) {
      const list = getLocalData();
      const found = list.find((b) => b.pk_bank_acct_id === id || String(b.pk_bank_acct_id) === String(id));
      if (!found) throw new Error('Bank account not found');
      return found;
    }
  },

  create: async (body: CreateBankAccountDto): Promise<BankAccount> => {
    try {
      const fkBComId = await findContactIdByName(body.bank_name, 'O');
      const fkH1ComId = await findContactIdByName(body.holder_details?.[0]?.name, 'I');
      const fkH2ComId = body.holder_details?.[1]?.name ? await findContactIdByName(body.holder_details[1].name, 'I') : null;
      const fkH3ComId = body.holder_details?.[2]?.name ? await findContactIdByName(body.holder_details[2].name, 'I') : null;
      const fkH4ComId = body.holder_details?.[3]?.name ? await findContactIdByName(body.holder_details[3].name, 'I') : null;
      const fkNComId = body.nominee ? await findContactIdByName(body.nominee, 'I') : null;

      const backendBody = {
        acctCode: body.account_code,
        account: body.bank_account_name,
        fkGrpId: body.fk_grp_id,
        cgstNo: body.gst_no ?? '',
        openBal: body.opening_balance ?? 0,
        sOpenBal: body.opening_balance_sec ?? 0,
        fkBComId: fkBComId ? String(fkBComId) : '',
        accountNo: body.account_no,
        rtgsNeftIfsc: body.rtgs_neft_ifsc ?? '',
        accountType: body.account_type,
        fkH1ComId: fkH1ComId ? String(fkH1ComId) : '',
        h1ClientId: body.holder_details?.[0]?.client_id ?? '',
        fkH2ComId: fkH2ComId ? String(fkH2ComId) : undefined,
        h2ClientId: body.holder_details?.[1]?.client_id ?? '',
        fkH3ComId: fkH3ComId ? String(fkH3ComId) : undefined,
        h3ClientId: body.holder_details?.[2]?.client_id ?? '',
        fkH4ComId: fkH4ComId ? String(fkH4ComId) : undefined,
        h4ClientId: body.holder_details?.[3]?.client_id ?? '',
        fkNComId: fkNComId ? String(fkNComId) : undefined,
      };

      const res = await axiosClient.post<{ data: any }>('/master/bank-accounts', backendBody);
      return mapToFrontend(res.data.data);
    } catch (error) {
      const list = getLocalData();
      const newId = list.length > 0 ? Math.max(...list.map((b) => typeof b.pk_bank_acct_id === 'number' ? b.pk_bank_acct_id : 0)) + 1 : 1;
      const newRecord: BankAccount = {
        ...body,
        pk_bank_acct_id: newId,
        sys_defined: false,
        date_time_stamp: new Date().toISOString(),
        sync: 'N',
      };
      const updatedList = [...list, newRecord];
      saveLocalData(updatedList);
      return newRecord;
    }
  },

  update: async (id: number | string, body: UpdateBankAccountDto): Promise<BankAccount> => {
    try {
      const fkBComId = body.bank_name ? await findContactIdByName(body.bank_name, 'O') : undefined;
      const fkH1ComId = body.holder_details?.[0]?.name ? await findContactIdByName(body.holder_details[0].name, 'I') : undefined;
      const fkH2ComId = body.holder_details?.[1]?.name ? await findContactIdByName(body.holder_details[1].name, 'I') : undefined;
      const fkH3ComId = body.holder_details?.[2]?.name ? await findContactIdByName(body.holder_details[2].name, 'I') : undefined;
      const fkH4ComId = body.holder_details?.[3]?.name ? await findContactIdByName(body.holder_details[3].name, 'I') : undefined;
      const fkNComId = body.nominee ? await findContactIdByName(body.nominee, 'I') : undefined;

      const backendBody: Record<string, any> = {};
      if (body.account_code !== undefined) backendBody.acctCode = body.account_code;
      if (body.bank_account_name !== undefined) backendBody.account = body.bank_account_name;
      if (body.fk_grp_id !== undefined) backendBody.fkGrpId = body.fk_grp_id;
      if (body.gst_no !== undefined) backendBody.cgstNo = body.gst_no;
      if (body.opening_balance !== undefined) backendBody.openBal = body.opening_balance;
      if (body.opening_balance_sec !== undefined) backendBody.sOpenBal = body.opening_balance_sec;
      if (fkBComId !== undefined) backendBody.fkBComId = fkBComId ? String(fkBComId) : '';
      if (body.account_no !== undefined) backendBody.accountNo = body.account_no;
      if (body.rtgs_neft_ifsc !== undefined) backendBody.rtgsNeftIfsc = body.rtgs_neft_ifsc;
      if (body.account_type !== undefined) backendBody.accountType = body.account_type;

      if (body.holder_details) {
        if (fkH1ComId !== undefined) backendBody.fkH1ComId = fkH1ComId ? String(fkH1ComId) : '';
        if (body.holder_details[0]?.client_id !== undefined) backendBody.h1ClientId = body.holder_details[0].client_id;
        if (fkH2ComId !== undefined) backendBody.fkH2ComId = fkH2ComId ? String(fkH2ComId) : null;
        if (body.holder_details[1]?.client_id !== undefined) backendBody.h2ClientId = body.holder_details[1].client_id;
        if (fkH3ComId !== undefined) backendBody.fkH3ComId = fkH3ComId ? String(fkH3ComId) : null;
        if (body.holder_details[2]?.client_id !== undefined) backendBody.h3ClientId = body.holder_details[2].client_id;
        if (fkH4ComId !== undefined) backendBody.fkH4ComId = fkH4ComId ? String(fkH4ComId) : null;
        if (body.holder_details[3]?.client_id !== undefined) backendBody.h4ClientId = body.holder_details[3].client_id;
      }
      if (fkNComId !== undefined) backendBody.fkNComId = fkNComId ? String(fkNComId) : null;

      const res = await axiosClient.put<{ data: any }>(`/master/bank-accounts/${id}`, backendBody);
      return mapToFrontend(res.data.data);
    } catch (error) {
      const list = getLocalData();
      const index = list.findIndex((b) => b.pk_bank_acct_id === id || String(b.pk_bank_acct_id) === String(id));
      if (index === -1) throw new Error('Bank account not found');
      const updatedRecord: BankAccount = {
        ...list[index],
        ...body,
        date_time_stamp: new Date().toISOString(),
      };
      const updatedList = [...list];
      updatedList[index] = updatedRecord;
      saveLocalData(updatedList);
      return updatedRecord;
    }
  },

  remove: async (id: number | string): Promise<void> => {
    try {
      await axiosClient.delete(`/master/bank-accounts/${id}`);
    } catch (error) {
      const list = getLocalData();
      const updatedList = list.filter((b) => b.pk_bank_acct_id !== id && String(b.pk_bank_acct_id) !== String(id));
      saveLocalData(updatedList);
    }
  },
};
