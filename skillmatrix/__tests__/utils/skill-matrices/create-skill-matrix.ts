// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { SKILL_MATRICES_PATH } from '../../../src/core/paths/paths';
import { getSkillMatrixDto } from './get-skill-matrix-dto';
import { SkillMatrixOutput } from '../../../src/skill-matrices/routes/output/skill-matrix.output';
import { SkillMatrixCreateInput } from '../../../src/skill-matrices/routes/input/skill-matrix-create.input';
import { ResourceType } from '../../../src/core/types/resource-type';
import { SkillMatrixAttributes } from '../../../src/skill-matrices/application/dtos/skill-matrix-attributes';

export async function createSkillMatrix(
  app: Express,
  skillMatrixDto?: SkillMatrixAttributes,
): Promise<SkillMatrixOutput> {
  const testSkillMatrixData: SkillMatrixCreateInput = {
    data: {
      type: ResourceType.SkillMatrices,
      attributes: { ...getSkillMatrixDto(), ...skillMatrixDto },
    },
  };

  const createdSkillMatrixResponse = await request(app)
    .post(SKILL_MATRICES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testSkillMatrixData)
    .expect(HttpStatus.Created);

  return createdSkillMatrixResponse.body;
}
