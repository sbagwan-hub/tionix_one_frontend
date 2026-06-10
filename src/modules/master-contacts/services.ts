import axiosClient from '@/lib/axios';
import {
  CategoryDto,
  DepartmentDto,
  DesignationDto,
  QualificationDto,
  RelationshipDto,
  TitleDto,
  CityDto,
  AddressDto,
} from './types';

// Common wrapper to inject fk_user_id for now
const withUserId = <T extends Record<string, unknown>>(data: T) => ({ ...data, fk_user_id: 1 });

export const masterContactsApi = {
  categories: {
    list: async () =>
      (await axiosClient.get<{ data: CategoryDto[] }>('/master-contacts/categories')).data.data,
    create: async (data: CategoryDto) =>
      (
        await axiosClient.post<{ data: CategoryDto }>(
          '/master-contacts/categories',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<CategoryDto>) =>
      (
        await axiosClient.put<{ data: CategoryDto }>(
          `/master-contacts/categories/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/categories/${id}`),
  },
  departments: {
    list: async () =>
      (await axiosClient.get<{ data: DepartmentDto[] }>('/master-contacts/departments')).data.data,
    create: async (data: DepartmentDto) =>
      (
        await axiosClient.post<{ data: DepartmentDto }>(
          '/master-contacts/departments',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<DepartmentDto>) =>
      (
        await axiosClient.put<{ data: DepartmentDto }>(
          `/master-contacts/departments/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/departments/${id}`),
  },
  designations: {
    list: async () =>
      (await axiosClient.get<{ data: DesignationDto[] }>('/master-contacts/designations')).data
        .data,
    create: async (data: DesignationDto) =>
      (
        await axiosClient.post<{ data: DesignationDto }>(
          '/master-contacts/designations',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<DesignationDto>) =>
      (
        await axiosClient.put<{ data: DesignationDto }>(
          `/master-contacts/designations/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/designations/${id}`),
  },
  qualifications: {
    list: async () =>
      (await axiosClient.get<{ data: QualificationDto[] }>('/master-contacts/qualifications')).data
        .data,
    create: async (data: QualificationDto) =>
      (
        await axiosClient.post<{ data: QualificationDto }>(
          '/master-contacts/qualifications',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<QualificationDto>) =>
      (
        await axiosClient.put<{ data: QualificationDto }>(
          `/master-contacts/qualifications/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/qualifications/${id}`),
  },
  relationships: {
    list: async () =>
      (await axiosClient.get<{ data: RelationshipDto[] }>('/master-contacts/relationships')).data
        .data,
    create: async (data: RelationshipDto) =>
      (
        await axiosClient.post<{ data: RelationshipDto }>(
          '/master-contacts/relationships',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<RelationshipDto>) =>
      (
        await axiosClient.put<{ data: RelationshipDto }>(
          `/master-contacts/relationships/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/relationships/${id}`),
  },
  titles: {
    list: async () =>
      (await axiosClient.get<{ data: TitleDto[] }>('/master-contacts/title')).data.data,
    create: async (data: TitleDto) =>
      (await axiosClient.post<{ data: TitleDto }>('/master-contacts/title', withUserId(data))).data
        .data,
    update: async (id: number, data: Partial<TitleDto>) =>
      (await axiosClient.put<{ data: TitleDto }>(`/master-contacts/title/${id}`, withUserId(data)))
        .data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/title/${id}`),
  },
  city: {
    list: async () =>
      (await axiosClient.get<{ data: { data: CityDto[] } }>('/master-contacts/city')).data.data
        .data,
    create: async (data: CityDto) =>
      (await axiosClient.post<{ data: CityDto }>('/master-contacts/city', withUserId(data))).data
        .data,
    update: async (id: string | number, data: Partial<CityDto>) =>
      (await axiosClient.put<{ data: CityDto }>(`/master-contacts/city/${id}`, withUserId(data)))
        .data.data,
    remove: async (id: string | number) => axiosClient.delete(`/master-contacts/city/${id}`),
  },
  address: {
    list: async () =>
      (await axiosClient.get<{ data: { data: AddressDto[] } }>('/master-contacts/address')).data
        .data.data,
    create: async (data: AddressDto) =>
      (await axiosClient.post<{ data: AddressDto }>('/master-contacts/address', withUserId(data)))
        .data.data,
    update: async (id: number, data: Partial<AddressDto>) =>
      (
        await axiosClient.put<{ data: AddressDto }>(
          `/master-contacts/address/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/address/${id}`),
  },
};
