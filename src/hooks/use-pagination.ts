import { useState, useMemo } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 10, total = 0 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationState = useMemo<PaginationState>(() => ({
    page,
    pageSize,
    total,
  }), [page, pageSize, total]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const hasNextPage = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return page > 1;
  }, [page]);

  const nextPage = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  };

  const goToPage = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      setPage(targetPage);
    }
  };

  const resetPagination = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    // State
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    
    // Computed
    startIndex: (page - 1) * pageSize,
    endIndex: page * pageSize,
    
    // Actions
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToPage,
    resetPagination,
  };
}
