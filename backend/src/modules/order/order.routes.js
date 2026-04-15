import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { orderController } from './order.controller.js';
import { orderCreateSchema, orderDetailSchema } from './order.validator.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.get('/preview', orderController.preview);
orderRouter.post('/', validate(orderCreateSchema), orderController.create);
orderRouter.get('/', orderController.list);
orderRouter.get('/:id', validate(orderDetailSchema), orderController.detail);
