import { Request, Response, NextFunction } from 'express';
import { idempotencyService } from '../modules/idempotency/idempotency.service';

export interface RequestWithIdempotency extends Request {
  idempotencyKey?: string;
}

export async function idempotencyMiddleware(req: RequestWithIdempotency, res: Response, next: NextFunction) {
  const key = req.header('Idempotency-Key');

  if (!key) {
    return next();
  }

  const acquired = await idempotencyService.acquireLock(key,req.body);

  if (acquired) {
    req.idempotencyKey = key;
    return next();
  }

  const existingRecord = await idempotencyService.getExistingRecord(key);

  if (!existingRecord) {
    req.idempotencyKey = key;
    return next();
  }

  const isSameRequest = idempotencyService.isSameRequest(existingRecord, req.body);
  
   if (!isSameRequest) {
    return res.status(422).json({
      error: 'Idempotency-Key reuse detected with a different request payload',
      details: 'This key was previously used for a different request body. Use a new key for a new request.',
    });
  }

  if (existingRecord.status === 'PROCESSING') {
    return res.status(409).json({
      error: 'A request with this Idempotency-Key is already being processed',
    });
  }

  return res.status(existingRecord.httpStatus || 200).json(existingRecord.responseBody);
}