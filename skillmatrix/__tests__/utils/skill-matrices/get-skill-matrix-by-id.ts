// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { SKILL_MATRICES_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { SkillMatrixOutput } from '../../../src/skill-matrices/routes/output/skill-matrix.output';

export async function getSkillMatrixById(
  app: Express,
  skillMatrixId: string,
): Promise<SkillMatrixOutput> {
  const skillMatrixResponse = await request(app)
    .get(`${SKILL_MATRICES_PATH}/${skillMatrixId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return skillMatrixResponse.body;
}
