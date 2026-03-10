import { AppError } from '../common/errors/AppError.js';

const store = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
}

function cleanup() {
  const now = Date.now();

  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function createRateLimitMiddleware(namespace = 'default') {
  return function rateLimitMiddleware(req, res, next) {
    cleanup();

    const ip = getClientIp(req);
    const key = `${namespace}:${ip}`;
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + WINDOW_MS
      });

      res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS));
      res.setHeader('X-RateLimit-Remaining', String(MAX_REQUESTS - 1));
      next();
      return;
    }

    existing.count += 1;
    const remaining = Math.max(MAX_REQUESTS - existing.count, 0);

    res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(existing.resetAt));

    if (existing.count > MAX_REQUESTS) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      next(new AppError(429, 'RATE_LIMIT_EXCEEDED', `请求过于频繁，请在 ${retryAfter} 秒后重试`));
      return;
    }

    next();
  };
}
