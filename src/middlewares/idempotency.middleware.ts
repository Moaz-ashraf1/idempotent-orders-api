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

  const acquired = await idempotencyService.acquireLock(key);

  if (acquired) {
    req.idempotencyKey = key;
    return next();
  }

  const existingRecord = await idempotencyService.getExistingRecord(key);

  if (!existingRecord) {
    req.idempotencyKey = key;
    return next();
  }

  if (existingRecord.status === 'PROCESSING') {
    return res.status(409).json({
      error: 'A request with this Idempotency-Key is already being processed',
    });
  }

  return res.status(existingRecord.httpStatus || 200).json(existingRecord.responseBody);
}