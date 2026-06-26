import axiosClient from '@/lib/axios';
import { DebitCard } from './types';

const STORAGE_KEY = 'tionix_debit_cards';

const getLocalData = (): DebitCard[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial: DebitCard[] = [
      {
        pk_deb_id: 1,
        fk_ban_id: 1,
        bank_account_name: 'SBI Main A/C',
        card_no: '4591234567890123',
        holder_name: 'Ramesh P',
        expiry_date: '2028-12-31',
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

const saveLocalData = (data: DebitCard[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const debitCardApi = {
  list: async (params?: Record<string, any>): Promise<DebitCard[]> => {
    try {
      const res = await axiosClient.get<{ data: { items: any[] } | any[] }>('/master/account/debit-card', { params });
      const rawData = res.data.data;
      const items = Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
      return items;
    } catch (error) {
      console.warn('Debit card API fallback to local storage:', error);
      let list = getLocalData();
      if (params?.card_no) {
        list = list.filter((c) => c.card_no.includes(params.card_no));
      }
      return list;
    }
  },

  get: async (id: number | string): Promise<DebitCard> => {
    try {
      const res = await axiosClient.get<{ data: any }>(`/master/account/debit-card/${id}`);
      return res.data.data;
    } catch (error) {
      const list = getLocalData();
      const found = list.find((c) => c.pk_deb_id === id || String(c.pk_deb_id) === String(id));
      if (!found) throw new Error('Debit card not found');
      return found;
    }
  },

  create: async (body: any): Promise<DebitCard> => {
    try {
      const res = await axiosClient.post<{ data: any }>('/master/account/debit-card', body);
      return res.data.data;
    } catch (error) {
      const list = getLocalData();
      const newId = list.length > 0 ? Math.max(...list.map((c) => typeof c.pk_deb_id === 'number' ? c.pk_deb_id : 0)) + 1 : 1;
      const newRecord: DebitCard = {
        ...body,
        pk_deb_id: newId,
        sys_defined: false,
        date_time_stamp: new Date().toISOString(),
        sync: 'N',
      };
      const updatedList = [...list, newRecord];
      saveLocalData(updatedList);
      return newRecord;
    }
  },

  update: async (id: number | string, body: any): Promise<DebitCard> => {
    try {
      const res = await axiosClient.put<{ data: any }>(`/master/account/debit-card/${id}`, body);
      return res.data.data;
    } catch (error) {
      const list = getLocalData();
      const index = list.findIndex((c) => c.pk_deb_id === id || String(c.pk_deb_id) === String(id));
      if (index === -1) throw new Error('Debit card not found');
      const updatedRecord: DebitCard = {
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
      await axiosClient.delete(`/master/account/debit-card/${id}`);
    } catch (error) {
      const list = getLocalData();
      const updatedList = list.filter((c) => c.pk_deb_id !== id && String(c.pk_deb_id) !== String(id));
      saveLocalData(updatedList);
    }
  },
};
