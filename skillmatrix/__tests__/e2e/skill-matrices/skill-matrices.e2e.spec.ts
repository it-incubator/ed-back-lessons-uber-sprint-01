// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';

import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';

import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { SKILL_MATRICES_PATH } from '../../../src/core/paths/paths';
import { createSkillMatrix } from '../../utils/skill-matrices/create-skill-matrix';
import { getSkillMatrixDto } from '../../utils/skill-matrices/get-skill-matrix-dto';
import { clearDb } from '../../utils/clear-db';
import { getSkillMatrixById } from '../../utils/skill-matrices/get-skill-matrix-by-id';
import { updateSkillMatrix } from '../../utils/skill-matrices/update-skill-matrix';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SkillMatrixAttributes } from '../../../src/skill-matrices/application/dtos/skill-matrix-attributes';

describe('SkillMatrix API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create skill matrix; POST /api/skill-matrices', async () => {
    await createSkillMatrix(app, {
      ...getSkillMatrixDto(),
      title: 'Backend Developer Skills',
      description: 'Comprehensive skill matrix for backend developers',
    });
  });

  it('✅ should return skill matrices list; GET /api/skill-matrices', async () => {
    await Promise.all([createSkillMatrix(app), createSkillMatrix(app)]);

    const response = await request(app)
      .get(SKILL_MATRICES_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return skill matrix by id; GET /api/skill-matrices/:id', async () => {
    const createdSkillMatrix = await createSkillMatrix(app);
    const createdSkillMatrixId = createdSkillMatrix.data.id;

    const skillMatrix = await getSkillMatrixById(app, createdSkillMatrixId);

    expect(skillMatrix).toEqual({
      ...createdSkillMatrix,
    });
  });

  it('✅ should update skill matrix; PUT /api/skill-matrices/:id', async () => {
    const createdSkillMatrix = await createSkillMatrix(app);
    const createdSkillMatrixId = createdSkillMatrix.data.id;

    const skillMatrixUpdateData: SkillMatrixAttributes = {
      title: 'Updated Skill Matrix Title',
      description: 'Updated description for the skill matrix',
      is_published: false,
    };

    await updateSkillMatrix(app, createdSkillMatrixId, skillMatrixUpdateData);

    const skillMatrixResponse = await getSkillMatrixById(
      app,
      createdSkillMatrixId,
    );

    expect(skillMatrixResponse.data.id).toBe(createdSkillMatrixId);
    expect(skillMatrixResponse.data.attributes).toEqual({
      title: skillMatrixUpdateData.title,
      description: skillMatrixUpdateData.description,
      is_published: skillMatrixUpdateData.is_published,
      createdAt: expect.any(String),
    });
  });

  it('✅ should delete skill matrix and check after "NOT FOUND"; DELETE /api/skill-matrices/:id', async () => {
    const createdSkillMatrix = await createSkillMatrix(app);
    const createdSkillMatrixId = createdSkillMatrix.data.id;

    await request(app)
      .delete(`${SKILL_MATRICES_PATH}/${createdSkillMatrixId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${SKILL_MATRICES_PATH}/${createdSkillMatrixId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });
});
