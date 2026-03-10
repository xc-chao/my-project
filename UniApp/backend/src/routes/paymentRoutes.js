// ==========================================
// 支付路由（PaymentRoutes）
// 基础路径：/api/payments
// 功能：定义支付相关的 API 路由
// ==========================================

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');

// ========== 需要认证的接口 ==========

/**
 * 创建支付订单（微信支付统一下单/余额支付）
 * POST /api/payments/create
 * Header: Authorization: Bearer <token>
 * Body: { orderId, paymentMethod }
 */
router.post('/create', authMiddleware, asyncHandler(paymentController.createPayment));

/**
 * 查询支付状态
 * GET /api/payments/:paymentNo
 * Header: Authorization: Bearer <token>
 */
router.get('/:paymentNo', authMiddleware, asyncHandler(paymentController.getPaymentStatus));

/**
 * 模拟支付成功（开发环境）
 * POST /api/payments/mock-pay
 * Header: Authorization: Bearer <token>
 * Body: { paymentNo }
 */
router.post('/mock-pay', authMiddleware, asyncHandler(paymentController.mockPay));

// ========== 公开接口（微信回调无需认证）==========

/**
 * 微信支付回调通知
 * POST /api/payments/callback
 * 由微信服务器调用，无需 JWT 认证
 */
router.post('/callback', asyncHandler(paymentController.wechatPaymentCallback));

module.exports = router;

