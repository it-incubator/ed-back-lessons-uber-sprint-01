import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { driverInputDtoValidation } from './driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  DriverSortField,
  getDriverListHandler,
} from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';

export const driversRouter = Router({});

//middleware на весь маршрут
driversRouter.use(superAdminGuardMiddleware);

driversRouter
  .get(
    '',
    paginationAndSortingValidation(DriverSortField),
    getDriverListHandler,
  )

  .get('/:id', idValidation, inputValidationResultMiddleware, getDriverHandler)

  .post(
    '',
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    createDriverHandler,
  )

  .put(
    '/:id',
    idValidation,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    updateDriverHandler,
  )

  .delete(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    deleteDriverHandler,
  );
