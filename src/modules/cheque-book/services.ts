import axiosClient from '@/lib/axios';
import { ChequeBook } from './types';

const STORAGE_KEY = 'tionix_cheque_books';

const getLocalData = (): ChequeBook[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: ChequeBook[] = [
      {
        pk_chq_id: 1,
        fk_ban_id: 1,
        bank_account_name: 'SBI Main A/C',
        start_no: 100001,
        end_no: 100025,
        total_cheques: 25,
        date_issue: '2026-06-01',
        sync: 'N',
        sys_defined: false,
        date_time_stamp: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const saveLocalData = (data: ChequeBook[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const chequeBookApi = {
  list: async (params?: Record<string, any>): Promise<ChequeBook[]> => {
    try {
      const res = await axiosClient.get<{ data: { items: any[] } | any[] }>('/master/account/cheque-book', { params });
      const rawData = res.data.data;
      const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
      return items;
    } catch (error) {
      console.warn('Cheque book API fallback to local storage:', error);
      let list = getLocalData();
      return list;
    }
  },

  get: async (id: number | string): Promise<ChequeBook> => {
    try {
      const res = await axiosClient.get<{ data: any }>(`/master/account/cheque-book/${id}`);
      return res.data.data;
    } catch (error) {
      const list = getLocalData();
      const found = list.find((c) => c.pk_chq_id === id || String(c.pk_chq_id) === String(id));
      if (!found) throw new Error('Cheque book not found');
      return found;
    }
  },

  create: async (body: any): Promise<ChequeBook> => {
    try {
      const res = await axiosClient.post<{ data: any }>('/master/account/cheque-book', body);
      return res.data.data;
    } catch (error) {
      const list = getLocalData();
      const newId = list.length > 0 ? Math.max(...list.map((c) => typeof c.pk_chq_id === 'number' ? c.pk_chq_id : 0)) + 1 : 1;
      const newRecord: ChequeBook = {
        ...body,
        pk_chq_id: newId,
        sys_defined: false,
        date_time_stamp: new Date().toISOString(),
        sync: 'N',
      };
      const updatedList = [...list, newRecord];
      saveLocalData(updatedList);
      return newRecord;
    }
  },

  update: async (id: number | string, body: any): Promise<ChequeBook> => {
    try {
      const res = await axiosClient.put<{ data: any }>(`/master/account/cheque-book/${id}`, body);
      return res.data.data;
    } catch (error) {
      const list = getLocalData();
      const index = list.findIndex((c) => c.pk_chq_id === id || String(c.pk_chq_id) === String(id));
      if (index === -1) throw new Error('Cheque book not found');
      const updatedRecord: ChequeBook = {
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
      await axiosClient.delete(`/master/account/cheque-book/${id}`);
    } catch (error) {
      const list = getLocalData();
      const updatedList = list.filter((c) => c.pk_chq_id !== id && String(c.pk_chq_id) !== String(id));
      saveLocalData(updatedList);
    }
  },
};
