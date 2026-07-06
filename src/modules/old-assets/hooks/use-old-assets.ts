import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { oldAssetApi } from '../services';
import { UpdateOldAssetDto } from '../types';

export function useOldAssetsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['oldAssetsList', params],
    queryFn: () => oldAssetApi.list(params),
  });
}

export function useOldAssetDetail(id: number | string | null) {
  return useQuery({
    queryKey: ['oldAssetDetail', id],
    queryFn: () => oldAssetApi.get(id!),
    enabled: id !== null && id !== undefined && id !== '',
  });
}

export function useCreateOldAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oldAssetApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oldAssetsList'] });
    },
  });
}

export function useUpdateOldAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: UpdateOldAssetDto }) =>
      oldAssetApi.update(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['oldAssetsList'] });
      queryClient.invalidateQueries({ queryKey: ['oldAssetDetail', String(data.pk_ast_id)] });
      queryClient.invalidateQueries({ queryKey: ['oldAssetDetail', data.pk_ast_id] });
    },
  });
}

export function useDeleteOldAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oldAssetApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oldAssetsList'] });
    },
  });
}

export function useAccountLookups() {
  return useQuery({
    queryKey: ['oldAssetAccountLookups'],
    queryFn: oldAssetApi.listAccounts,
  });
}

export function useSupplierLookups() {
  return useQuery({
    queryKey: ['oldAssetSupplierLookups'],
    queryFn: oldAssetApi.listSuppliers,
  });
}

export function useProductLookups() {
  return useQuery({
    queryKey: ['oldAssetProductLookups'],
    queryFn: oldAssetApi.listProducts,
  });
}

export function useBrandLookups() {
  return useQuery({
    queryKey: ['oldAssetBrandLookups'],
    queryFn: oldAssetApi.listBrands,
  });
}

export function useCategoryLookups() {
  return useQuery({
    queryKey: ['oldAssetCategoryLookups'],
    queryFn: oldAssetApi.listCategories,
  });
}

export function useLocationLookups() {
  return useQuery({
    queryKey: ['oldAssetLocationLookups'],
    queryFn: oldAssetApi.listLocations,
  });
}
