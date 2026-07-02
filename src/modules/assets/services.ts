import axiosClient from '@/lib/axios';
import {
  Asset,
  CreateAssetDto,
  UpdateAssetDto,
  AccountLookup,
  ProductLookup,
  AssetPartItem,
} from './types';

export const assetApi = {
  list: async (params?: Record<string, any>): Promise<{ items: Asset[]; total: number }> => {
    const res = await axiosClient.get<{
      data: { items: any[]; total: number; page: number; page_size: number };
    }>('/master/account/asset', { params });
    
    const data = res.data.data;
    return {
      items: data.items || [],
      total: data.total || 0,
    };
  },

  get: async (id: number | string): Promise<Asset> => {
    const res = await axiosClient.get<{ data: Asset }>(`/master/account/asset/${id}`);
    return res.data.data;
  },

  create: async (body: CreateAssetDto): Promise<Asset> => {
    const res = await axiosClient.get<{ data: any }>('/master/account/asset'); // just dummy to check if we can do POST
    const postRes = await axiosClient.post<{ data: Asset }>('/master/account/asset', body);
    return postRes.data.data;
  },

  update: async (id: number | string, body: UpdateAssetDto): Promise<Asset> => {
    const res = await axiosClient.put<{ data: Asset }>(`/master/account/asset/${id}`, body);
    return res.data.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosClient.delete(`/master/account/asset/${id}`);
  },

  listAccounts: async (): Promise<AccountLookup[]> => {
    const res = await axiosClient.get<{ data: AccountLookup[] }>('/master/account/asset/lookups/accounts');
    return res.data.data || [];
  },

  listProducts: async (): Promise<ProductLookup[]> => {
    const res = await axiosClient.get<{ data: ProductLookup[] }>('/master/account/asset/lookups/products');
    return res.data.data || [];
  },

  listParts: async (id: number | string): Promise<AssetPartItem[]> => {
    const res = await axiosClient.get<{ data: AssetPartItem[] }>(`/master/account/asset/${id}/parts`);
    return res.data.data || [];
  },
};
