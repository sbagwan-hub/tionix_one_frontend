import axiosClient from '@/lib/axios';
import {
  UserRecord,
  EmployeeLookup,
  EmailConfigLookup,
  SecurityQuestionLookup,
  UserFilterParams,
  CreateUserPayload,
  UpdateUserPayload,
} from './types';

export const usersApi = {
  listUsers: async (
    params?: UserFilterParams,
  ): Promise<{ data: UserRecord[]; total: number; page: number; pageSize: number }> => {
    const res = await axiosClient.get<{
      success: boolean;
      data: UserRecord[];
      meta?: { total: number; page: number; pageSize: number };
    }>('/users', { params });
    return {
      data: res.data.data || [],
      total: res.data.meta?.total || 0,
      page: res.data.meta?.page || 1,
      pageSize: res.data.meta?.pageSize || 50,
    };
  },

  getUser: async (id: number): Promise<UserRecord> => {
    const res = await axiosClient.get<{ success: boolean; data: UserRecord }>(`/users/${id}`);
    return res.data.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<UserRecord> => {
    const res = await axiosClient.post<{ success: boolean; data: UserRecord }>('/users', payload);
    return res.data.data;
  },

  updateUser: async (args: { id: number; payload: UpdateUserPayload }): Promise<UserRecord> => {
    const res = await axiosClient.put<{ success: boolean; data: UserRecord }>(
      `/users/${args.id}`,
      args.payload,
    );
    return res.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },

  exportUsers: async (params?: UserFilterParams): Promise<Record<string, any>[]> => {
    const res = await axiosClient.get<{ success: boolean; data: Record<string, any>[] }>(
      '/users/export',
      { params },
    );
    return res.data.data;
  },

  getEmployees: async (): Promise<EmployeeLookup[]> => {
    const res = await axiosClient.get<{ success: boolean; data: EmployeeLookup[] }>(
      '/users/lookups/employees',
    );
    return res.data.data;
  },

  getEmailConfigs: async (): Promise<EmailConfigLookup[]> => {
    const res = await axiosClient.get<{ success: boolean; data: EmailConfigLookup[] }>(
      '/users/lookups/email-configurations',
    );
    return res.data.data;
  },

  getSecurityQuestions: async (): Promise<SecurityQuestionLookup[]> => {
    const res = await axiosClient.get<{ success: boolean; data: SecurityQuestionLookup[] }>(
      '/users/lookups/security-questions',
    );
    return res.data.data;
  },
};
