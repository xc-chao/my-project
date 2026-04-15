import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { afterSaleController } from './afterSale.controller.js';
import { afterSaleCreateSchema } from './afterSale.validator.js';

export const afterSaleRouter = Router();

afterSaleRouter.use(requireAuth);
afterSaleRouter.get('/', afterSaleController.list);
afterSaleRouter.post('/', validate(afterSaleCreateSchema), afterSaleController.create);
