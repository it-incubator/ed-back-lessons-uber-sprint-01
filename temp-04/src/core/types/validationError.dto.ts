import { HttpStatus } from './http-statuses';

type ValidationErrorOutput = {
  status: HttpStatus;
  detail: string;
  source: { pointer: string };
  code?: string;
};

export type ValidationErrorListOutput = { errors: ValidationErrorOutput[] };
