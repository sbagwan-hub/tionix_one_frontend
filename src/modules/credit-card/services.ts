import axiosClient from '@/lib/axios';
import { CreditCard } from './types';

export interface CreditCardLookups {
  banks: Array<{ pk_cont_id: number; contact_name: string; address: string | null }>;
  holders: Array<{ pk_cont_id: number; contact_name: string; address: string | null }>;
  groups: Array<{ pk_grp_id: number; group_name: string; fk_prt_id: number | null }>;
}

export const creditCardApi = {
  list: async (params?: Record<string, any>): Promise<CreditCard[]> => {
    const res = await axiosClient.get<{ data: { items: any[] } | any[] }>(
      '/master/account/credit-card',
      { params },
    );
    const rawData = res.data.data;
    const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
    return items.map((item: any) => ({
      ...item,
      expiry_date: item.expiry_date ? item.expiry_date.split('T')[0] : '',
    }));
  },

  get: async (id: number | string): Promise<CreditCard> => {
    const res = await axiosClient.get<{ data: any }>(`/master/account/credit-card/${id}`);
    const item = res.data.data;
    return {
      ...item,
      expiry_date: item.expiry_date ? item.expiry_date.split('T')[0] : '',
    };
  },

  create: async (body: any): Promise<CreditCard> => {
    const payload = {
      fk_b_com_id: Number(body.fk_b_com_id),
      fk_h_com_id: Number(body.fk_h_com_id),
      credit_card_no: body.credit_card_no,
      account_code: body.account_code,
      account: body.account,
      group_name: body.group_name,
      cgst_no: body.cgst_no,
      opening_balance: Number(body.opening_balance || 0),
      credit_limit: body.credit_limit ? Number(body.credit_limit) : null,
      cash_advance: body.cash_advance ? Number(body.cash_advance) : null,
      expiry_date: body.expiry_date ? new Date(body.expiry_date).toISOString() : null,
      state_from: body.state_from ? Number(body.state_from) : null,
      state_to: body.state_to ? Number(body.state_to) : null,
      payment_day: body.payment_day ? Number(body.payment_day) : null,
      sync: body.sync,
      sys_defined: body.sys_defined,
    };
    const res = await axiosClient.post<{ data: any }>('/master/account/credit-card', payload);
    return res.data.data;
  },

  update: async (id: number | string, body: any): Promise<CreditCard> => {
    const payload = {
      fk_b_com_id: Number(body.fk_b_com_id),
      fk_h_com_id: Number(body.fk_h_com_id),
      credit_card_no: body.credit_card_no,
      account_code: body.account_code,
      account: body.account,
      group_name: body.group_name,
      cgst_no: body.cgst_no,
      opening_balance: Number(body.opening_balance || 0),
      credit_limit: body.credit_limit ? Number(body.credit_limit) : null,
      cash_advance: body.cash_advance ? Number(body.cash_advance) : null,
      expiry_date: body.expiry_date ? new Date(body.expiry_date).toISOString() : null,
      state_from: body.state_from ? Number(body.state_from) : null,
      state_to: body.state_to ? Number(body.state_to) : null,
      payment_day: body.payment_day ? Number(body.payment_day) : null,
      sync: body.sync,
      sys_defined: body.sys_defined,
    };
    const res = await axiosClient.put<{ data: any }>(`/master/account/credit-card/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/credit-card/${id}`);
  },

  lookups: async (): Promise<CreditCardLookups> => {
    const res = await axiosClient.get<{ data: CreditCardLookups }>(
      '/master/account/credit-card/lookups',
    );
    return res.data.data;
  },
};
