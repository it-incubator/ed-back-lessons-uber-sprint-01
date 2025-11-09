import { ResourceType } from '../../../core/types/resource-type';
import { SkillMatrixAttributes } from '../../application/dtos/skill-matrix-attributes';

export type SkillMatrixCreateInput = {
  data: {
    type: ResourceType.SkillMatrices;
    attributes: SkillMatrixAttributes;
  };
};
