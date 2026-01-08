// ==========================================
// 订单路由（OrderRoutes）
// 基础路径：/api/orders
// 功能：定义订单相关的 API 路由
// ==========================================

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');

// ========== 所有订单接口都需要登录认证 ==========

/**
 * 创建订单（从购物车）
 * POST /api/orders
 * Header: Authorization: Bearer <token>
 * Body: { cartItemIds?: [] }
 */
router.post('/', authMiddleware, asyncHandler(orderController.createOrder));

/**
 * 获取订单列表（分页）
 * GET /api/orders?page=1&pageSize=10&status=0
 * Header: Authorization: Bearer <token>
 */
router.get('/', authMiddleware, asyncHandler(orderController.getOrders));

/**
 * 获取订单统计
 * GET /api/orders/stats
 * Header: Authorization: Bearer <token>
 */
router.get('/stats', authMiddleware, asyncHandler(orderController.getOrderStats));

/**
 * 根据订单号查询订单
 * GET /api/orders/by-order-no/:orderNo
 * Header: Authorization: Bearer <token>
 */
router.get('/by-order-no/:orderNo', authMiddleware, asyncHandler(orderController.getOrderByNo));

/**
 * 获取订单详情
 * GET /api/orders/:id
 * Header: Authorization: Bearer <token>
 */
router.get('/:id', authMiddleware, asyncHandler(orderController.getOrderDetail));

/**
 * 取消订单
 * PUT /api/orders/:id/cancel
 * Header: Authorization: Bearer <token>
 */
router.put('/:id/cancel', authMiddleware, asyncHandler(orderController.cancelOrder));

module.exports = router;

