import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../common/errors/AppError.js';

export function optionalAuth(req, _res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next();
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    req.user = null;
  }

  next();
}

export function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next(new AppError(401, 'UNAUTHORIZED', '请先登录'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch (_error) {
    next(new AppError(401, 'INVALID_TOKEN', '登录状态已失效，请重新登录'));
  }
}
