import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
