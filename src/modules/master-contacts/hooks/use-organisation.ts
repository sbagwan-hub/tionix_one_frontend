import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterContactsApi } from '../services';
import { OrganisationDto, OrganisationRecord } from '../types';

export const useOrganisation = (params?: { page?: number; limit?: number; search?: string }) => {
  const queryClient = useQueryClient();
  const queryKey = ['organisation-contacts', params];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => masterContactsApi.organisations.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: OrganisationDto) => masterContactsApi.organisations.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OrganisationDto> }) =>
      masterContactsApi.organisations.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => masterContactsApi.organisations.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    list: listQuery,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
};
