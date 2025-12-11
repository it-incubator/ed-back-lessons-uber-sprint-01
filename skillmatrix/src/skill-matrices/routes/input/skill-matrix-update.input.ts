import { ResourceType } from '../../../core/types/resource-type';
import { SkillMatrixAttributes } from '../../application/dtos/skill-matrix-attributes';

export type SkillMatrixUpdateInput = {
  data: {
    type: ResourceType.SkillMatrices;
    id: string;
    attributes: SkillMatrixAttributes;
  };
};
