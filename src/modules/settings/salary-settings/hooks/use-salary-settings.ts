import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salarySettingsApi } from '../services';
import { SalarySettingsData } from '../types';

export function useSalarySettings() {
  return useQuery({
    queryKey: ['salary-settings'],
    queryFn: () => salarySettingsApi.getSalarySettings(),
    staleTime: 5000,
  });
}

export function useSaveSalarySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SalarySettingsData) => salarySettingsApi.saveSalarySettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-settings'] });
    },
  });
}
