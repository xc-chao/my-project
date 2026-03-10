// ==========================================
// 统一错误处理中间件
// 功能：捕获所有未处理的错误，返回统一格式的错误响应
// ==========================================

const ErrorCodes = require('../constants/errorCodes');

/**
 * 404 错误处理
 * 当请求的路由不存在时触发
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    code: 404,
    message: `接口不存在: ${req.method} ${req.path}`,
    data: null
  });
};

/**
 * 全局错误处理中间件
 * 捕获所有未处理的异常
 * 
 * 使用方法：
 * app.use(errorHandler); // 放在所有路由之后
 */
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  console.error('========== 错误详情 ==========');
  console.error('时间:', new Date().toLocaleString('zh-CN'));
  console.error('路径:', req.method, req.path);
  console.error('错误:', err);
  console.error('==============================');

  // Sequelize 数据库错误
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      code: 400,
      message: '数据验证失败',
      data: {
        errors: err.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      }
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      code: 400,
      message: '数据已存在（唯一性约束冲突）',
      data: {
        fields: err.fields
      }
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      code: ErrorCodes.DATABASE_ERROR.code,
      message: ErrorCodes.DATABASE_ERROR.message,
      data: null
    });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      code: ErrorCodes.AUTH_TOKEN_INVALID.code,
      message: ErrorCodes.AUTH_TOKEN_INVALID.message,
      data: null
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      code: ErrorCodes.AUTH_TOKEN_EXPIRED.code,
      message: ErrorCodes.AUTH_TOKEN_EXPIRED.message,
      data: null
    });
  }

  // 默认服务器错误
  res.status(500).json({
    code: 500,
    message: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message, // 开发环境显示详细错误
    data: null
  });
};

/**
 * 异步路由错误捕获包装器
 * 
 * 功能说明：
 * 包装 async 函数，自动捕获异常并传递给错误处理中间件
 * 
 * 使用方法：
 * router.get('/xxx', asyncHandler(async (req, res) => {
 *   // 如果这里抛出异常，会自动被捕获
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler
};

