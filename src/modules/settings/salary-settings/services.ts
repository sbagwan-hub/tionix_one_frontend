import axiosClient from '@/lib/axios';
import { SalarySettingsData } from './types';

export const salarySettingsApi = {
  getSalarySettings: async (): Promise<SalarySettingsData> => {
    const res = await axiosClient.get<{ success: boolean; data: SalarySettingsData }>('/settings/salary-settings');
    return res.data.data;
  },

  saveSalarySettings: async (payload: SalarySettingsData): Promise<void> => {
    await axiosClient.put('/settings/salary-settings', payload);
  },
};
