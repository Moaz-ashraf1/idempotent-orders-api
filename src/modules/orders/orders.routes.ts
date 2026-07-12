import { Router } from 'express';
import { ordersController } from './orders.controller';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';
import { fingerprintMiddleware } from '../../middlewares/fingerprint.middleware';

const router = Router();

router.post('/orders', idempotencyMiddleware, ordersController.create);
router.post('/orders-fingerprint', fingerprintMiddleware, ordersController.createViaFingerprint);
router.get('/orders', ordersController.list);

export default router;