import { WithId } from 'mongodb';
import { SkillMatrix } from '../../domain/skill-matrix';
import { SkillMatrixOutput } from '../output/skill-matrix.output';
import { ResourceType } from '../../../core/types/resource-type';

export function mapToSkillMatrixOutput(
  skillMatrix: WithId<SkillMatrix>,
): SkillMatrixOutput {
  return {
    data: {
      type: ResourceType.SkillMatrices,
      id: skillMatrix._id.toString(),
      attributes: {
        title: skillMatrix.title,
        description: skillMatrix.description,
        is_published: skillMatrix.is_published,
        createdAt: skillMatrix.createdAt,
      },
    },
  };
}
