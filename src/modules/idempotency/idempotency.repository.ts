import crypto from 'crypto';
import { redisClient } from '../../config/redis.client';
import { IdempotencyRecord } from './idempotency.types';

const TTL_SECONDS = 60 * 60 * 24; // 24 ساعة
const KEY_PREFIX = 'idempotency:';

function buildKey(key: string): string {
  return `${KEY_PREFIX}${key}`;
}

export function hashRequestBody(body: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
}

export const idempotencyRepository = {
  async tryAcquireLock(key: string, requestHash: string): Promise<boolean> {
    const record: IdempotencyRecord = { status: 'PROCESSING', requestHash };
    const result = await redisClient.set(
      buildKey(key),
      JSON.stringify(record),
      'EX',
      TTL_SECONDS,
      'NX'
    );
    return result === 'OK';
  },

  async get(key: string): Promise<IdempotencyRecord | null> {
    const raw = await redisClient.get(buildKey(key));
    if (!raw) return null;
    return JSON.parse(raw) as IdempotencyRecord;
  },

  async saveResult(key: string, requestHash: string, httpStatus: number, responseBody: unknown): Promise<void> {
    const record: IdempotencyRecord = {
      status: 'COMPLETED',
      requestHash,
      httpStatus,
      responseBody,
    };
    await redisClient.set(buildKey(key), JSON.stringify(record), 'EX', TTL_SECONDS);
  },
};