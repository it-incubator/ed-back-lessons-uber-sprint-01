import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../types/validationError';
import { HttpStatus } from '../../types/http-statuses';
import { ValidationErrorListOutput } from '../../types/validationError.dto';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorListOutput => {
  return {
    errors: errors.map((error) => ({
      status: error.status,
      detail: error.detail, //error message
      source: { pointer: error.source ?? '' }, //error field
      ...(error.code ? { code: error.code } : {}), //domain error code
    })),
  };
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    status: HttpStatus.BadRequest,
    source: expressError.path,
    detail: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (!errors.length) {
    next();
    return;
  }
  res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
  return;
};
