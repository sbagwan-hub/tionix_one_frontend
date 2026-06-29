import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceRulesApi } from '../services';
import { AttendanceRules } from '../types';

export function useAttendanceRule(id: number) {
  return useQuery({
    queryKey: ['attendance-rules', id],
    queryFn: () => attendanceRulesApi.getRule(id),
    staleTime: 5000,
  });
}

export function useUpsertAttendanceRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { id: number; temp_fields: string; temp_fields2?: string | null; isExisting: boolean }) => {
      if (args.isExisting) {
        return attendanceRulesApi.updateRule({
          id: args.id,
          payload: { temp_fields: args.temp_fields, temp_fields2: args.temp_fields2 },
        });
      } else {
        return attendanceRulesApi.createRule({
          id: args.id,
          temp_fields: args.temp_fields,
          temp_fields2: args.temp_fields2,
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-rules', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['attendance-rules'] });
    },
  });
}

// Aggregate Query and Mutation Hooks

export function useAttendanceRules() {
  return useQuery({
    queryKey: ['attendance-rules-aggregate'],
    queryFn: () => attendanceRulesApi.getAttendanceRules(),
    staleTime: 5000,
  });
}

export function useSaveAttendanceRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AttendanceRules) => attendanceRulesApi.saveAttendanceRules(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-rules-aggregate'] });
    },
  });
}

export function useAttendanceRulesRights(userId: string, isAdmin?: boolean) {
  return useQuery({
    queryKey: ['attendance-rules-rights', userId, isAdmin],
    queryFn: () => attendanceRulesApi.getEditRights({ userId, isAdmin }),
    enabled: !!userId,
    staleTime: 60000,
  });
}

export function useAttendanceRulesDefaults() {
  return useQuery({
    queryKey: ['attendance-rules-defaults'],
    queryFn: () => attendanceRulesApi.getDefaultRules(),
    staleTime: Infinity,
    enabled: false, // only run manually/on-demand via refetch or similar if needed
  });
}
