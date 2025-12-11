import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import {
  skillMatrixCreateInputValidation,
  skillMatrixUpdateInputValidation,
} from './skill-matrix.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { getSkillMatrixListHandler } from './handlers/get-skill-matrix-list.handler';
import { getSkillMatrixHandler } from './handlers/get-skill-matrix.handler';
import { createSkillMatrixHandler } from './handlers/create-skill-matrix.handler';
import { updateSkillMatrixHandler } from './handlers/update-skill-matrix.handler';
import { deleteSkillMatrixHandler } from './handlers/delete-skill-matrix.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { SkillMatrixSortField } from './input/skill-matrix-sort-field';

export const skillMatricesRouter = Router({});

skillMatricesRouter.use(superAdminGuardMiddleware);

skillMatricesRouter
  .get(
    '',
    paginationAndSortingValidation(SkillMatrixSortField),
    inputValidationResultMiddleware,
    getSkillMatrixListHandler,
  )

  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getSkillMatrixHandler,
  )

  .post(
    '',
    skillMatrixCreateInputValidation,
    inputValidationResultMiddleware,
    createSkillMatrixHandler,
  )

  .put(
    '/:id',
    idValidation,
    skillMatrixUpdateInputValidation,
    inputValidationResultMiddleware,
    updateSkillMatrixHandler,
  )

  .delete(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    deleteSkillMatrixHandler,
  );
