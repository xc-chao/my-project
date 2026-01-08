// ==========================================
// 购物车控制器（CartController）
// 功能：处理购物车相关的业务逻辑
// ==========================================

const { CartItem, Product, User } = require('../models');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');
const { sequelize } = require('../models');

/**
 * 添加商品到购物车
 * 路由：POST /api/cart
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 1. 验证商品是否存在
 * 2. 检查商品库存是否充足
 * 3. 如果商品已在购物车，则增加数量
 * 4. 如果商品不在购物车，则新增记录
 * 
 * 请求参数：
 * @body {number} productId - 商品ID
 * @body {number} quantity - 数量（默认1）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: cartItem }
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId;

    // 验证参数
    if (!productId) {
      return error(res, ErrorCodes.BAD_REQUEST, '商品ID不能为空');
    }

    if (quantity < 1) {
      return error(res, ErrorCodes.BAD_REQUEST, '数量必须大于0');
    }

    // 查询商品
    const product = await Product.findByPk(productId);
    if (!product) {
      return error(res, ErrorCodes.PRODUCT_NOT_FOUND);
    }

    // 检查商品状态
    if (product.status !== 1) {
      return error(res, ErrorCodes.PRODUCT_OFF_SHELF);
    }

    // 检查库存
    if (product.stock < quantity) {
      return error(res, ErrorCodes.PRODUCT_STOCK_INSUFFICIENT, `库存不足，仅剩 ${product.stock} 件`);
    }

    // 查询购物车是否已有该商品
    let cartItem = await CartItem.findOne({
      where: { userId, productId }
    });

    if (cartItem) {
      // 商品已存在，增加数量
      const newQuantity = cartItem.quantity + quantity;
      
      // 再次检查库存
      if (product.stock < newQuantity) {
        return error(res, ErrorCodes.PRODUCT_STOCK_INSUFFICIENT, `库存不足，仅剩 ${product.stock} 件`);
      }
      
      cartItem.quantity = newQuantity;
      cartItem.selected = true; // 重新选中
      await cartItem.save();
    } else {
      // 商品不存在，新增记录
      cartItem = await CartItem.create({
        userId,
        productId,
        quantity,
        selected: true
      });
    }

    // 关联查询商品信息
    const result = await CartItem.findOne({
      where: { id: cartItem.id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'stock', 'imageUrl', 'barcode']
      }]
    });

    return success(res, result, '已加入购物车');

  } catch (err) {
    console.error('添加到购物车失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取购物车列表
 * 路由：GET /api/cart
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 1. 查询当前用户的购物车
 * 2. 关联查询商品详情
 * 3. 计算选中商品的总价
 * 4. 返回购物车列表和统计信息
 * 
 * 返回数据：
 * @returns {Object} { 
 *   code: 200, 
 *   data: { 
 *     items: [], 
 *     total: { selectedCount, totalAmount, totalQuantity } 
 *   } 
 * }
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;

    // 查询购物车，关联商品信息
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'stock', 'imageUrl', 'barcode', 'category', 'status']
      }],
      order: [['created_at', 'DESC']]
    });

    // 计算总价和统计信息
    let selectedCount = 0;      // 选中的商品种类数
    let totalAmount = 0;         // 选中商品的总金额
    let totalQuantity = 0;       // 选中商品的总数量

    cartItems.forEach(item => {
      if (item.selected && item.product && item.product.status === 1) {
        selectedCount++;
        totalAmount += parseFloat(item.product.price) * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    return success(res, {
      items: cartItems,
      total: {
        selectedCount,      // 选中的商品种类数
        totalAmount: parseFloat(totalAmount.toFixed(2)),  // 总金额（保留两位小数）
        totalQuantity       // 总数量
      }
    });

  } catch (err) {
    console.error('获取购物车失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 更新购物车商品
 * 路由：PUT /api/cart/:id
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 1. 验证购物车项是否属于当前用户
 * 2. 支持修改数量
 * 3. 支持选中/取消选中
 * 4. 验证库存是否充足
 * 
 * 请求参数：
 * @params {number} id - 购物车项ID
 * @body {number} quantity - 新的数量（可选）
 * @body {boolean} selected - 是否选中（可选）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: cartItem }
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, selected } = req.body;
    const userId = req.userId;

    // 查询购物车项
    const cartItem = await CartItem.findOne({
      where: { id, userId },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItem) {
      return error(res, ErrorCodes.CART_ITEM_NOT_FOUND);
    }

    // 更新数量
    if (quantity !== undefined) {
      if (quantity < 1) {
        return error(res, ErrorCodes.BAD_REQUEST, '数量必须大于0');
      }

      // 检查库存
      if (cartItem.product.stock < quantity) {
        return error(res, ErrorCodes.PRODUCT_STOCK_INSUFFICIENT, `库存不足，仅剩 ${cartItem.product.stock} 件`);
      }

      cartItem.quantity = quantity;
    }

    // 更新选中状态
    if (selected !== undefined) {
      cartItem.selected = selected;
    }

    await cartItem.save();

    // 重新查询带商品信息的数据
    const result = await CartItem.findOne({
      where: { id: cartItem.id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'stock', 'imageUrl', 'barcode']
      }]
    });

    return success(res, result, '更新成功');

  } catch (err) {
    console.error('更新购物车失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 删除购物车商品
 * 路由：DELETE /api/cart/:id
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 删除指定的购物车商品
 * 
 * 请求参数：
 * @params {number} id - 购物车项ID
 * 
 * 返回数据：
 * @returns {Object} { code: 200, message: '删除成功' }
 */
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // 查询购物车项
    const cartItem = await CartItem.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return error(res, ErrorCodes.CART_ITEM_NOT_FOUND);
    }

    // 删除
    await cartItem.destroy();

    return success(res, null, '删除成功');

  } catch (err) {
    console.error('删除购物车商品失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 清空购物车
 * 路由：DELETE /api/cart
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 删除当前用户的所有购物车商品
 * 
 * 返回数据：
 * @returns {Object} { code: 200, message: '购物车已清空' }
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    // 删除该用户的所有购物车项
    const deletedCount = await CartItem.destroy({
      where: { userId }
    });

    return success(res, { deletedCount }, '购物车已清空');

  } catch (err) {
    console.error('清空购物车失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 全选/取消全选
 * 路由：PUT /api/cart/select-all
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 批量设置购物车商品的选中状态
 * 
 * 请求参数：
 * @body {boolean} selected - 是否选中
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { updatedCount } }
 */
exports.selectAll = async (req, res) => {
  try {
    const { selected } = req.body;
    const userId = req.userId;

    if (selected === undefined) {
      return error(res, ErrorCodes.BAD_REQUEST, 'selected 参数不能为空');
    }

    // 批量更新
    const [updatedCount] = await CartItem.update(
      { selected },
      { where: { userId } }
    );

    return success(res, { updatedCount }, selected ? '已全选' : '已取消全选');

  } catch (err) {
    console.error('全选操作失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取购物车商品数量
 * 路由：GET /api/cart/count
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 返回购物车中的商品总数（用于显示购物车角标）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { count } }
 */
exports.getCartCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await CartItem.count({
      where: { userId }
    });

    return success(res, { count });

  } catch (err) {
    console.error('获取购物车数量失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 批量删除购物车商品
 * 路由：DELETE /api/cart/batch
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 根据 ID 数组批量删除购物车商品
 * 
 * 请求参数：
 * @body {Array<number>} ids - 购物车项ID数组
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { deletedCount } }
 */
exports.batchDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.userId;

    if (!Array.isArray(ids) || ids.length === 0) {
      return error(res, ErrorCodes.BAD_REQUEST, 'ids 必须是非空数组');
    }

    // 批量删除（只删除属于当前用户的）
    const deletedCount = await CartItem.destroy({
      where: {
        id: ids,
        userId
      }
    });

    return success(res, { deletedCount }, `已删除 ${deletedCount} 个商品`);

  } catch (err) {
    console.error('批量删除失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

