import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { createRateLimitMiddleware } from '../../middleware/rateLimitMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { chatController } from './chat.controller.js';
import { createSessionSchema, sendMessageSchema } from './chat.validator.js';

export const chatRouter = Router();

chatRouter.use(requireAuth);
chatRouter.post('/sessions', validate(createSessionSchema), chatController.createSession);
chatRouter.post(
  '/messages',
  createRateLimitMiddleware('chat:messages'),
  validate(sendMessageSchema),
  chatController.sendMessage
);
chatRouter.get('/history', chatController.history);
