import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services';

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: authApi.getBooks,
  });
}
