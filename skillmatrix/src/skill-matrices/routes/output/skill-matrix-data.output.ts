import { ResourceType } from '../../../core/types/resource-type';

export type SkillMatrixDataOutput = {
  type: ResourceType.SkillMatrices;
  id: string;
  attributes: {
    title: string;
    description: string;
    is_published: boolean;
    createdAt: Date;
  };
};
