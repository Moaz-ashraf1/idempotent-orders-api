import { Request, Response, NextFunction } from 'express';
import { ordersService } from './orders.service';
import { idempotencyService } from '../idempotency/idempotency.service';
import { fingerprintService } from '../fingerprint/fingerprint.service';
import { RequestWithIdempotency } from '../../middlewares/idempotency.middleware';
import { RequestWithFingerprint } from '../../middlewares/fingerprint.middleware';

export const ordersController = {
  async create(req: RequestWithIdempotency, res: Response, next: NextFunction) {
    try {
      const { product, quantity } = req.body;

      if (!product || !quantity) {
        return res.status(400).json({ error: 'product and quantity are required' });
      }

      const order = await ordersService.createOrder({ product, quantity });

      if (req.idempotencyKey) {
        await idempotencyService.completeWithResult(req.idempotencyKey, req.body, 201, order);
      }

      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  async createViaFingerprint(req: RequestWithFingerprint, res: Response, next: NextFunction) {
    try {
      const { product, quantity } = req.body;

      if (!product || !quantity) {
        return res.status(400).json({ error: 'product and quantity are required' });
      }

      const order = await ordersService.createOrder({ product, quantity });

      if (req.requestFingerprint) {
        await fingerprintService.completeWithResult(req.requestFingerprint, 201, order);
      }

      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await ordersService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
};