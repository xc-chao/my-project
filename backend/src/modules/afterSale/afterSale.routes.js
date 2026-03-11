import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { afterSaleController } from './afterSale.controller.js';

export const afterSaleRouter = Router();

afterSaleRouter.use(requireAuth);
afterSaleRouter.get('/', afterSaleController.list);
afterSaleRouter.post('/', afterSaleController.create);
