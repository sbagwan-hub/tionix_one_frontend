import axiosClient from '@/lib/axios';
import { UserListItem, UserRightsOut, SaveUserRightsIn, CreateNewFormIn } from './types';

export const userRightApi = {
  listUsers: async (): Promise<UserListItem[]> => {
    const res = await axiosClient.get<{ data: UserListItem[] }>('/user-rights/users');
    return res.data.data;
  },

  getUserRights: async (userId: number): Promise<UserRightsOut> => {
    const res = await axiosClient.get<{ data: UserRightsOut }>(
      `/user-rights/users/${userId}/rights`,
    );
    return res.data.data;
  },

  saveUserRights: async (payload: SaveUserRightsIn): Promise<void> => {
    await axiosClient.post('/user-rights/users/rights', payload);
  },

  createNewForm: async (payload: CreateNewFormIn): Promise<void> => {
    await axiosClient.post('/user-rights/forms', payload);
  },
};
