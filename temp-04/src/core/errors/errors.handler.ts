import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../types/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { DomainError, DomainErrorCode } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          status: HttpStatus.NotFound,
          detail: error.message,
        },
      ]),
    );

    return;
  }
  if (error instanceof DomainError) {
    let httpStatus: HttpStatus;

    if (error.code === DomainErrorCode.BadRequest) {
      httpStatus = HttpStatus.BadRequest;
    } else {
      httpStatus = HttpStatus.InternalServerError;
    }

    res
      .status(httpStatus)
      .send(
        createErrorMessages([
          { status: httpStatus, source: error.source, detail: error.message },
        ]),
      );

    return;
  }

  res.status(HttpStatus.InternalServerError);
  return;
}
