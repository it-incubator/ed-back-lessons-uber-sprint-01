import { paginationAndSortingDefault } from '../middlewares/validation/query-pagination-sorting.validation-middleware';
import { PaginationAndSorting } from '../types/pagination-and-sorting';

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    // Ensure pageNumber and pageSize are numbers, not strings
    pageNumber:
      typeof query.pageNumber === 'string'
        ? parseInt(query.pageNumber, 10)
        : (query.pageNumber ?? paginationAndSortingDefault.pageNumber),
    pageSize:
      typeof query.pageSize === 'string'
        ? parseInt(query.pageSize, 10)
        : (query.pageSize ?? paginationAndSortingDefault.pageSize),
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
