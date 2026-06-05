import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { acctGroupApi } from '../services';
import { AcctGroup, TreeNode, CreateAcctGroupDto, UpdateAcctGroupDto } from '../types';

export function useAccountGroupsList(params?: Record<string, any>) {
  return useQuery<AcctGroup[]>({
    queryKey: ['accountGroupsList', params],
    queryFn: () => acctGroupApi.list(params),
  });
}

export function useAccountGroupsTree() {
  return useQuery<TreeNode[]>({
    queryKey: ['accountGroupsTree'],
    queryFn: acctGroupApi.tree,
  });
}

export function useAccountGroupsParents() {
  return useQuery<AcctGroup[]>({
    queryKey: ['accountGroupsParents'],
    queryFn: acctGroupApi.parents,
  });
}

export function useCreateAccountGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acctGroupApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountGroupsList'] });
      queryClient.invalidateQueries({ queryKey: ['accountGroupsTree'] });
      queryClient.invalidateQueries({ queryKey: ['accountGroupsParents'] });
    },
  });
}

export function useUpdateAccountGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateAcctGroupDto }) =>
      acctGroupApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountGroupsList'] });
      queryClient.invalidateQueries({ queryKey: ['accountGroupsTree'] });
      queryClient.invalidateQueries({ queryKey: ['accountGroupsParents'] });
    },
  });
}

export function useDeleteAccountGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acctGroupApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountGroupsList'] });
      queryClient.invalidateQueries({ queryKey: ['accountGroupsTree'] });
      queryClient.invalidateQueries({ queryKey: ['accountGroupsParents'] });
    },
  });
}
