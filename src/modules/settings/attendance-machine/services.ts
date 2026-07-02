import axiosClient from '@/lib/axios';
import { AttendanceMachine } from './types';

export const attendanceMachineApi = {
  list: async (params?: Record<string, any>): Promise<AttendanceMachine[]> => {
    const res = await axiosClient.get<{ data: { data: any[] } | any[] }>(
      '/settings/attendance-machines',
      { params }
    );
    const rawData = res.data.data;
    const items = Array.isArray(rawData) ? rawData : (rawData as any)?.data || [];
    return items;
  },

  get: async (id: number | string): Promise<AttendanceMachine> => {
    const res = await axiosClient.get<{ data: any }>(`/settings/attendance-machines/${id}`);
    return res.data.data;
  },

  create: async (body: any): Promise<AttendanceMachine> => {
    const payload = {
      code: body.code,
      ip: body.ip,
      port: Number(body.port),
      in_out: body.in_out,
    };
    const res = await axiosClient.post<{ data: any }>('/settings/attendance-machines', payload);
    return res.data.data;
  },

  update: async (id: number | string, body: any): Promise<AttendanceMachine> => {
    const payload = {
      code: body.code,
      ip: body.ip,
      port: Number(body.port),
      in_out: body.in_out,
    };
    const res = await axiosClient.put<{ data: any }>(`/settings/attendance-machines/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/settings/attendance-machines/${id}`);
  },
};
