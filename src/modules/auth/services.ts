import axiosClient from '@/lib/axios';
import { BookResponse } from './types';

export const authApi = {
  getBooks: async (): Promise<BookResponse> => {
    const response = await axiosClient.get<BookResponse>('/book');
    return response.data;
  },
};
