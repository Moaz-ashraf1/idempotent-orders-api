export type FingerprintStatus = 'PROCESSING' | 'COMPLETED';

export interface FingerprintRecord {
  status: FingerprintStatus;
  httpStatus?: number;
  responseBody?: unknown;
}