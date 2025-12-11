import { SkillMatrixAttributes } from '../../../src/skill-matrices/application/dtos/skill-matrix-attributes';

export function getSkillMatrixDto(): SkillMatrixAttributes {
  return {
    title: 'Frontend Developer Skills',
    description: 'Comprehensive skill matrix for frontend developers',
    is_published: true,
  };
}
