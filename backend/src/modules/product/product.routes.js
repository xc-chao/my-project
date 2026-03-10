import { Router } from 'express';
import { createRateLimitMiddleware } from '../../middleware/rateLimitMiddleware.js';
import { productController } from './product.controller.js';

export const productRouter = Router();

productRouter.get('/products', productController.list);
productRouter.get('/products/:id', productController.detail);
productRouter.get('/categories', productController.categories);
productRouter.get('/search', createRateLimitMiddleware('search'), productController.list);
