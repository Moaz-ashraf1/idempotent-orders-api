import { Request, Response, NextFunction } from 'express';
import { fingerprintService } from '../modules/fingerprint/fingerprint.service';

export interface RequestWithFingerprint extends Request {
  requestFingerprint?: string;
}

const GUEST_USER_ID = 'guest-user';

export async function fingerprintMiddleware(req: RequestWithFingerprint, res: Response, next: NextFunction) {
  const { product, quantity } = req.body;

  if (!product || !quantity) {
    return next();
  }

  const fingerprint = fingerprintService.computeFingerprint(GUEST_USER_ID, product, quantity);

  const acquired = await fingerprintService.acquireLock(fingerprint);

  if (acquired) {
    req.requestFingerprint = fingerprint;
    return next();
  }

  const existingRecord = await fingerprintService.getExistingRecord(fingerprint);

  if (!existingRecord) {
    req.requestFingerprint = fingerprint;
    return next();
  }

  if (existingRecord.status === 'PROCESSING') {
    return res.status(202).json({
      message: 'A similar request is already being processed. Please wait.',
    });
  }

  return res.status(existingRecord.httpStatus || 200).json(existingRecord.responseBody);
}