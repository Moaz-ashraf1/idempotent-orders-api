import { Request, Response, NextFunction } from 'express';
import { idempotencyMiddleware } from './idempotency.middleware';
import { fingerprintMiddleware } from './fingerprint.middleware';


export interface RequestHybrid extends Request {
  requestFingerprint?: string;
  idempotencyKey?: string;
}

export async function hybridMiddleware(req:Request, res:Response, next:NextFunction) {
    const hasIdempotencyKey = Boolean(req.header('Idempotency-Key'));

    if(hasIdempotencyKey){
        return idempotencyMiddleware(req,res,next);
    }

    return fingerprintMiddleware(req,res,next);

}