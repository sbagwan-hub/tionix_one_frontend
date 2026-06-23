import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterSalaryApi } from '../services';

export function useWorkTimingsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['workTimingsList', params],
    queryFn: () => masterSalaryApi.workTimings.list(params),
  });
}

export function useWorkTimingsByGroup(groupId?: string) {
  return useQuery({
    queryKey: ['workTimingsByGroup', groupId],
    queryFn: () =>
      groupId ? masterSalaryApi.workTimings.listByGroup(groupId) : Promise.resolve([]),
    enabled: !!groupId,
  });
}

export function useCreateWorkTiming() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: masterSalaryApi.workTimings.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workTimingsList'] });
    },
  });
}

export function useUpdateWorkTimingGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: any }) =>
      masterSalaryApi.workTimings.updateGroup(groupId, data),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['workTimingsList'] });
      queryClient.invalidateQueries({ queryKey: ['workTimingsByGroup', groupId] });
    },
  });
}

export function useDeleteWorkTimingGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => masterSalaryApi.workTimings.removeGroup(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['workTimingsList'] });
      queryClient.invalidateQueries({ queryKey: ['workTimingsByGroup', groupId] });
    },
  });
}

export function useDeleteWorkTiming() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => masterSalaryApi.workTimings.removeSingle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workTimingsList'] });
    },
  });
}
