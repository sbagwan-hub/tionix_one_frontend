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
  shiftTimings: {
    list: async (params?: Record<string, any>) =>
      (await axiosClient.get<{ data: { rows: any[]; total: number; page: number; pageSize: number } }>('/master-salary/sal-shift-timing', { params })).data.data,
    create: async (data: any) =>
      (
        await axiosClient.post<{ data: any }>(
          '/master-salary/sal-shift-timing',
          withUserId(data),
        )
      ).data.data,
    update: async (id: number, data: Partial<any>) =>
      (
        await axiosClient.put<{ data: any }>(
          `/master-salary/sal-shift-timing/${id}`,
          withUserId(data),
        )
      ).data.data,
    remove: async (id: number) => axiosClient.delete(`/master-salary/sal-shift-timing/${id}`),
    export: async (params?: Record<string, any>) => {
      const response = await axiosClient.get('/master-salary/sal-shift-timing/export', {
        params,
        responseType: 'blob',
      });
      return response.data;
    },
  },
  workTimings: {
    list: async (params?: Record<string, any>) =>
      (
        await axiosClient.get<{
          data: { rows: any[]; total: number; page: number; page_size: number };
        }>('/master-salary/sal-work-timing', { params })
      ).data.data,
    listByGroup: async (groupId: string) =>
      (
        await axiosClient.get<{ data: { rows: any[] } }>(
          `/master-salary/sal-work-timing/group/${groupId}`,
        )
      ).data.data.rows,
    create: async (data: any) =>
      (
        await axiosClient.post<{ data: { rows: any[] } }>(
          '/master-salary/sal-work-timing',
          withUserId(data),
        )
      ).data.data,
    updateGroup: async (groupId: string, data: any) =>
      (
        await axiosClient.put<{ data: { rows: any[] } }>(
          `/master-salary/sal-work-timing/group/${groupId}`,
          withUserId(data),
        )
      ).data.data,
    removeGroup: async (groupId: string) =>
      (
        await axiosClient.delete<{ data: { deleted: number } }>(
          `/master-salary/sal-work-timing/group/${groupId}`,
        )
      ).data.data,
    removeSingle: async (id: number) =>
      (await axiosClient.delete(`/master-salary/sal-work-timing/${id}`)).data,
  },
};
