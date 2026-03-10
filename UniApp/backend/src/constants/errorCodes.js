// ==========================================
// 错误码定义
// 功能：统一管理系统所有的错误码和错误信息
// ==========================================

/**
 * 错误码规范：
 * - 200: 成功
 * - 400-499: 客户端错误
 * - 500-599: 服务器错误
 */

module.exports = {
  // ========== 成功 ==========
  SUCCESS: {
    code: 200,
    message: '操作成功'
  },

  // ========== 通用错误 (400-409) ==========
  BAD_REQUEST: {
    code: 400,
    message: '请求参数错误'
  },
  
  UNAUTHORIZED: {
    code: 401,
    message: '未授权，请先登录'
  },
  
  FORBIDDEN: {
    code: 403,
    message: '无权限访问'
  },
  
  NOT_FOUND: {
    code: 404,
    message: '资源不存在'
  },

  // ========== 认证相关错误 (1001-1099) ==========
  AUTH_TOKEN_MISSING: {
    code: 1001,
    message: '未提供认证令牌'
  },
  
  AUTH_TOKEN_INVALID: {
    code: 1002,
    message: '认证令牌无效或已过期'
  },
  
  AUTH_TOKEN_EXPIRED: {
    code: 1003,
    message: '认证令牌已过期'
  },
  
  AUTH_LOGIN_FAILED: {
    code: 1004,
    message: '登录失败，用户名或密码错误'
  },
  
  AUTH_USER_NOT_FOUND: {
    code: 1005,
    message: '用户不存在'
  },
  
  AUTH_USER_EXISTED: {
    code: 1006,
    message: '用户已存在'
  },
  
  AUTH_PHONE_EXISTED: {
    code: 1007,
    message: '手机号已被注册'
  },
  
  AUTH_PASSWORD_INCORRECT: {
    code: 1008,
    message: '密码错误'
  },
  
  AUTH_WECHAT_CODE_INVALID: {
    code: 1009,
    message: '微信登录code无效'
  },

  // ========== 用户相关错误 (1100-1199) ==========
  USER_PHONE_REQUIRED: {
    code: 1100,
    message: '手机号不能为空'
  },
  
  USER_PASSWORD_REQUIRED: {
    code: 1101,
    message: '密码不能为空'
  },
  
  USER_PHONE_INVALID: {
    code: 1102,
    message: '手机号格式不正确'
  },
  
  USER_PASSWORD_WEAK: {
    code: 1103,
    message: '密码强度不足（至少6位）'
  },
  
  USER_BALANCE_INSUFFICIENT: {
    code: 1104,
    message: '账户余额不足'
  },

  // ========== 商品相关错误 (1200-1299) ==========
  PRODUCT_NOT_FOUND: {
    code: 1200,
    message: '商品不存在'
  },
  
  PRODUCT_STOCK_INSUFFICIENT: {
    code: 1201,
    message: '商品库存不足'
  },
  
  PRODUCT_OFF_SHELF: {
    code: 1202,
    message: '商品已下架'
  },

  // ========== 订单相关错误 (1300-1399) ==========
  ORDER_NOT_FOUND: {
    code: 1300,
    message: '订单不存在'
  },
  
  ORDER_ALREADY_PAID: {
    code: 1301,
    message: '订单已支付'
  },
  
  ORDER_ALREADY_CANCELLED: {
    code: 1302,
    message: '订单已取消'
  },
  
  ORDER_CANNOT_CANCEL: {
    code: 1303,
    message: '订单状态不允许取消'
  },
  
  ORDER_CREATE_FAILED: {
    code: 1304,
    message: '订单创建失败'
  },

  // ========== 购物车相关错误 (1400-1499) ==========
  CART_EMPTY: {
    code: 1400,
    message: '购物车为空'
  },
  
  CART_ITEM_NOT_FOUND: {
    code: 1401,
    message: '购物车商品不存在'
  },

  // ========== 服务器错误 (500-599) ==========
  SERVER_ERROR: {
    code: 500,
    message: '服务器内部错误'
  },
  
  DATABASE_ERROR: {
    code: 501,
    message: '数据库操作失败'
  },
  
  WECHAT_API_ERROR: {
    code: 502,
    message: '微信接口调用失败'
  }
};

