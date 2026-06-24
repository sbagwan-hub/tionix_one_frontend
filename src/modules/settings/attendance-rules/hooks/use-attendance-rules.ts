import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceRulesApi } from '../services';

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
