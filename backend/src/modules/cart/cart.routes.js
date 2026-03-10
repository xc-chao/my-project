import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { cartController } from './cart.controller.js';
import {
  addCartItemSchema,
  removeCartItemSchema,
  updateCartItemSchema
} from './cart.validator.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', validate(addCartItemSchema), cartController.addItem);
cartRouter.patch('/items/:id', validate(updateCartItemSchema), cartController.updateItem);
cartRouter.delete('/items/:id', validate(removeCartItemSchema), cartController.removeItem);
