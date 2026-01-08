// ==========================================
// JWT 认证中间件
// 功能：验证用户的登录状态（JWT token）
// ==========================================

const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');

/**
 * JWT 认证中间件
 * 
 * 功能说明：
 * 1. 从请求头中提取 Authorization token
 * 2. 验证 token 的有效性
 * 3. 解析 token 获取用户 ID
 * 4. 将用户 ID 存入 req.userId 供后续使用
 * 
 * 使用方法：
 * router.post('/xxx', authMiddleware, controller.xxx);
 * 
 * 前端需要在请求头中携带：
 * Authorization: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers['authorization'];

    // 如果没有 token，返回 401 未授权
    if (!authHeader) {
      return error(res, ErrorCodes.AUTH_TOKEN_MISSING);
    }

    // 提取 token（格式：Bearer <token>）
    const token = authHeader.split(' ')[1];
    if (!token) {
      return error(res, ErrorCodes.AUTH_TOKEN_MISSING);
    }

    // 验证 token
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'scanshop_secret_key_2025',
      (err, decoded) => {
        if (err) {
          // token 无效或已过期
          if (err.name === 'TokenExpiredError') {
            return error(res, ErrorCodes.AUTH_TOKEN_EXPIRED);
          }
          return error(res, ErrorCodes.AUTH_TOKEN_INVALID);
        }
        
        // 将用户信息存入 req 对象
        req.userId = decoded.userId;
        req.userType = decoded.type; // 登录类型（wechat/phone）
        req.userPhone = decoded.phone;
        req.userOpenid = decoded.openid;
        
        // 继续执行下一个中间件或控制器
        next();
      }
    );

  } catch (err) {
    console.error('认证中间件错误:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 可选认证中间件
 * 
 * 功能说明：
 * 如果有 token 则验证并注入用户信息，
 * 如果没有 token 则继续执行（不拦截）
 * 
 * 使用场景：
 * 某些接口可以匿名访问，但登录后有额外功能
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      // 没有 token，继续执行（不拦截）
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    // 验证 token
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'scanshop_secret_key_2025',
      (err, decoded) => {
        if (!err) {
          // token 有效，注入用户信息
          req.userId = decoded.userId;
          req.userType = decoded.type;
          req.userPhone = decoded.phone;
          req.userOpenid = decoded.openid;
        }
        // 继续执行（无论 token 是否有效）
        next();
      }
    );

  } catch (err) {
    // 出错也继续执行
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};

