import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { userRightApi } from '../services';
import { UserListItem, UserRightsOut } from '../types';

export function useUsersList() {
  return useQuery<UserListItem[]>({
    queryKey: ['users'],
    queryFn: userRightApi.listUsers,
  });
}

export function useUserRights(userId: number | undefined) {
  return useQuery<UserRightsOut>({
    queryKey: ['userRights', userId],
    queryFn: () => userRightApi.getUserRights(userId!),
    enabled: !!userId,
  });
}

export function useSaveUserRights(onSuccess?: () => void, onError?: (error: any) => void) {
  return useMutation({
    mutationFn: userRightApi.saveUserRights,
    onSuccess,
    onError,
  });
}

export function useCreateForm(onSuccess?: () => void, onError?: (error: any) => void) {
  return useMutation({
    mutationFn: userRightApi.createNewForm,
    onSuccess,
    onError,
  });
}

export function useMyUserRights(enabled: boolean) {
  const setUserRights = useAuthStore((state) => state.setUserRights);

  return useQuery<UserRightsOut>({
    queryKey: ['myUserRights'],
    queryFn: async () => {
      const rights = await userRightApi.getMyUserRights();
      setUserRights(rights);
      return rights;
    },
    enabled,
    refetchInterval: 5000, // Sync permissions automatically every 5 seconds
  });
}
