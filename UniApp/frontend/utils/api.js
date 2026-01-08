// ==========================================
// API 接口封装
// 功能：封装所有后端接口调用
// ==========================================

const { request } = require('./request');

// ========== 认证相关 API ==========

/**
 * 微信小程序登录
 * @param {string} code - wx.login 获取的 code
 * @param {string} nickname - 用户昵称
 * @param {string} avatar - 用户头像
 */
export const wechatLogin = (code, nickname, avatar) => {
  return request('/auth/wechat-login', {
    method: 'POST',
    data: { code, nickname, avatar }
  });
};

/**
 * 手机号密码登录
 * @param {string} phone - 手机号
 * @param {string} password - 密码
 */
export const login = (phone, password) => {
  return request('/auth/login', {
    method: 'POST',
    data: { phone, password }
  });
};

/**
 * 手机号注册
 * @param {string} phone - 手机号
 * @param {string} password - 密码
 * @param {string} nickname - 昵称
 */
export const register = (phone, password, nickname) => {
  return request('/auth/register', {
    method: 'POST',
    data: { phone, password, nickname }
  });
};

/**
 * 获取用户信息
 */
export const getUserProfile = () => {
  return request('/auth/profile');
};

/**
 * 获取账户余额
 */
export const getBalance = () => {
  return request('/auth/balance');
};

// ========== 购物车相关 API ==========

/**
 * 获取购物车列表
 */
export const getCart = () => {
  return request('/cart');
};

/**
 * 添加商品到购物车
 * @param {number} productId - 商品ID
 * @param {number} quantity - 数量
 */
export const addToCart = (productId, quantity = 1) => {
  return request('/cart', {
    method: 'POST',
    data: { productId, quantity }
  });
};

/**
 * 更新购物车商品
 * @param {number} id - 购物车项ID
 * @param {Object} data - 更新数据 { quantity?, selected? }
 */
export const updateCartItem = (id, data) => {
  return request(`/cart/${id}`, {
    method: 'PUT',
    data
  });
};

/**
 * 删除购物车商品
 * @param {number} id - 购物车项ID
 */
export const deleteCartItem = (id) => {
  return request(`/cart/${id}`, {
    method: 'DELETE'
  });
};

/**
 * 清空购物车
 */
export const clearCart = () => {
  return request('/cart', {
    method: 'DELETE'
  });
};

/**
 * 全选/取消全选
 * @param {boolean} selected - 是否选中
 */
export const selectAllCart = (selected) => {
  return request('/cart/select-all', {
    method: 'PUT',
    data: { selected }
  });
};

/**
 * 获取购物车数量
 */
export const getCartCount = () => {
  return request('/cart/count');
};

// ========== 订单相关 API ==========

/**
 * 创建订单
 * @param {Array} cartItemIds - 购物车项ID数组（可选）
 */
export const createOrder = (cartItemIds) => {
  return request('/orders', {
    method: 'POST',
    data: { cartItemIds }
  });
};

/**
 * 获取订单列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {number} status - 状态筛选
 */
export const getOrders = (page = 1, pageSize = 10, status) => {
  let url = `/orders?page=${page}&pageSize=${pageSize}`;
  if (status !== undefined) {
    url += `&status=${status}`;
  }
  return request(url);
};

/**
 * 获取订单详情
 * @param {number} id - 订单ID
 */
export const getOrderDetail = (id) => {
  return request(`/orders/${id}`);
};

/**
 * 取消订单
 * @param {number} id - 订单ID
 */
export const cancelOrder = (id) => {
  return request(`/orders/${id}/cancel`, {
    method: 'PUT'
  });
};

/**
 * 获取订单统计
 */
export const getOrderStats = () => {
  return request('/orders/stats');
};

// ========== 支付相关 API ==========

/**
 * 创建支付订单
 * @param {number} orderId - 订单ID
 * @param {string} paymentMethod - 支付方式（wechat/balance）
 */
export const createPayment = (orderId, paymentMethod = 'wechat') => {
  return request('/payments/create', {
    method: 'POST',
    data: { orderId, paymentMethod }
  });
};

/**
 * 模拟支付成功（开发环境）
 * @param {string} paymentNo - 支付流水号
 */
export const mockPay = (paymentNo) => {
  return request('/payments/mock-pay', {
    method: 'POST',
    data: { paymentNo }
  });
};

/**
 * 查询支付状态
 * @param {string} paymentNo - 支付流水号
 */
export const getPaymentStatus = (paymentNo) => {
  return request(`/payments/${paymentNo}`);
};

// ========== 商品相关 API ==========

/**
 * 获取商品列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {string} category - 分类筛选
 * @param {string} keyword - 搜索关键词
 */
export const getProducts = (page = 1, pageSize = 20, category, keyword) => {
  let url = `/products?page=${page}&pageSize=${pageSize}`;
  if (category && category !== '') {
    url += `&category=${encodeURIComponent(category)}`;
  }
  if (keyword && keyword !== '') {
    url += `&keyword=${encodeURIComponent(keyword)}`;
  }
  return request(url);
};

/**
 * 获取商品详情
 * @param {number} id - 商品ID
 */
export const getProductById = (id) => {
  return request(`/products/${id}`);
};

/**
 * 根据条码查询商品
 * @param {string} barcode - 商品条码
 */
export const getProductByBarcode = (barcode) => {
  return request(`/products/barcode/${barcode}`);
};

/**
 * 获取商品分类列表
 */
export const getCategories = () => {
  return request('/products/categories');
};

