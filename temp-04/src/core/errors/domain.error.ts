export enum DomainErrorCode {
  BadRequest = 400,
}

export class DomainError extends Error {
  constructor(
    detail: string,
    public readonly code: DomainErrorCode,
    public readonly source?: string,
  ) {
    super(detail);
  }
}
