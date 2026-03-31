import {
  FieldValidationError,
  ValidationError,
  validationResult,
  matchedData,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../errors/types/validationError';
import { HttpStatus } from '../../types/http-statuses';
import { createErrorMessages } from '../../errors/create-error-messages';
// Импорт для расширения типа Request
import '../../types/express-extended';

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

/**
 * Middleware для обработки результатов валидации express-validator.
 *
 * ВАЖНО про санитизацию (sanitizers):
 * ────────────────────────────────────────────────────────────────────
 * В express-validator sanitizers (.toInt(), .trim(), .escape() и др.)
 * НЕ модифицируют req.query/req.body напрямую — это ограничение Express.
 *
 * Санитизированные значения доступны ТОЛЬКО через matchedData().
 *
 * Этот middleware:
 * 1. Проверяет ошибки валидации
 * 2. При успехе — извлекает санитизированные данные через matchedData()
 * 3. Сохраняет их в req.sanitized для использования в handlers
 *
 * ИСПОЛЬЗОВАНИЕ В HANDLER:
 * ```typescript
 * // Вместо:
 * const query = req.query as unknown as SomeType; // строки!
 *
 * // Используй:
 * const query = req.sanitized?.query as SomeType; // уже числа!
 * ```
 */
export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatValidationError)
    .array({ onlyFirstError: true });

  if (!errors.length) {
    // ═══════════════════════════════════════════════════════════════
    // Извлекаем санитизированные данные через matchedData()
    // ═══════════════════════════════════════════════════════════════
    // matchedData() возвращает значения ПОСЛЕ применения sanitizers:
    // - .toInt() превратит "123" в 123 (number)
    // - .trim() уберёт пробелы
    // - .default(value) применит дефолтное значение
    //
    // includeOptionals: true — включает поля с .optional().default()
    // ═══════════════════════════════════════════════════════════════
    req.sanitized = {
      query: matchedData(req, {
        locations: ['query'],
        includeOptionals: true,
      }) as Record<string, unknown>,
    };

    next();
    return;
  }

  res
    .status(HttpStatus.UnprocessableEntity)
    .json(createErrorMessages(errors, req.path));
};
