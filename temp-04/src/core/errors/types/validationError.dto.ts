type JsonApiErrorSource = {
  pointer?: string;
  parameter?: string;
};

type JsonApiError = {
  status: string; // ОБЯЗАТЕЛЬНО
  title: string; // ОБЯЗАТЕЛЬНО
  code?: string;
  detail?: string; // опционально
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
