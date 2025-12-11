import { WithId } from 'mongodb';
import { SkillMatrix } from '../../domain/skill-matrix';
import { ResourceType } from '../../../core/types/resource-type';
import { SkillMatrixListPaginatedOutput } from '../output/skill-matrix-list-paginated.output';
import { SkillMatrixDataOutput } from '../output/skill-matrix-data.output';

export function mapToSkillMatrixListPaginatedOutput(
  skillMatrices: WithId<SkillMatrix>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): SkillMatrixListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: skillMatrices.map(
      (skillMatrix): SkillMatrixDataOutput => ({
        type: ResourceType.SkillMatrices,
        id: skillMatrix._id.toString(),
        attributes: {
          title: skillMatrix.title,
          description: skillMatrix.description,
          is_published: skillMatrix.is_published,
          createdAt: skillMatrix.createdAt,
        },
      }),
    ),
  };
}
