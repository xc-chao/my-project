export function requestIdMiddleware(req, res, next) {
  const requestId = `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
