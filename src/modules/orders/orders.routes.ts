import { Router } from 'express';
import { ordersController } from './orders.controller';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware';

const router = Router();

router.post('/orders', idempotencyMiddleware, ordersController.create);
router.get('/orders', ordersController.list);

export default router;