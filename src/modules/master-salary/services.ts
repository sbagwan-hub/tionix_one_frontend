import axiosClient from '@/lib/axios';
import {
  SkintoneDto,
  CasteDto,
  ReligionDto,
  ScheduleTypeDto,
  NatureOfWorkDto,
  SalItSectionDto,
} from './types';

// Common wrapper to inject fk_user_id for now
const withUserId = <T extends Record<string, unknown>>(data: T) => ({ ...data, fk_user_id: 1 });

export const masterSalaryApi = {
  skintones: {
    list: async () =>
      (await axiosClient.get<{ data: SkintoneDto[] }>('/master-salary/skintone')).data.data,
    create: async (data: SkintoneDto) =>
      (
        await axiosClient.post<{ data: SkintoneDto }>(
          '/master-salary/skintone',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<SkintoneDto>) =>
      (
        await axiosClient.put<{ data: SkintoneDto }>(
          `/master-salary/skintone/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-salary/skintone/${id}`),
  },
  castes: {
    list: async () =>
      (await axiosClient.get<{ data: CasteDto[] }>('/master-salary/caste')).data.data,
    create: async (data: CasteDto) =>
      (
        await axiosClient.post<{ data: CasteDto }>(
          '/master-salary/caste',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<CasteDto>) =>
      (
        await axiosClient.put<{ data: CasteDto }>(
          `/master-salary/caste/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-salary/caste/${id}`),
  },
  religions: {
    list: async () =>
      (await axiosClient.get<{ data: ReligionDto[] }>('/master-salary/religion')).data.data,
    create: async (data: ReligionDto) =>
      (
        await axiosClient.post<{ data: ReligionDto }>(
          '/master-salary/religion',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<ReligionDto>) =>
      (
        await axiosClient.put<{ data: ReligionDto }>(
          `/master-salary/religion/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-salary/religion/${id}`),
  },
  scheduleTypes: {
    list: async () =>
      (await axiosClient.get<{ data: ScheduleTypeDto[] }>('/master-salary/schedule-type')).data.data,
    create: async (data: ScheduleTypeDto) =>
      (
        await axiosClient.post<{ data: ScheduleTypeDto }>(
          '/master-salary/schedule-type',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<ScheduleTypeDto>) =>
      (
        await axiosClient.put<{ data: ScheduleTypeDto }>(
          `/master-salary/schedule-type/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-salary/schedule-type/${id}`),
  },
  natureOfWorks: {
    list: async () =>
      (await axiosClient.get<{ data: NatureOfWorkDto[] }>('/nature-of-work')).data.data,
    create: async (data: NatureOfWorkDto) =>
      (
        await axiosClient.post<{ data: NatureOfWorkDto }>(
          '/nature-of-work',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<NatureOfWorkDto>) =>
      (
        await axiosClient.put<{ data: NatureOfWorkDto }>(
          `/nature-of-work/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/nature-of-work/${id}`),
  },
  salItSections: {
    list: async () =>
      (await axiosClient.get<{ data: SalItSectionDto[] }>('/master-salary/sal-it-section')).data.data,
    create: async (data: SalItSectionDto) =>
      (
        await axiosClient.post<{ data: SalItSectionDto }>(
          '/master-salary/sal-it-section',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<SalItSectionDto>) =>
      (
        await axiosClient.put<{ data: SalItSectionDto }>(
          `/master-salary/sal-it-section/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-salary/sal-it-section/${id}`),
  },
};
