import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../errors/types/validationError';
import { HttpStatus } from '../../types/http-statuses';
import { createErrorMessages } from '../../errors/create-error-messages';

const formatValidationError = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    status: String(HttpStatus.UnprocessableEntity),
    title: 'Validation Error',
    detail: expressError.msg,
    source: {
      pointer: expressError.path, // будет отформатирован в createErrorMessages
    },
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatValidationError)
    .array({ onlyFirstError: true });

  if (!errors.length) {
    next();
    return;
  }

  res
    .status(HttpStatus.UnprocessableEntity)
    .json(createErrorMessages(errors, req.path));
};
