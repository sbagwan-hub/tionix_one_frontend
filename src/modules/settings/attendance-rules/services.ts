import axiosClient from '@/lib/axios';
import { AttendanceRuleRecord, AttendanceRuleResponse, AttendanceRuleListResponse } from './types';

export const attendanceRulesApi = {
  listRules: async (params?: { page?: number; page_size?: number; search?: string }): Promise<AttendanceRuleRecord[]> => {
    const res = await axiosClient.get<AttendanceRuleListResponse>('/settings/attendance-rules/temp-table', { params });
    return res.data.data || [];
  },

  getRule: async (id: number): Promise<AttendanceRuleRecord | null> => {
    try {
      const res = await axiosClient.get<AttendanceRuleResponse>(`/settings/attendance-rules/temp-table/${id}`);
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  createRule: async (payload: { id: number; temp_fields: string; temp_fields2?: string | null }): Promise<AttendanceRuleRecord> => {
    const res = await axiosClient.post<AttendanceRuleResponse>('/settings/attendance-rules/temp-table', payload);
    return res.data.data;
  },

  updateRule: async (args: { id: number; payload: { temp_fields: string; temp_fields2?: string | null } }): Promise<AttendanceRuleRecord> => {
    const res = await axiosClient.put<AttendanceRuleResponse>(`/settings/attendance-rules/temp-table/${args.id}`, args.payload);
    return res.data.data;
  },
};
