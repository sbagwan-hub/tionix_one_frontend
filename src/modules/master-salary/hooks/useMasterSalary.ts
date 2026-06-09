import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterSalaryApi } from '../services';
import {
  SkintoneDto,
  CasteDto,
  ReligionDto,
  ScheduleTypeDto,
} from '../types';

type ResourceTypeMap = {
  skintones: SkintoneDto;
  castes: CasteDto;
  religions: ReligionDto;
  scheduleTypes: ScheduleTypeDto;
};

export const useMasterSalary = <T extends keyof typeof masterSalaryApi>(resource: T) => {
  const queryClient = useQueryClient();
  type DTO = ResourceTypeMap[T];

  const api = masterSalaryApi[resource] as unknown as {
    list: () => Promise<DTO[]>;
    create: (data: DTO) => Promise<DTO>;
    update: (id: number, data: Partial<DTO>) => Promise<DTO>;
    remove: (id: number) => Promise<void>;
  };

  const queryKey = ['master-salary', resource];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => api.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: DTO) => api.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DTO> }) => api.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    list: listQuery,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
};
