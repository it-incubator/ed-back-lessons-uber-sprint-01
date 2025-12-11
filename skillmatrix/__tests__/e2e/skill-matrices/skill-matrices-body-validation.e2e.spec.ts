// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getSkillMatrixDto } from '../../utils/skill-matrices/get-skill-matrix-dto';
import { clearDb } from '../../utils/clear-db';
import { SKILL_MATRICES_PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SkillMatrixAttributes } from '../../../src/skill-matrices/application/dtos/skill-matrix-attributes';
import { SkillMatrixCreateInput } from '../../../src/skill-matrices/routes/input/skill-matrix-create.input';
import { ResourceType } from '../../../src/core/types/resource-type';

describe('SkillMatrix API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestSkillMatrixAttributes: SkillMatrixAttributes =
    getSkillMatrixDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it(`❌ should not create skill matrix when incorrect body passed; POST /api/skill-matrices`, async () => {
    const correctTestSkillMatrixData: SkillMatrixCreateInput = {
      data: {
        type: ResourceType.SkillMatrices,
        attributes: correctTestSkillMatrixAttributes,
      },
    };

    await request(app)
      .post(SKILL_MATRICES_PATH)
      .send(correctTestSkillMatrixData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(SKILL_MATRICES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          ...correctTestSkillMatrixData.data,
          attributes: {
            title: '   ', // empty string
            description: 'short', // too short
            is_published: 'not a boolean', // wrong type
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors.length).toBeGreaterThan(0);

    const invalidDataSet2 = await request(app)
      .post(SKILL_MATRICES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          ...correctTestSkillMatrixData.data,
          attributes: {
            title: 'A'.repeat(201), // too long
            description: 'Valid description for testing purposes',
            is_published: true,
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors.length).toBeGreaterThan(0);
  });

  it(`❌ should not create skill matrix with missing required fields; POST /api/skill-matrices`, async () => {
    const response = await request(app)
      .post(SKILL_MATRICES_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          type: ResourceType.SkillMatrices,
          attributes: {
            title: 'Test Matrix',
            // missing description and is_published
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});
