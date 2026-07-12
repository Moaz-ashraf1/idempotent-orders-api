export type IdempotencyStatus =
  | 'PROCESSING'
  | 'COMPLETED';

export interface IdempotencyRecord {
    status: IdempotencyStatus;
    requestHash: string;
    responseBody?: unknown;
    httpStatus?: number;
}