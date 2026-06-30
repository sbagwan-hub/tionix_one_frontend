import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditCardApi, CreditCardLookups } from '../services';
import { CreditCard } from '../types';

export function useCreditCardsList(params?: Record<string, any>) {
  return useQuery<CreditCard[]>({
    queryKey: ['creditCardsList', params],
    queryFn: () => creditCardApi.list(params),
  });
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: creditCardApi.create,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCardsList'] });
    },
  });
}

export function useUpdateDebitCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<CreditCard> }) =>
      creditCardApi.update(id, body),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCardsList'] });
    },
  });
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: creditCardApi.remove,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCardsList'] });
    },
  });
}

export function useCreditCardLookups() {
  return useQuery<CreditCardLookups>({
    queryKey: ['creditCardLookups'],
    queryFn: () => creditCardApi.lookups(),
  });
}
