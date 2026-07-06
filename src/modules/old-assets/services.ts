import axiosClient from '@/lib/axios';
import {
  OldAsset,
  CreateOldAssetDto,
  UpdateOldAssetDto,
  AccountLookup,
  SupplierLookup,
  ProductLookup,
  BrandLookup,
  CategoryLookup,
  LocationLookup,
} from './types';

export const oldAssetApi = {
  list: async (params?: Record<string, any>): Promise<{ items: OldAsset[]; total: number }> => {
    const res = await axiosClient.get<{
      data: { items: any[]; total: number; page: number; page_size: number };
    }>('/master/account/old-asset', { params });
    const data = res.data.data;
    return {
      items: data.items || [],
      total: data.total || 0,
    };
  },

  get: async (id: number | string): Promise<OldAsset> => {
    const res = await axiosClient.get<{ data: OldAsset }>(`/master/account/old-asset/${id}`);
    return res.data.data;
  },

  create: async (body: CreateOldAssetDto): Promise<OldAsset> => {
    const res = await axiosClient.post<{ data: OldAsset }>('/master/account/old-asset', body);
    return res.data.data;
  },

  update: async (id: number | string, body: UpdateOldAssetDto): Promise<OldAsset> => {
    const res = await axiosClient.put<{ data: OldAsset }>(`/master/account/old-asset/${id}`, body);
    return res.data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/old-asset/${id}`);
  },

  listAccounts: async (): Promise<AccountLookup[]> => {
    const res = await axiosClient.get<{ data: AccountLookup[] }>('/master/account/old-asset/common/accounts');
    return res.data.data || [];
  },

  listSuppliers: async (): Promise<SupplierLookup[]> => {
    const res = await axiosClient.get<{ data: SupplierLookup[] }>('/master/account/old-asset/common/suppliers');
    return res.data.data || [];
  },

  listProducts: async (): Promise<ProductLookup[]> => {
    const res = await axiosClient.get<{ data: ProductLookup[] }>('/master/account/old-asset/common/products');
    return res.data.data || [];
  },

  listBrands: async (): Promise<BrandLookup[]> => {
    const res = await axiosClient.get<{ data: BrandLookup[] }>('/master/account/old-asset/common/brands');
    return res.data.data || [];
  },

  listCategories: async (): Promise<CategoryLookup[]> => {
    const res = await axiosClient.get<{ data: CategoryLookup[] }>('/master/account/old-asset/common/categories');
    return res.data.data || [];
  },

  listLocations: async (): Promise<LocationLookup[]> => {
    const res = await axiosClient.get<{ data: LocationLookup[] }>('/master/account/old-asset/common/locations');
    return res.data.data || [];
  },
};
