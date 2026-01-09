import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../types/http-statuses';
import { DomainError } from './domain.error';
import { createErrorMessages } from './create-error-messages';

export function errorsHandler(
  error: unknown,
  res: Response,
  req: { path: string },
): void {
  if (error instanceof RepositoryNotFoundError) {
    res.status(HttpStatus.NotFound).send(
      createErrorMessages(
        [
          {
            status: String(HttpStatus.NotFound),
            title: 'Not Found',
            detail: error.message,
          },
        ],
        req.path,
      ),
    );
    return;
  }

  if (error instanceof DomainError) {
    res.status(HttpStatus.UnprocessableEntity).send(
      createErrorMessages(
        [
          {
            status: String(HttpStatus.UnprocessableEntity),
            title: 'Unprocessable Entity',
            code: error.code,
            detail: error.message,
            source: error.source
              ? { pointer: `/data/attributes/${error.source}` }
              : undefined,
          },
        ],
        req.path,
      ),
    );
    return;
  }

  res.status(HttpStatus.InternalServerError).send(
    createErrorMessages(
      [
        {
          status: String(HttpStatus.InternalServerError),
          title: 'Internal Server Error',
          // detail НЕ добавляем - не хотим раскрывать детали
        },
      ],
      req.path,
    ),
  );
}
