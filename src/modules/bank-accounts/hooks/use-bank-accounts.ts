import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountApi } from '../services';
import { BankAccount, CreateBankAccountDto, UpdateBankAccountDto } from '../types';

export function useBankAccountsList(params?: Record<string, any>) {
  return useQuery<BankAccount[]>({
    queryKey: ['bankAccountsList', params],
    queryFn: () => bankAccountApi.list(params),
  });
}

export function useCreateBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bankAccountApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccountsList'] });
    },
  });
}

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: UpdateBankAccountDto }) =>
      bankAccountApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccountsList'] });
    },
  });
}

export function useDeleteBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bankAccountApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccountsList'] });
    },
  });
}
