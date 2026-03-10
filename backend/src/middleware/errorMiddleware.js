import { logger } from '../common/logger/logger.js';

export function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `接口不存在: ${req.method} ${req.originalUrl}`,
    requestId: req.requestId
  });
}

export function errorMiddleware(error, req, res, _next) {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = error.message || '服务器开小差了，请稍后重试';

  logger.error(message, {
    requestId: req.requestId,
    stack: error.stack
  });

  res.status(statusCode).json({
    success: false,
    code,
    message,
    requestId: req.requestId,
    details: error.details || null
  });
}
