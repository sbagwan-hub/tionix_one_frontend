import axiosClient from '@/lib/axios';
import { User, UserCreateInput, UserUpdateInput } from './types';

export const userMasterApi = {
  getUsers: async (): Promise<User[]> => {
    const res = await axiosClient.get<{ data: User[] }>('/users');
    return res.data.data;
  },

  getUser: async (id: number): Promise<User> => {
    const res = await axiosClient.get<{ data: User }>(`/users/${id}`);
    return res.data.data;
  },

  createUser: async (input: UserCreateInput): Promise<User> => {
    const res = await axiosClient.post<{ data: User }>('/users', input);
    return res.data.data;
  },

  updateUser: async (id: number, input: UserUpdateInput): Promise<User> => {
    const res = await axiosClient.put<{ data: User }>(`/users/${id}`, input);
    return res.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },
};
