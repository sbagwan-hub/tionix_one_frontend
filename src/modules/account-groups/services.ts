import axiosClient from '@/lib/axios';
import { AcctGroup, TreeNode, CreateAcctGroupDto, UpdateAcctGroupDto } from './types';

export const acctGroupApi = {
  list: async (params?: Record<string, any>): Promise<AcctGroup[]> => {
    const res = await axiosClient.get<{ data: AcctGroup[] }>('/master/account/group', { params });
    return res.data.data;
  },

  tree: async (): Promise<TreeNode[]> => {
    const res = await axiosClient.get<{ data: TreeNode[] }>('/master/account/group/tree');
    return res.data.data;
  },

  parents: async (): Promise<AcctGroup[]> => {
    const res = await axiosClient.get<{ data: AcctGroup[] }>('/master/account/group/parents');
    return res.data.data;
  },

  create: async (body: CreateAcctGroupDto): Promise<AcctGroup> => {
    const res = await axiosClient.post<{ data: AcctGroup }>('/master/account/group', body);
    return res.data.data;
  },

  update: async (id: number, body: UpdateAcctGroupDto): Promise<AcctGroup> => {
    const res = await axiosClient.put<{ data: AcctGroup }>(`/master/account/group/${id}`, body);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosClient.delete(`/master/account/group/${id}`);
  },
};
