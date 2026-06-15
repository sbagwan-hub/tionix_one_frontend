import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterContactsApi } from '../services';
import { IndividualDto, IndividualRecord } from '../types';

export const useIndividual = () => {
  const queryClient = useQueryClient();
  const queryKey = ['individual-contacts'];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => masterContactsApi.individuals.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: IndividualDto) => masterContactsApi.individuals.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IndividualDto> }) =>
      masterContactsApi.individuals.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => masterContactsApi.individuals.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    list: listQuery,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
};
