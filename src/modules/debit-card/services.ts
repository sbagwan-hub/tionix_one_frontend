import axiosClient from '@/lib/axios';
import { DebitCard } from './types';

export const debitCardApi = {
  list: async (params?: Record<string, any>): Promise<DebitCard[]> => {
    const res = await axiosClient.get<{ data: { items: any[] } | any[] }>('/master/account/debit-card', { params });
    const rawData = res.data.data;
    return Array.isArray(rawData) ? rawData : (rawData as any)?.items || [];
  },

  get: async (id: number | string): Promise<DebitCard> => {
    const res = await axiosClient.get<{ data: any }>(`/master/account/debit-card/${id}`);
    return res.data.data;
  },

  create: async (body: any): Promise<DebitCard> => {
    const res = await axiosClient.post<{ data: any }>('/master/account/debit-card', body);
    return res.data.data;
  },

  update: async (id: number | string, body: any): Promise<DebitCard> => {
    const res = await axiosClient.put<{ data: any }>(`/master/account/debit-card/${id}`, body);
    return res.data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/debit-card/${id}`);
  },
};
