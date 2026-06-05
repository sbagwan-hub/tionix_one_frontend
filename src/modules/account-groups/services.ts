import axiosClient from '@/lib/axios';
import { AcctGroup, TreeNode, CreateAcctGroupDto, UpdateAcctGroupDto } from './types';

export const acctGroupApi = {
  list: async (params?: Record<string, any>): Promise<AcctGroup[]> => {
    const res = await axiosClient.get<{ data: AcctGroup[] }>('/account-groups', { params });
    return res.data.data;
  },

  tree: async (): Promise<TreeNode[]> => {
    const res = await axiosClient.get<{ data: TreeNode[] }>('/account-groups/tree');
    return res.data.data;
  },

  parents: async (): Promise<AcctGroup[]> => {
    const res = await axiosClient.get<{ data: AcctGroup[] }>('/account-groups/parents');
    return res.data.data;
  },

  create: async (body: CreateAcctGroupDto): Promise<AcctGroup> => {
    const res = await axiosClient.post<{ data: AcctGroup }>('/account-groups', body);
    return res.data.data;
  },

  update: async (id: number, body: UpdateAcctGroupDto): Promise<AcctGroup> => {
    const res = await axiosClient.put<{ data: AcctGroup }>(`/account-groups/${id}`, body);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosClient.delete(`/account-groups/${id}`);
  },
};
