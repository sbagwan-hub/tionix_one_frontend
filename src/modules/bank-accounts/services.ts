import axiosClient from '@/lib/axios';
import { BankAccount, CreateBankAccountDto, UpdateBankAccountDto, HolderDetail } from './types';

// Helper to look up contact ID by name for bank or holder
async function findContactIdByName(
  name: string | undefined,
  type: 'I' | 'O',
): Promise<number | null> {
  if (!name) return null;
  const endpoint =
    type === 'O'
      ? '/master/contacts/individuals/common/dropdown?type=O'
      : '/master/contacts/individuals/common/dropdown?type=I';
  const res = await axiosClient.get<{ data: any[] }>(endpoint);
  const list = res.data.data || [];
  const found = list.find((c) => {
    const cName = c.contactName || c.contact_name || c.bank_account_name;
    return cName?.toLowerCase() === name.toLowerCase();
  });
  const foundId = found
    ? found.pkContId || found.pk_cont_id || found.pk_ban_id
    : list[0]
      ? list[0].pkContId || list[0].pk_cont_id || list[0].pk_ban_id
      : null;
  return foundId ? parseInt(foundId, 10) : null;
}

// Mapper from backend ListItem/Detail to frontend BankAccount
const mapToFrontend = (item: any): BankAccount => {
  const holder_details: HolderDetail[] = [];
  if (item.fk_h1_com_id && item.holder_name_1) {
    holder_details.push({
      id: String(item.fk_h1_com_id),
      name: item.holder_name_1,
      client_id: item.h1_client_id ?? '',
    });
  }
  if (item.fk_h2_com_id && item.holder_name_2) {
    holder_details.push({
      id: String(item.fk_h2_com_id),
      name: item.holder_name_2,
      client_id: item.h2_client_id ?? '',
    });
  }
  if (item.fk_h3_com_id && item.holder_name_3) {
    holder_details.push({
      id: String(item.fk_h3_com_id),
      name: item.holder_name_3,
      client_id: item.h3_client_id ?? '',
    });
  }
  if (item.fk_h4_com_id && item.holder_name_4) {
    holder_details.push({
      id: String(item.fk_h4_com_id),
      name: item.holder_name_4,
      client_id: item.h4_client_id ?? '',
    });
  }

  return {
    pk_ban_id: isNaN(parseInt(item.pk_ban_id, 10)) ? item.pk_ban_id : parseInt(item.pk_ban_id, 10),
    bank_name: item.bank_name ?? '',
    account_no: item.account_no ?? '',
    rtgs_neft_ifsc: item.rtgs_neft_ifsc ?? '',
    account_type: item.account_type ?? '',
    account_code: item.acct_code ?? '',
    bank_account_name: item.account ?? '',
    fk_grp_id: item.fk_grp_id ?? 0,
    group_name: item.group_name ?? '',
    opening_balance: parseFloat(item.open_bal ?? '0'),
    opening_balance_sec: parseFloat(item.s_open_bal ?? '0'),
    gst_no: item.cgst_no ?? '',
    holder_details,
    nominee: item.nominee ?? '',
    sys_defined: item.sys_defined ?? false,
    date_time_stamp: item.date_time_stamp ?? '',
    fk_user_id: item.fk_user_id ?? '',
    last_status: item.last_status ?? '',
  };
};

export const bankAccountApi = {
  list: async (params?: Record<string, any>): Promise<BankAccount[]> => {
    const backendParams: Record<string, any> = {};
    if (params) {
      if (params.bank_name) backendParams.bankName = params.bank_name;
      if (params.account_no) backendParams.accountNo = params.account_no;
      if (params.page) backendParams.page = String(params.page);
      if (params.pageSize) backendParams.pageSize = String(params.pageSize);
    }
    const res = await axiosClient.get<{ data: { items: any[] } | any[] }>(
      '/master/account/bank-account',
      { params: backendParams },
    );
    const rawData = res.data.data;
    const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
    return items.map(mapToFrontend);
  },

  get: async (id: number | string): Promise<BankAccount> => {
    const res = await axiosClient.get<{ data: any }>(`/master/account/bank-account/${id}`);
    return mapToFrontend(res.data.data);
  },

  create: async (body: CreateBankAccountDto): Promise<BankAccount> => {
    const fkBComId = await findContactIdByName(body.bank_name, 'O');
    const fkH1ComId = await findContactIdByName(body.holder_details?.[0]?.name, 'I');
    const fkH2ComId = body.holder_details?.[1]?.name
      ? await findContactIdByName(body.holder_details[1].name, 'I')
      : null;
    const fkH3ComId = body.holder_details?.[2]?.name
      ? await findContactIdByName(body.holder_details[2].name, 'I')
      : null;
    const fkH4ComId = body.holder_details?.[3]?.name
      ? await findContactIdByName(body.holder_details[3].name, 'I')
      : null;
    const fkNComId = body.nominee ? await findContactIdByName(body.nominee, 'I') : null;

    const backendBody = {
      acct_code: body.account_code,
      account: body.bank_account_name,
      fk_grp_id: body.fk_grp_id,
      cgst_no: body.gst_no ?? '',
      open_bal: body.opening_balance ?? 0,
      s_open_bal: body.opening_balance_sec ?? 0,
      fk_b_com_id: fkBComId ? String(fkBComId) : '',
      account_no: body.account_no,
      rtgs_neft_ifsc: body.rtgs_neft_ifsc ?? '',
      account_type: body.account_type,
      fk_h1_com_id: fkH1ComId ? String(fkH1ComId) : '',
      h1_client_id: body.holder_details?.[0]?.client_id ?? '',
      fk_h2_com_id: fkH2ComId ? String(fkH2ComId) : undefined,
      h2_client_id: body.holder_details?.[1]?.client_id ?? '',
      fk_h3_com_id: fkH3ComId ? String(fkH3ComId) : undefined,
      h3_client_id: body.holder_details?.[2]?.client_id ?? '',
      fk_h4_com_id: fkH4ComId ? String(fkH4ComId) : undefined,
      h4_client_id: body.holder_details?.[3]?.client_id ?? '',
      fk_n_com_id: fkNComId ? String(fkNComId) : undefined,
    };

    const res = await axiosClient.post<{ data: any }>('/master/account/bank-account', backendBody);
    return mapToFrontend(res.data.data);
  },

  update: async (id: number | string, body: UpdateBankAccountDto): Promise<BankAccount> => {
    const fkBComId = body.bank_name ? await findContactIdByName(body.bank_name, 'O') : undefined;
    const fkH1ComId = body.holder_details?.[0]?.name
      ? await findContactIdByName(body.holder_details[0].name, 'I')
      : undefined;
    const fkH2ComId = body.holder_details?.[1]?.name
      ? await findContactIdByName(body.holder_details[1].name, 'I')
      : undefined;
    const fkH3ComId = body.holder_details?.[2]?.name
      ? await findContactIdByName(body.holder_details[2].name, 'I')
      : undefined;
    const fkH4ComId = body.holder_details?.[3]?.name
      ? await findContactIdByName(body.holder_details[3].name, 'I')
      : undefined;
    const fkNComId = body.nominee ? await findContactIdByName(body.nominee, 'I') : undefined;

    const backendBody: Record<string, any> = {};
    if (body.account_code !== undefined) backendBody.acct_code = body.account_code;
    if (body.bank_account_name !== undefined) backendBody.account = body.bank_account_name;
    if (body.fk_grp_id !== undefined) backendBody.fk_grp_id = body.fk_grp_id;
    if (body.gst_no !== undefined) backendBody.cgst_no = body.gst_no;
    if (body.opening_balance !== undefined) backendBody.open_bal = body.opening_balance;
    if (body.opening_balance_sec !== undefined) backendBody.s_open_bal = body.opening_balance_sec;
    if (fkBComId !== undefined) backendBody.fk_b_com_id = fkBComId ? String(fkBComId) : '';
    if (body.account_no !== undefined) backendBody.account_no = body.account_no;
    if (body.rtgs_neft_ifsc !== undefined) backendBody.rtgs_neft_ifsc = body.rtgs_neft_ifsc;
    if (body.account_type !== undefined) backendBody.account_type = body.account_type;

    if (body.holder_details) {
      if (fkH1ComId !== undefined) backendBody.fk_h1_com_id = fkH1ComId ? String(fkH1ComId) : '';
      if (body.holder_details[0]?.client_id !== undefined)
        backendBody.h1_client_id = body.holder_details[0].client_id;
      if (fkH2ComId !== undefined) backendBody.fk_h2_com_id = fkH2ComId ? String(fkH2ComId) : null;
      if (body.holder_details[1]?.client_id !== undefined)
        backendBody.h2_client_id = body.holder_details[1].client_id;
      if (fkH3ComId !== undefined) backendBody.fk_h3_com_id = fkH3ComId ? String(fkH3ComId) : null;
      if (body.holder_details[2]?.client_id !== undefined)
        backendBody.h3_client_id = body.holder_details[2].client_id;
      if (fkH4ComId !== undefined) backendBody.fk_h4_com_id = fkH4ComId ? String(fkH4ComId) : null;
      if (body.holder_details[3]?.client_id !== undefined)
        backendBody.h4_client_id = body.holder_details[3].client_id;
    }
    if (fkNComId !== undefined) backendBody.fk_n_com_id = fkNComId ? String(fkNComId) : null;

    const res = await axiosClient.put<{ data: any }>(
      `/master/account/bank-account/${id}`,
      backendBody,
    );
    return mapToFrontend(res.data.data);
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/bank-account/${id}`);
  },

  listIndividuals: async (): Promise<Array<{ pk_cont_id: number; contact_name: string }>> => {
    const res = await axiosClient.get<{ data: any[] }>(
      '/master/contacts/individuals/common/dropdown',
      { params: { type: 'I' } },
    );
    return res.data.data || [];
  },

  listOrganizations: async (): Promise<Array<{ pk_cont_id: number; contact_name: string }>> => {
    const res = await axiosClient.get<{ data: any[] }>(
      '/master/contacts/individuals/common/dropdown',
      { params: { type: 'O' } },
    );
    return res.data.data || [];
  },
};
