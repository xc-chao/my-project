// ==========================================
// 认证路由（AuthRoutes）
// 基础路径：/api/auth
// 功能：定义用户认证相关的 API 路由
// ==========================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');

// ========== 公开路由（无需认证）==========

/**
 * 微信小程序登录
 * POST /api/auth/wechat-login
 * Body: { code, nickname?, avatar? }
 */
router.post('/wechat-login', asyncHandler(authController.wechatLogin));

/**
 * 手机号密码注册
 * POST /api/auth/register
 * Body: { phone, password, nickname? }
 */
router.post('/register', asyncHandler(authController.register));

/**
 * 手机号密码登录
 * POST /api/auth/login
 * Body: { phone, password }
 */
router.post('/login', asyncHandler(authController.login));

// ========== 需要认证的路由 ==========

/**
 * 获取当前用户信息
 * GET /api/auth/profile
 * Header: Authorization: Bearer <token>
 */
router.get('/profile', authMiddleware, asyncHandler(authController.getProfile));

/**
 * 更新用户信息
 * PUT /api/auth/profile
 * Header: Authorization: Bearer <token>
 * Body: { nickname?, avatar? }
 */
router.put('/profile', authMiddleware, asyncHandler(authController.updateProfile));

/**
 * 修改密码
 * PUT /api/auth/password
 * Header: Authorization: Bearer <token>
 * Body: { oldPassword, newPassword }
 */
router.put('/password', authMiddleware, asyncHandler(authController.changePassword));

/**
 * 绑定手机号
 * POST /api/auth/bind-phone
 * Header: Authorization: Bearer <token>
 * Body: { phone, password }
 */
router.post('/bind-phone', authMiddleware, asyncHandler(authController.bindPhone));

/**
 * 获取账户余额
 * GET /api/auth/balance
 * Header: Authorization: Bearer <token>
 */
router.get('/balance', authMiddleware, asyncHandler(authController.getBalance));

module.exports = router;

