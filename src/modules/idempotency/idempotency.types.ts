export type IdempotencyStatus =
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface IdempotencyRecord {
    status: IdempotencyStatus;
    responseBody?: unknown;
    httpStatus?: number;
}