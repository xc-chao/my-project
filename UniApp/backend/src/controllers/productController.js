// ==========================================
// 商品控制器（ProductController）
// 功能：处理商品相关的业务逻辑
// ==========================================

const { Product } = require('../models');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');
const { Op } = require('sequelize');

/**
 * 获取商品列表
 * 路由：GET /api/products
 * 
 * 功能说明：
 * 支持分页、搜索、分类筛选
 * 
 * 请求参数：
 * @query {number} page - 页码（默认1）
 * @query {number} pageSize - 每页数量（默认20）
 * @query {string} category - 分类筛选（可选）
 * @query {string} keyword - 搜索关键词（可选）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { products, pagination } }
 */
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, category, keyword } = req.query;
    
    // 添加日志，查看接收到的参数
    console.log('收到商品查询请求:', { page, pageSize, category, keyword });
    
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // 构建查询条件
    const where = { status: 1 }; // 只查询上架的商品
    
    if (category) {
      console.log('分类筛选:', category, '| 字节长度:', Buffer.from(category).length);
      where.category = category;
    }
    
    if (keyword) {
      where.name = {
        [Op.like]: `%${keyword}%`
      };
    }

    // 查询商品列表
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return success(res, {
      products,
      pagination: {
        page: parseInt(page),
        pageSize: limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (err) {
    console.error('获取商品列表失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 根据ID获取商品详情
 * 路由：GET /api/products/:id
 * 
 * 请求参数：
 * @params {number} id - 商品ID
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: product }
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return error(res, ErrorCodes.PRODUCT_NOT_FOUND);
    }

    return success(res, product);

  } catch (err) {
    console.error('获取商品详情失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 根据条码查询商品
 * 路由：GET /api/products/barcode/:barcode
 * 
 * 请求参数：
 * @params {string} barcode - 商品条码
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: product }
 */
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    
    const product = await Product.findOne({
      where: { barcode }
    });
    
    if (!product) {
      return error(res, ErrorCodes.PRODUCT_NOT_FOUND, '未找到该商品');
    }

    return success(res, product);

  } catch (err) {
    console.error('查询商品失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取商品分类列表
 * 路由：GET /api/products/categories
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: categories }
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      where: { status: 1 },
      group: ['category']
    });

    const categoryList = categories.map(item => item.category).filter(Boolean);

    return success(res, categoryList);

  } catch (err) {
    console.error('获取分类列表失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

