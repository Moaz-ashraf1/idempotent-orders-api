import { idempotencyRepository, hashRequestBody  } from "./idempotency.repository";
import { IdempotencyRecord } from "./idempotency.types";

export const idempotencyService = { 
    async acquireLock(key: string, requestBody: unknown):Promise<boolean> {
        const requestHash = hashRequestBody(requestBody);
       return idempotencyRepository.tryAcquireLock(key,requestHash);
    },


    async getExistingRecord (key: string): Promise<IdempotencyRecord | null> {
      return idempotencyRepository.get(key);
    },


    async completeWithResult(key:string ,requestBody:unknown ,httpStatus:number, responseBody:unknown):Promise<void>{
        const requestHash = hashRequestBody(requestBody);
        await idempotencyRepository.saveResult(key, requestHash,httpStatus, responseBody);
    },

    isSameRequest(existingRecord: IdempotencyRecord, requestBody: unknown): boolean {
    const newHash = hashRequestBody(requestBody);
    return existingRecord.requestHash === newHash;
  },
};