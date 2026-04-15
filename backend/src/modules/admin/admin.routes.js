import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { adminController } from './admin.controller.js';
import {
  adminAfterSaleListSchema,
  adminAfterSaleStatusSchema,
  adminFeedbackStatusSchema,
  adminOrderDetailSchema,
  adminOrderLogisticsSchema,
  adminProductCreateSchema,
  adminProductDetailSchema,
  adminListSchema,
  adminOrderStatusSchema,
  adminProductUpdateSchema
} from './admin.validator.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/overview', adminController.overview);
adminRouter.get('/products', validate(adminListSchema), adminController.products);
adminRouter.post('/products', validate(adminProductCreateSchema), adminController.createProduct);
adminRouter.get('/products/:id', validate(adminProductDetailSchema), adminController.productDetail);
adminRouter.patch('/products/:id', validate(adminProductUpdateSchema), adminController.updateProduct);
adminRouter.get('/orders', validate(adminListSchema), adminController.orders);
adminRouter.get('/orders/:id', validate(adminOrderDetailSchema), adminController.orderDetail);
adminRouter.patch('/orders/:id/status', validate(adminOrderStatusSchema), adminController.updateOrderStatus);
adminRouter.patch('/orders/:id/logistics', validate(adminOrderLogisticsSchema), adminController.updateOrderLogistics);
adminRouter.get('/after-sales', validate(adminAfterSaleListSchema), adminController.afterSales);
adminRouter.patch('/after-sales/:id/status', validate(adminAfterSaleStatusSchema), adminController.updateAfterSaleStatus);
adminRouter.get('/feedback', validate(adminListSchema), adminController.feedback);
adminRouter.patch('/feedback/:id/status', validate(adminFeedbackStatusSchema), adminController.updateFeedbackStatus);
