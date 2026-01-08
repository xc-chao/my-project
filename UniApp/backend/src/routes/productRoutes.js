// ==========================================
// 商品路由（ProductRoutes）
// 基础路径：/api/products
// 功能：定义商品相关的 API 路由
// ==========================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { optionalAuthMiddleware } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/errorHandler');

// ========== 商品接口（公开，可选认证）==========

/**
 * 获取商品列表（分页、搜索、筛选）
 * GET /api/products?page=1&pageSize=20&category=饮料&keyword=可乐
 */
router.get('/', optionalAuthMiddleware, asyncHandler(productController.getProducts));

/**
 * 获取商品分类列表
 * GET /api/products/categories
 */
router.get('/categories', asyncHandler(productController.getCategories));

/**
 * 根据条码查询商品
 * GET /api/products/barcode/:barcode
 */
router.get('/barcode/:barcode', asyncHandler(productController.getProductByBarcode));

/**
 * 根据ID获取商品详情
 * GET /api/products/:id
 */
router.get('/:id', asyncHandler(productController.getProductById));

module.exports = router;

