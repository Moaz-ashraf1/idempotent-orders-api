import { fingerprintRepository, generateFingerprint } from './fingerprint.repository';
import { FingerprintRecord } from './fingerprint.types';

export const fingerprintService = {
    computeFingerprint(userId:string, product:string, quantity:number):string{
        return generateFingerprint(userId, product, quantity);
    },

    async acquireLock(fingerprint: string): Promise<boolean> {
        return fingerprintRepository.tryAcquireLock(fingerprint);
    },

    async getExistingRecord(fingerprint: string): Promise<FingerprintRecord | null> {
        return fingerprintRepository.get(fingerprint);
    },

     async completeWithResult(fingerprint: string, httpStatus: number, responseBody: unknown): Promise<void> {
        await fingerprintRepository.saveResult(fingerprint, httpStatus, responseBody);
    },



}