import { idempotencyRepository } from "./idempotency.repository";
import { IdempotencyRecord } from "./idempotency.types";

export const idempotencyService = { 
    async acquireLock(key: string):Promise<boolean> {
       return idempotencyRepository.tryAcquireLock(key);
    },


    async getExistingRecord (key: string): Promise<IdempotencyRecord | null> {
      return idempotencyRepository.get(key);
    },


    async completeWithResult(key:string , httpStatus:number, responseBody:unknown):Promise<void>{
        await idempotencyRepository.saveResult(key, httpStatus, responseBody);
    }

};