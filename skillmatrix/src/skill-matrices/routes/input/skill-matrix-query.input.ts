import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { SkillMatrixSortField } from './skill-matrix-sort-field';

export type SkillMatrixQueryInput = PaginationAndSorting<SkillMatrixSortField> &
  Partial<{
    searchTitleTerm: string;
  }>;
