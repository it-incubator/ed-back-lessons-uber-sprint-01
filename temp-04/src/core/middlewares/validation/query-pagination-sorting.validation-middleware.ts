import { query } from 'express-validator';
import { SortDirection } from '../../types/sort-direction';

// Дефолтные значения
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

// Дефолтные значения используются в валидации через .default()
// Экспорт не нужен — значения применяются автоматически

/**
 * Валидация и санитизация параметров пагинации и сортировки.
 *
 * КАК РАБОТАЕТ .toInt() и другие sanitizers:
 * ─────────────────────────────────────────────────────────────────────
 *
 * 1. Express получает query параметры ВСЕГДА как строки:
 *    GET /api/drivers?pageNumber=1&pageSize=10
 *    → req.query = { pageNumber: "1", pageSize: "10" }
 *
 * 2. express-validator применяет .toInt() — превращает "1" в 1 (number)
 *    НО! Результат НЕ записывается обратно в req.query.
 *    Это ограничение Express — req.query readonly для типов.
 *
 * 3. Санитизированные значения доступны ТОЛЬКО через matchedData():
 *    const data = matchedData(req, { locations: ['query'] });
 *    → data = { pageNumber: 1, pageSize: 10 } // числа!
 *
 * 4. inputValidationResultMiddleware вызывает matchedData()
 *    и сохраняет результат в req.sanitized.query
 *
 * ИСПОЛЬЗОВАНИЕ В HANDLER:
 * ```typescript
 * // ❌ НЕПРАВИЛЬНО — будут строки!
 * const query = req.query as SomeType;
 *
 * // ✅ ПРАВИЛЬНО — будут числа!
 * const query = req.sanitized?.query as SomeType;
 * ```
 */
export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>,
) {
  const allowedSortFields = Object.values(sortFieldsEnum);

  return [
    // ВАЖНО: .default() должен быть ПЕРЕД .optional()!
    // Если .optional() первый — вся цепочка пропускается при отсутствии поля.
    // С .default() первым — значение подставляется, потом валидируется.
    query('pageNumber')
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(), // "1" → 1

    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(), // "10" → 10

    query('sortBy')
      .default(allowedSortFields[0]) // Первое значение enum как дефолтное
      .isIn(allowedSortFields)
      .withMessage(
        `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
      ),

    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
      ),
  ];
}
