import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/requestIdMiddleware.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';
import { optionalAuth } from './middleware/authMiddleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { productRouter } from './modules/product/product.routes.js';
import { cartRouter } from './modules/cart/cart.routes.js';
import { orderRouter } from './modules/order/order.routes.js';
import { chatRouter } from './modules/chat/chat.routes.js';
import { addressRouter } from './modules/address/address.routes.js';
import { afterSaleRouter } from './modules/afterSale/afterSale.routes.js';
import { feedbackRouter } from './modules/feedback/feedback.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(
    session({
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    })
  );
  app.use(requestIdMiddleware);
  app.use(optionalAuth);

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok'
      }
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/addresses', addressRouter);
  app.use('/api/after-sales', afterSaleRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
