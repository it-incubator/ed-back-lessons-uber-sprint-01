export type ValidationErrorType = {
  status: string; // HTTP status как строка ("400", "404")
  title: string; // ОБЯЗАТЕЛЬНО: краткое описание типа ошибки
  detail?: string; // опционально: подробное описание
  source?: {
    pointer?: string; // JSON Pointer на поле в body
    parameter?: string; // имя query параметра
  };
  code?: string;
  meta?: Record<string, unknown>;
};
