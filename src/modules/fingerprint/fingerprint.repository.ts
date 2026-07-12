import crypto from 'crypto';
import { redisClient } from '../../config/redis.client';
import { FingerprintRecord } from './fingerprint.types';

const TIME_WINDOW_SECONDS = 60;
const KEY_PREFIX = 'fingerprint:';

function buildKey(fingerprint:string):string{
    return `${KEY_PREFIX}${fingerprint}`
}

export function generateFingerprint(userId:string, product:string, quantity:number):string{
    const canonicalString = `${userId}|${product.trim().toLowerCase()}|${quantity}`;
    return crypto.createHash('sha256').update(canonicalString).digest('hex');
}

export const fingerprintRepository = {
    async tryAcquireLock(fingerprint:string):Promise<boolean>{
        const result = await redisClient.set(buildKey(fingerprint), '1', 'EX', TIME_WINDOW_SECONDS, 'NX');
        return result === 'OK';
    },

    async get(fingerprint:string):Promise<FingerprintRecord | null>{
        const raw = await redisClient.get(buildKey(fingerprint));
        if (!raw) return null;
        return JSON.parse(raw) as FingerprintRecord;
    },

    async saveResult(fingerprint:string, httpStatus:number, responseBody:unknown):Promise<void>{
        const record: FingerprintRecord = {
            status: 'COMPLETED',
            httpStatus,
            responseBody,
        };
        await redisClient.set(buildKey(fingerprint), JSON.stringify(record), 'EX', TIME_WINDOW_SECONDS);
    }
}