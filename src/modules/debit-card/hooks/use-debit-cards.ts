import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debitCardApi } from '../services';
import { DebitCard } from '../types';

export function useDebitCardsList(params?: Record<string, any>) {
  return useQuery<DebitCard[]>({
    queryKey: ['debitCardsList', params],
    queryFn: () => debitCardApi.list(params),
  });
}

export function useCreateDebitCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: debitCardApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debitCardsList'] });
    },
  });
}

export function useUpdateDebitCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<DebitCard> }) =>
      debitCardApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debitCardsList'] });
    },
  });
}

export function useDeleteDebitCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: debitCardApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debitCardsList'] });
    },
  });
}
