import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chequeBookApi } from '../services';
import { ChequeBook } from '../types';

export function useChequeBooksList(params?: Record<string, any>) {
  return useQuery<ChequeBook[]>({
    queryKey: ['chequeBooksList', params],
    queryFn: () => chequeBookApi.list(params),
  });
}

export function useCreateChequeBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chequeBookApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chequeBooksList'] });
    },
  });
}

export function useUpdateChequeBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<ChequeBook> }) =>
      chequeBookApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chequeBooksList'] });
    },
  });
}

export function useDeleteChequeBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chequeBookApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chequeBooksList'] });
    },
  });
}
