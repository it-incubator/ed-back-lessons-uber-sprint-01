import { ValidationErrorType } from './types/validationError';
import { JsonApiErrorDocument } from './types/validationError.dto';

/**
 * Преобразует путь поля в формат JSON Pointer (RFC 6901).
 *
 * express-validator возвращает путь с точками: "data.attributes.clientName"
 * JSON:API требует JSON Pointer со слешами: "/data/attributes/clientName"
 *
 * @example
 * formatPointer("data.attributes.clientName") // → "/data/attributes/clientName"
 * formatPointer("/data/attributes/clientName") // → "/data/attributes/clientName" (уже правильный)
 */
const formatPointer = (path: string): string => {
  if (path.startsWith('/')) return path; // уже в формате JSON Pointer
  return '/' + path.replace(/\./g, '/');
};

export const createErrorMessages = (
  errors: ValidationErrorType[],
  requestPath?: string,
): JsonApiErrorDocument => {
  return {
    errors: errors.map((error) => {
      const result: {
        status: string;
        title: string;
        code?: string;
        detail?: string;
        source?: { pointer?: string; parameter?: string };
        meta?: Record<string, unknown>;
      } = {
        status: error.status,
        title: error.title,
      };

      if (error.detail) result.detail = error.detail;
      if (error.code) result.code = error.code;

      // Форматируем source
      if (error.source) {
        const pointer = error.source.pointer
          ? formatPointer(error.source.pointer)
          : undefined;
        if (pointer || error.source.parameter) {
          result.source = {};
          if (pointer) {
              result.source.pointer = pointer;
          }
          if (error.source.parameter) {
              result.source.parameter = error.source.parameter;
          }
        }
      }

      if (error.meta) {
          result.meta = error.meta;
      }

      return result;
    }),
    meta: {
      timestamp: new Date().toISOString(),
      path: requestPath ?? '',
    },
  };
};
