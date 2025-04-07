import { HttpStatus } from './http-statuses';

export type ValidationErrorType = {
  status: HttpStatus;
  source?: string;
  detail: string;
};
