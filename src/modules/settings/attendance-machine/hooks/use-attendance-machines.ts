import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceMachineApi } from '../services';
import { AttendanceMachine } from '../types';

export function useAttendanceMachinesList(params?: Record<string, any>) {
  return useQuery<AttendanceMachine[]>({
    queryKey: ['attendanceMachinesList', params],
    queryFn: () => attendanceMachineApi.list(params),
  });
}

export function useCreateAttendanceMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceMachineApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceMachinesList'] });
    },
  });
}

export function useUpdateAttendanceMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<AttendanceMachine> }) =>
      attendanceMachineApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceMachinesList'] });
    },
  });
}

export function useDeleteAttendanceMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceMachineApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceMachinesList'] });
    },
  });
}
