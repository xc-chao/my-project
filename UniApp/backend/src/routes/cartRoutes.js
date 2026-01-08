// ==========================================
// 购物车路由（CartRoutes）
// 基础路径：/api/cart
// 功能：定义购物车相关的 API 路由
// ==========================================

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');

// ========== 所有购物车接口都需要登录认证 ==========

/**
 * 获取购物车列表
 * GET /api/cart
 * Header: Authorization: Bearer <token>
 */
router.get('/', authMiddleware, asyncHandler(cartController.getCart));

/**
 * 获取购物车商品数量（用于角标）
 * GET /api/cart/count
 * Header: Authorization: Bearer <token>
 */
router.get('/count', authMiddleware, asyncHandler(cartController.getCartCount));

/**
 * 添加商品到购物车
 * POST /api/cart
 * Header: Authorization: Bearer <token>
 * Body: { productId, quantity? }
 */
router.post('/', authMiddleware, asyncHandler(cartController.addToCart));

/**
 * 全选/取消全选
 * PUT /api/cart/select-all
 * Header: Authorization: Bearer <token>
 * Body: { selected }
 */
router.put('/select-all', authMiddleware, asyncHandler(cartController.selectAll));

/**
 * 更新购物车商品（修改数量或选中状态）
 * PUT /api/cart/:id
 * Header: Authorization: Bearer <token>
 * Body: { quantity?, selected? }
 */
router.put('/:id', authMiddleware, asyncHandler(cartController.updateCartItem));

/**
 * 删除购物车商品
 * DELETE /api/cart/:id
 * Header: Authorization: Bearer <token>
 */
router.delete('/:id', authMiddleware, asyncHandler(cartController.deleteCartItem));

/**
 * 批量删除购物车商品
 * DELETE /api/cart/batch
 * Header: Authorization: Bearer <token>
 * Body: { ids: [1, 2, 3] }
 */
router.delete('/batch', authMiddleware, asyncHandler(cartController.batchDelete));

/**
 * 清空购物车
 * DELETE /api/cart
 * Header: Authorization: Bearer <token>
 */
router.delete('/', authMiddleware, asyncHandler(cartController.clearCart));

module.exports = router;

