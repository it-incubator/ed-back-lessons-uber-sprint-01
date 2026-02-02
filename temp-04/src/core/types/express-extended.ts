/**
 * Расширение Express Request для типизированных санитизированных данных
 *
 * ПРОБЛЕМА:
 * Express всегда хранит req.query значения как строки.
 * Даже если express-validator применяет .toInt(), результат НЕ попадает
 * обратно в req.query — это фундаментальное ограничение Express.
 *
 * РЕШЕНИЕ:
 * Используем matchedData() из express-validator для получения
 * санитизированных значений и храним их в отдельном поле req.sanitized.
 *
 * ПРИМЕР:
 * ```
 * // В validation middleware после успешной валидации:
 * req.sanitized = { query: matchedData(req, { locations: ['query'] }) };
 *
 * // В handler:
 * const { pageNumber, pageSize } = req.sanitized.query;
 * // pageNumber и pageSize — уже числа благодаря .toInt()
 * ```
 */

// Расширяем глобальный namespace Express
declare global {
  namespace Express {
    interface Request {
      /**
       * Санитизированные данные из express-validator.
       * Доступны только после прохождения inputValidationResultMiddleware.
       */
      sanitized?: {
        query?: Record<string, unknown>;
      };
    }
  }
}

export {};
