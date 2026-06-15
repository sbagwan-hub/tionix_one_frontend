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
  ModeOfContactDto,
  ModeOfContactTypeDto,
  StateDto,
  RegionDto,
} from './types';

// Common wrapper to inject fk_user_id for now
const withUserId = <T extends Record<string, unknown>>(data: T) => ({ ...data, fk_user_id: 1 });

export const masterContactsApi = {
  categories: {
    list: async () =>
      (await axiosClient.get<{ data: CategoryDto[] }>('/master/master-contacts/categories')).data
        .data,
    create: async (data: CategoryDto) =>
      (
        await axiosClient.post<{ data: CategoryDto }>(
          '/master/master-contacts/categories',
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
      (await axiosClient.get<{ data: DepartmentDto[] }>('/master/master-contacts/departments')).data
        .data,
    create: async (data: DepartmentDto) =>
      (
        await axiosClient.post<{ data: DepartmentDto }>(
          '/master/master-contacts/departments',
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
      (await axiosClient.get<{ data: DesignationDto[] }>('/master/master-contacts/designations'))
        .data.data,
    create: async (data: DesignationDto) =>
      (
        await axiosClient.post<{ data: DesignationDto }>(
          '/master/master-contacts/designations',
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
      (
        await axiosClient.get<{ data: QualificationDto[] }>(
          '/master/master-contacts/qualifications',
        )
      ).data.data,
    create: async (data: QualificationDto) =>
      (
        await axiosClient.post<{ data: QualificationDto }>(
          '/master/master-contacts/qualifications',
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
      (await axiosClient.get<{ data: RelationshipDto[] }>('/master/master-contacts/relationships'))
        .data.data,
    create: async (data: RelationshipDto) =>
      (
        await axiosClient.post<{ data: RelationshipDto }>(
          '/master/master-contacts/relationships',
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
      (await axiosClient.get<{ data: TitleDto[] }>('/master/master-contacts/title')).data.data,
    create: async (data: TitleDto) =>
      (
        await axiosClient.post<{ data: TitleDto }>(
          '/master/master-contacts/title',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<TitleDto>) =>
      (await axiosClient.put<{ data: TitleDto }>(`/master-contacts/title/${id}`, withUserId(data)))
        .data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/title/${id}`),
  },
  city: {
    list: async () =>
      (await axiosClient.get<{ data: { data: CityDto[] } }>('/master/master-contacts/city')).data
        .data.data,
    create: async (data: CityDto) =>
      (await axiosClient.post<{ data: CityDto }>('/master/master-contacts/city', withUserId(data)))
        .data.data,
    update: async (id: string | number, data: Partial<CityDto>) =>
      (await axiosClient.put<{ data: CityDto }>(`/master-contacts/city/${id}`, withUserId(data)))
        .data.data,
    remove: async (id: string | number) => axiosClient.delete(`/master-contacts/city/${id}`),
  },
  address: {
    list: async () =>
      (await axiosClient.get<{ data: { data: AddressDto[] } }>('/master/master-contacts/address'))
        .data.data.data,
    create: async (data: AddressDto) =>
      (
        await axiosClient.post<{ data: AddressDto }>(
          '/master/master-contacts/address',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<AddressDto>) =>
      (
        await axiosClient.put<{ data: AddressDto }>(
          `/master-contacts/address/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-contacts/address/${id}`),
  },
  organizationsDropdown: {
    list: async () =>
      (
        await axiosClient.get<{ data: any[] }>(
          '/master/master-contacts/address/organizations/dropdown',
        )
      ).data.data,
    create: async () => ({}) as any,
    update: async () => ({}) as any,
    remove: async () => {},
  },
  countryDropdown: {
    list: async () =>
      (await axiosClient.get<{ data: any[] }>('/master/master-contacts/country/dropdown')).data
        .data,
    create: async () => ({}) as any,
    update: async () => ({}) as any,
    remove: async () => {},
  },
  stateDropdown: {
    list: async () =>
      (await axiosClient.get<{ data: any[] }>('/master/master-contacts/state/dropdown')).data.data,
    create: async () => ({}) as any,
    update: async () => ({}) as any,
    remove: async () => {},
  },
  modeOfContact: {
    list: async () =>
      (
        await axiosClient.get<{ data: { rows: ModeOfContactDto[] } }>(
          '/master/master-contacts/mode-of-contact',
        )
      ).data.data.rows,
    create: async (data: ModeOfContactDto) =>
      (
        await axiosClient.post<{ data: ModeOfContactDto }>(
          '/master/master-contacts/mode-of-contact',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<ModeOfContactDto>) =>
      (
        await axiosClient.put<{ data: ModeOfContactDto }>(
          `/master/master-contacts/mode-of-contact/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) =>
      axiosClient.delete(`/master/master-contacts/mode-of-contact/${id}`),
  },
  state: {
    list: async () =>
      (await axiosClient.get<{ data: { rows: StateDto[] } }>('/master/master-contacts/state')).data
        .data.rows,
    create: async (data: StateDto) =>
      (
        await axiosClient.post<{ data: StateDto }>(
          '/master/master-contacts/state',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<StateDto>) =>
      (
        await axiosClient.put<{ data: StateDto }>(
          `/master/master-contacts/state/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master/master-contacts/state/${id}`),
  },
  region: {
    list: async () =>
      (await axiosClient.get<{ data: { rows: RegionDto[] } }>('/master/master-contacts/region'))
        .data.data.rows,
    create: async (data: RegionDto) =>
      (
        await axiosClient.post<{ data: RegionDto }>(
          '/master/master-contacts/region',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<RegionDto>) =>
      (
        await axiosClient.put<{ data: RegionDto }>(
          `/master/master-contacts/region/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master/master-contacts/region/${id}`),
  },
  mocTypesDropdown: {
    list: async () =>
      (
        await axiosClient.get<{ data: ModeOfContactTypeDto[] }>(
          '/master/master-contacts/mode-of-contact/types',
        )
      ).data.data,
    create: async () => ({}) as any,
    update: async () => ({}) as any,
    remove: async () => {},
  },
};
