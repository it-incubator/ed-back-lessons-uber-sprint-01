import { SkillMatrixDataOutput } from './skill-matrix-data.output';
import { PaginatedOutput } from '../../../core/types/paginated.output';

export type SkillMatrixListPaginatedOutput = {
  meta: PaginatedOutput;
  data: SkillMatrixDataOutput[];
};
