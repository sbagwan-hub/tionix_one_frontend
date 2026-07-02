import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetApi } from '../services';
import { CreateAssetDto, UpdateAssetDto, Asset } from '../types';

export function useAssetsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['assetsList', params],
    queryFn: () => assetApi.list(params),
  });
}

export function useAssetDetail(id: number | string | null) {
  return useQuery({
    queryKey: ['assetDetail', id],
    queryFn: () => assetApi.get(id!),
    enabled: id !== null && id !== undefined && id !== '',
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assetApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetsList'] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: UpdateAssetDto }) =>
      assetApi.update(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assetsList'] });
      queryClient.invalidateQueries({ queryKey: ['assetDetail', String(data.pk_ast_id)] });
      queryClient.invalidateQueries({ queryKey: ['assetDetail', data.pk_ast_id] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assetApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetsList'] });
    },
  });
}

export function useAccountLookups() {
  return useQuery({
    queryKey: ['assetAccountLookups'],
    queryFn: assetApi.listAccounts,
  });
}

export function useProductLookups() {
  return useQuery({
    queryKey: ['assetProductLookups'],
    queryFn: assetApi.listProducts,
  });
}

export function useAssetParts(id: number | string | null) {
  return useQuery({
    queryKey: ['assetParts', id],
    queryFn: () => assetApi.listParts(id!),
    enabled: id !== null && id !== undefined && id !== '',
  });
}
