# JSON:API Error Objects - Инструкция по внедрению

Руководство по реализации формата ошибок согласно [JSON:API спецификации v1.1](https://jsonapi.org/format/#error-objects).

---

## 1. Структура ответа ошибки

```json
{
  "errors": [
    {
      "status": "400",
      "title": "Validation Error",
      "detail": "clientName should be at least 3 characters",
      "code": "VALIDATION_ERROR",
      "source": {
        "pointer": "/data/attributes/clientName"
      },
      "meta": {}
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/rides"
  }
}
```

---

## 2. Описание полей

### Поля объекта ошибки (JsonApiError)

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `status` | string | **да** | HTTP статус код как строка ("400", "404", "422") |
| `title` | string | **да** | Краткое описание типа ошибки ("Validation Error", "Not Found") |
| `code` | string | нет | Код ошибки приложения (например "RIDE_ALREADY_FINISHED") |
| `detail` | string | нет | Подробное описание конкретной ошибки |
| `source.pointer` | string | нет | JSON Pointer (RFC6901) на поле в request body |
| `source.parameter` | string | нет | Имя query параметра, вызвавшего ошибку |
| `meta` | object | нет | Дополнительные метаданные ошибки |

### Поля meta документа (JsonApiErrorDocumentMeta)

| Поле | Тип | Описание |
|------|-----|----------|
| `timestamp` | string | ISO 8601 timestamp |
| `path` | string | Путь запроса |
| `traceId` | string | ID для трейсинга (опционально) |

### Когда использовать pointer vs parameter

- **`source.pointer`** - для ошибок в теле запроса (JSON body)
  - Формат: `/data/attributes/fieldName`
  - Пример: `/data/attributes/clientName`

- **`source.parameter`** - для ошибок в query параметрах
  - Формат: `paramName`
  - Пример: `sort`, `pageSize`

---

## 3. TypeScript типы

### validationError.ts

```typescript
export type ValidationErrorType = {
  status: string;   // HTTP status как строка ("400", "404")
  title: string;    // ОБЯЗАТЕЛЬНО: краткое описание типа ошибки
  detail?: string;  // опционально: подробное описание
  source?: {
    pointer?: string;    // JSON Pointer на поле в body
    parameter?: string;  // имя query параметра
  };
  code?: string;
  meta?: Record<string, unknown>;
};
```

### validationError.dto.ts

```typescript
type JsonApiErrorSource = {
  pointer?: string;
  parameter?: string;
};

type JsonApiError = {
  status: string;   // ОБЯЗАТЕЛЬНО
  title: string;    // ОБЯЗАТЕЛЬНО
  code?: string;
  detail?: string;
  source?: JsonApiErrorSource;
  meta?: Record<string, unknown>;
};

type JsonApiErrorDocumentMeta = {
  timestamp: string;
  path: string;
  traceId?: string;
};

export type JsonApiErrorDocument = {
  errors: JsonApiError[];
  meta?: JsonApiErrorDocumentMeta;
};
```

---

## 4. Функция создания ошибок

### create-error-messages.ts

```typescript
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
          if (pointer) result.source.pointer = pointer;
          if (error.source.parameter) result.source.parameter = error.source.parameter;
        }
      }

      if (error.meta) result.meta = error.meta;

      return result;
    }),
    meta: {
      timestamp: new Date().toISOString(),
      path: requestPath ?? '',
    },
  };
};
```

---

## 5. Middleware валидации (express-validator)

### input-validation-result.middleware.ts

```typescript
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
    status: String(HttpStatus.BadRequest),
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
    .status(HttpStatus.BadRequest)
    .json(createErrorMessages(errors, req.path));
};
```

---

## 6. Обработчик ошибок

### errors.handler.ts

```typescript
import { Request, Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../types/http-statuses';
import { DomainError } from './domain.error';
import { createErrorMessages } from './create-error-messages';

export function errorsHandler(
  error: unknown,
  res: Response,
  req: Request,
): void {
  // Not Found ошибки
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

  // Доменные ошибки (бизнес-логика)
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

  // Внутренние ошибки сервера (без detail - не раскрываем детали)
  res.status(HttpStatus.InternalServerError).send(
    createErrorMessages(
      [
        {
          status: String(HttpStatus.InternalServerError),
          title: 'Internal Server Error',
        },
      ],
      req.path,
    ),
  );
}
```

---

## 7. Использование в handlers

```typescript
export async function createRideHandler(req: Request, res: Response) {
  try {
    // ... бизнес-логика
  } catch (e: unknown) {
    errorsHandler(e, res, req); // передаем req для meta.path
  }
}
```

---

## 8. OpenAPI/Swagger схемы

```yaml
components:
  schemas:
    JsonApiErrorSource:
      type: object
      description: Pointer to the associated entity in the request document
      properties:
        pointer:
          type: string
          description: "JSON Pointer [RFC6901] to request body field. e.g. \"/data/attributes/field\""
          example: "/data/attributes/clientName"
        parameter:
          type: string
          description: "URI query parameter name that caused the error"
          example: "sort"

    JsonApiError:
      type: object
      required:
        - status
        - title
      properties:
        status:
          type: string
          description: HTTP status code as a string
          example: "400"
        title:
          type: string
          description: Short, human-readable summary (REQUIRED)
          example: "Validation Error"
        code:
          type: string
          description: Application-specific error code
          example: "RIDE_ALREADY_FINISHED"
        detail:
          type: string
          description: Detailed explanation of the error (optional)
          example: "clientName should be at least 3 characters"
        source:
          $ref: '#/components/schemas/JsonApiErrorSource'
        meta:
          type: object
          description: Any extra data
          additionalProperties: true

    JsonApiErrorDocumentMeta:
      type: object
      description: "Meta information: timestamp, path, traceId, etc."
      properties:
        timestamp:
          type: string
          format: date-time
          example: "2024-01-15T10:30:00.000Z"
        path:
          type: string
          example: "/api/rides"
        traceId:
          type: string
          example: "abc123"

    JsonApiErrorDocument:
      type: object
      required:
        - errors
      properties:
        errors:
          type: array
          items:
            $ref: '#/components/schemas/JsonApiError'
          description: Array of one or more errors
        meta:
          $ref: '#/components/schemas/JsonApiErrorDocumentMeta'
```

### Использование в responses:

```yaml
responses:
  400:
    description: Validation Error
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/JsonApiErrorDocument'
  404:
    description: Not Found
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/JsonApiErrorDocument'
  422:
    description: Unprocessable Entity (Domain Error)
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/JsonApiErrorDocument'
```

---

## 9. Примеры ответов

### Ошибка валидации (400)

```json
{
  "errors": [
    {
      "status": "400",
      "title": "Validation Error",
      "detail": "clientName should be at least 3 characters",
      "source": {
        "pointer": "/data/attributes/clientName"
      }
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/rides"
  }
}
```

### Доменная ошибка (422)

```json
{
  "errors": [
    {
      "status": "422",
      "code": "RIDE_ALREADY_FINISHED",
      "title": "Unprocessable Entity",
      "detail": "Ride has already been finished"
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/rides/123/actions/finish"
  }
}
```

### Not Found (404)

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Not Found",
      "detail": "Driver with id 507f1f77bcf86cd799439011 not found"
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/drivers/507f1f77bcf86cd799439011"
  }
}
```

### Internal Server Error (500)

```json
{
  "errors": [
    {
      "status": "500",
      "title": "Internal Server Error"
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/rides"
  }
}
```

### Ошибка query параметра

```json
{
  "errors": [
    {
      "status": "400",
      "title": "Validation Error",
      "detail": "Invalid sort parameter",
      "source": {
        "parameter": "sort"
      }
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/rides"
  }
}
```

---

## 10. Чек-лист внедрения

- [ ] Создать типы `ValidationErrorType` и `JsonApiErrorDocument`
- [ ] Создать функцию `createErrorMessages` с `formatPointer`
- [ ] Обновить middleware валидации (передавать `req.path`)
- [ ] Обновить `errorsHandler` (добавить параметр `req`)
- [ ] Обновить все handlers: `errorsHandler(e, res, req)`
- [ ] Обновить Swagger схемы
- [ ] Заменить все ссылки на старые схемы ошибок

---

## Ссылки

- [JSON:API Error Objects Specification](https://jsonapi.org/format/#error-objects)
- [RFC 6901 - JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901)