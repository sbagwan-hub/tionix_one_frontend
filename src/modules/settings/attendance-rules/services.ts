import axiosClient from '@/lib/axios';
import {
  AttendanceRuleRecord,
  AttendanceRuleResponse,
  AttendanceRuleListResponse,
  AttendanceRules,
} from './types';

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

  // Aggregate endpoints
  getAttendanceRules: async (): Promise<AttendanceRules> => {
    const res = await axiosClient.get<{ success: boolean; data: AttendanceRules }>('/settings/attendance-rules/attendance-rules');
    return res.data.data;
  },

  saveAttendanceRules: async (payload: AttendanceRules): Promise<void> => {
    await axiosClient.put('/settings/attendance-rules/attendance-rules', payload);
  },

  getEditRights: async (params: { userId: string; isAdmin?: boolean }): Promise<boolean> => {
    const res = await axiosClient.get<{ success: boolean; data: { canEdit: boolean } }>('/settings/attendance-rules/attendance-rules/rights', { params });
    return res.data.data.canEdit;
  },

  getDefaultRules: async (): Promise<Pick<AttendanceRules, 'rule3Bands' | 'rule4' | 'rule5' | 'rule6'>> => {
    const res = await axiosClient.get<{ success: boolean; data: Pick<AttendanceRules, 'rule3Bands' | 'rule4' | 'rule5' | 'rule6'> }>('/settings/attendance-rules/attendance-rules/defaults');
    return res.data.data;
  },
};
