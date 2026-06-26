import axiosClient from '@/lib/axios';
import { ChequeBook } from './types';

const mapToFrontend = (item: any): ChequeBook => {
  return {
    pk_chq_id: item.pk_rec_id,
    fk_ban_id: item.fk_b_acct_id,
    bank_account_name: item.account ?? '',
    start_no: item.cheque_from,
    end_no: item.cheque_to,
    total_cheques: item.total_cheques,
    date_issue: item.date_of_issue ?? '',
    sync: item.sync ?? 'N',
    sys_defined: item.sys_defined ?? false,
    date_time_stamp: item.date_time_stamp ?? '',
    fk_user_id: item.fk_user_id ?? '',
    last_status: item.last_status ?? '',
  };
};

const mapToBackend = (body: any): any => {
  return {
    fk_b_acct_id: String(body.fk_ban_id),
    cheque_from: Number(body.start_no),
    cheque_to: Number(body.end_no),
    date_of_issue: body.date_issue || undefined,
  };
};

export const chequeBookApi = {
  list: async (params?: Record<string, any>): Promise<ChequeBook[]> => {
    const backendParams: Record<string, any> = {};
    if (params) {
      if (params.account) backendParams.account = params.account;
      if (params.start_no) backendParams.cheque_from = String(params.start_no);
      if (params.end_no) backendParams.cheque_to = String(params.end_no);
      if (params.date_issue) backendParams.date_of_issue = params.date_issue;
      if (params.page) backendParams.page = String(params.page);
      if (params.pageSize) backendParams.pageSize = String(params.pageSize);
    }
    const res = await axiosClient.get<{ data: { items: any[] } | any[] }>('/master/account/cheque-book', { params: backendParams });
    const rawData = res.data.data;
    const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
    return items.map(mapToFrontend);
  },

  get: async (id: number | string): Promise<ChequeBook> => {
    const res = await axiosClient.get<{ data: any }>(`/master/account/cheque-book/${id}`);
    return mapToFrontend(res.data.data);
  },

  create: async (body: any): Promise<ChequeBook> => {
    const backendBody = mapToBackend(body);
    const res = await axiosClient.post<{ data: any }>('/master/account/cheque-book', backendBody);
    return mapToFrontend(res.data.data);
  },

  update: async (id: number | string, body: any): Promise<ChequeBook> => {
    const backendBody = mapToBackend(body);
    const res = await axiosClient.put<{ data: any }>(`/master/account/cheque-book/${id}`, backendBody);
    return mapToFrontend(res.data.data);
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/cheque-book/${id}`);
  },
};
