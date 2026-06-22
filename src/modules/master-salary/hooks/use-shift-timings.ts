import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterSalaryApi } from '../services';
import { ShiftTimingDto } from '../types';

export function useShiftTimingsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['shiftTimingsList', params],
    queryFn: () => masterSalaryApi.shiftTimings.list(params),
  });
}

export function useCreateShiftTiming() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: masterSalaryApi.shiftTimings.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shiftTimingsList'] });
    },
  });
}

export function useUpdateShiftTiming() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShiftTimingDto> }) =>
      masterSalaryApi.shiftTimings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shiftTimingsList'] });
    },
  });
}

export function useDeleteShiftTiming() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: masterSalaryApi.shiftTimings.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shiftTimingsList'] });
    },
  });
}
