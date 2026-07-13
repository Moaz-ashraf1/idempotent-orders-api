import { Router } from 'express';
import { ordersController } from './orders.controller';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';
import { fingerprintMiddleware } from '../../middlewares/fingerprint.middleware';
import { hybridMiddleware } from '../../middlewares/hybrid.middleware';

const router = Router();

router.post('/orders', idempotencyMiddleware, ordersController.create);
router.post('/orders-fingerprint', fingerprintMiddleware, ordersController.createViaFingerprint);
router.post('/orders-hybrid', hybridMiddleware, ordersController.createViaHybrid);
router.get('/orders', ordersController.list);

export default router;