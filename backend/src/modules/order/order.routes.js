import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { orderController } from './order.controller.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.post('/', orderController.create);
orderRouter.get('/', orderController.list);
orderRouter.get('/:id', orderController.detail);
