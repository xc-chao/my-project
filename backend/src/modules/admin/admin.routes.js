import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { adminController } from './admin.controller.js';
import {
  adminFeedbackStatusSchema,
  adminListSchema,
  adminOrderStatusSchema,
  adminProductUpdateSchema
} from './admin.validator.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/overview', adminController.overview);
adminRouter.get('/products', validate(adminListSchema), adminController.products);
adminRouter.patch('/products/:id', validate(adminProductUpdateSchema), adminController.updateProduct);
adminRouter.get('/orders', validate(adminListSchema), adminController.orders);
adminRouter.patch('/orders/:id/status', validate(adminOrderStatusSchema), adminController.updateOrderStatus);
adminRouter.get('/feedback', validate(adminListSchema), adminController.feedback);
adminRouter.patch('/feedback/:id/status', validate(adminFeedbackStatusSchema), adminController.updateFeedbackStatus);
