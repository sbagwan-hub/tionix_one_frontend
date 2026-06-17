import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterEmployeeApi } from '../services';
import { EmployeeRecord, EmployeeFilterParams } from '../types';

export const useMasterEmployee = (filters?: EmployeeFilterParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['master-employee', filters];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => masterEmployeeApi.list(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<EmployeeRecord, 'pk_emp_id'>) => masterEmployeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-employee'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmployeeRecord> }) =>
      masterEmployeeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-employee'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => masterEmployeeApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-employee'] });
    },
  });

  return {
    list: listQuery,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
};

export const useNextEmpCode = (enabled = false) => {
  return useQuery({
    queryKey: ['master-employee', 'next-code'],
    queryFn: () => masterEmployeeApi.nextCode(),
    enabled,
  });
};

export const useDocumentTypes = () => {
  return useQuery({
    queryKey: ['master-employee', 'document-types'],
    queryFn: () => masterEmployeeApi.documentTypes(),
  });
};

