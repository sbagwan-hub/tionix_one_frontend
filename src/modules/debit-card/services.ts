import axiosClient from '@/lib/axios';
import { DebitCard } from './types';

export const debitCardApi = {
  list: async (params?: Record<string, any>): Promise<DebitCard[]> => {
    const res = await axiosClient.get<{ data: { items: any[] } | any[] }>(
      '/master/account/debit-card',
      { params },
    );
    const rawData = res.data.data;
    const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
    return items.map((item: any) => ({
      ...item,
      fk_ban_id: item.fk_b_acct_id,
      fk_h_com_id: item.fk_h_com_id,
      expiry_date: item.expiry ? item.expiry.split('T')[0] : '',
    }));
  },

  get: async (id: number | string): Promise<DebitCard> => {
    const res = await axiosClient.get<{ data: any }>(`/master/account/debit-card/${id}`);
    const item = res.data.data;
    return {
      ...item,
      fk_ban_id: item.fk_b_acct_id,
      fk_h_com_id: item.fk_h_com_id,
      expiry_date: item.expiry ? item.expiry.split('T')[0] : '',
    };
  },

  create: async (body: any): Promise<DebitCard> => {
    const payload = {
      fk_b_acct_id: Number(body.fk_ban_id),
      fk_h_com_id: Number(body.fk_h_com_id),
      debit_card_no: body.card_no,
      expiry: body.expiry_date || null,
      sync: body.sync,
      sys_defined: body.sys_defined,
    };
    const res = await axiosClient.post<{ data: any }>('/master/account/debit-card', payload);
    return res.data.data;
  },

  update: async (id: number | string, body: any): Promise<DebitCard> => {
    const payload = {
      fk_b_acct_id: Number(body.fk_ban_id),
      fk_h_com_id: Number(body.fk_h_com_id),
      debit_card_no: body.card_no,
      expiry: body.expiry_date || null,
      sync: body.sync,
      sys_defined: body.sys_defined,
    };
    const res = await axiosClient.put<{ data: any }>(`/master/account/debit-card/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/debit-card/${id}`);
  },

  listBankAccounts: async (): Promise<Array<{ pk_acct_id: number; account: string }>> => {
    const res = await axiosClient.get<{ data: any[] }>(
      '/master/account/debit-card/common/bank-accounts',
    );
    return res.data.data || [];
  },

  listHolders: async (
    bankAccountId: number,
  ): Promise<Array<{ pk_cont_id: number; contact_name: string }>> => {
    const res = await axiosClient.get<{ data: any[] }>(
      '/master/account/debit-card/common/holders',
      {
        params: { bankAccountId },
      },
    );
    return res.data.data || [];
  },
};
