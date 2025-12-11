// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { getSkillMatrixDto } from './get-skill-matrix-dto';
import { SKILL_MATRICES_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { SkillMatrixAttributes } from '../../../src/skill-matrices/application/dtos/skill-matrix-attributes';
import { ResourceType } from '../../../src/core/types/resource-type';
import { SkillMatrixUpdateInput } from '../../../src/skill-matrices/routes/input/skill-matrix-update.input';
import { HttpStatus } from '../../../src/core/types/http-statuses';

export async function updateSkillMatrix(
  app: Express,
  skillMatrixId: string,
  skillMatrixDto?: SkillMatrixAttributes,
): Promise<void> {
  const testSkillMatrixData: SkillMatrixUpdateInput = {
    data: {
      type: ResourceType.SkillMatrices,
      id: skillMatrixId,
      attributes: { ...getSkillMatrixDto(), ...skillMatrixDto },
    },
  };

  const updatedSkillMatrixResponse = await request(app)
    .put(`${SKILL_MATRICES_PATH}/${skillMatrixId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testSkillMatrixData)
    .expect(HttpStatus.NoContent);

  return updatedSkillMatrixResponse.body;
}
