import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { feedbackController } from './feedback.controller.js';
import { feedbackCreateSchema } from './feedback.validator.js';

export const feedbackRouter = Router();

// 公开：按商品查询评价列表
feedbackRouter.get('/', feedbackController.list);

// 需要登录：提交评价
feedbackRouter.post('/', requireAuth, validate(feedbackCreateSchema), feedbackController.create);
