import { AppError } from '../common/errors/AppError.js';

export function validate(schema) {
  return function validateMiddleware(req, _res, next) {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      next(new AppError(400, 'VALIDATION_ERROR', '请求参数不合法', result.error.flatten()));
      return;
    }

    req.validated = result.data;
    next();
  };
}
