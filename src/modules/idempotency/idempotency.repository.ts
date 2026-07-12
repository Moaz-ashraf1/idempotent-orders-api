import { redisClient } from '../../config/redis.client';
import { IdempotencyRecord } from './idempotency.types';

const TTL_SECONDS = 60 * 60 * 24; // 24 ساعة
const KEY_PREFIX = 'idempotency:';

function buildKey(key: string): string {
  return `${KEY_PREFIX}${key}`;
}

export const idempotencyRepository = {
  async tryAcquireLock(key: string): Promise<boolean> {
    const record: IdempotencyRecord = { status: 'PROCESSING' };
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


  async saveResult(key: string, httpStatus: number, responseBody: unknown): Promise<void> {
    const record: IdempotencyRecord = {
      status: 'COMPLETED',
      httpStatus,
      responseBody,
    };
    await redisClient.set(buildKey(key), JSON.stringify(record), 'EX', TTL_SECONDS);
  },
};