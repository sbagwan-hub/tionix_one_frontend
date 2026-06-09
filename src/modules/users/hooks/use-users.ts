import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services';
import { UserFilterParams, CreateUserPayload, UpdateUserPayload } from '../types';

export function useUsersList(params?: UserFilterParams) {
  return useQuery({
    queryKey: ['usersList', params],
    queryFn: () => usersApi.listUsers(params),
  });
}

export function useCreateUser(onSuccess?: () => void, onError?: (error: any) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      if (onSuccess) onSuccess();
    },
    onError,
  });
}

export function useUpdateUser(onSuccess?: () => void, onError?: (error: any) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      if (onSuccess) onSuccess();
    },
    onError,
  });
}

export function useDeleteUser(onSuccess?: () => void, onError?: (error: any) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      if (onSuccess) onSuccess();
    },
    onError,
  });
}

export function useEmployeesLookup() {
  return useQuery({
    queryKey: ['employeesLookup'],
    queryFn: usersApi.getEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function useEmailConfigsLookup() {
  return useQuery({
    queryKey: ['emailConfigsLookup'],
    queryFn: usersApi.getEmailConfigs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSecurityQuestionsLookup() {
  return useQuery({
    queryKey: ['securityQuestionsLookup'],
    queryFn: usersApi.getSecurityQuestions,
    staleTime: 5 * 60 * 1000,
  });
}
