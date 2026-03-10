import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validateMiddleware.js';
import { createRateLimitMiddleware } from '../../middleware/rateLimitMiddleware.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { smsCodeSchema, smsLoginSchema, wechatLoginSchema } from './auth.validator.js';

export const authRouter = Router();

authRouter.post(
  '/wechat-login',
  createRateLimitMiddleware('auth:wechat-login'),
  validate(wechatLoginSchema),
  authController.wechatLogin
);
authRouter.post(
  '/sms-code',
  createRateLimitMiddleware('auth:sms-code'),
  validate(smsCodeSchema),
  authController.smsCode
);
authRouter.post(
  '/sms-login',
  createRateLimitMiddleware('auth:sms-login'),
  validate(smsLoginSchema),
  authController.smsLogin
);
authRouter.post('/logout', authController.logout);
authRouter.get('/profile', requireAuth, authController.profile);
