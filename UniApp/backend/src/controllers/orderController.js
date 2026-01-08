// ==========================================
// 订单控制器（OrderController）
// 功能：处理订单相关的业务逻辑
// ==========================================

const { sequelize, Order, OrderItem, Product, CartItem, User } = require('../models');
const { success, error } = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');

/**
 * 从购物车创建订单
 * 路由：POST /api/orders
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 1. 获取用户选中的购物车商品
 * 2. 验证商品库存
 * 3. 使用数据库事务创建订单
 * 4. 锁定库存（扣减）
 * 5. 清空购物车中已下单的商品
 * 6. 返回订单信息
 * 
 * 请求参数：
 * @body {Array<number>} cartItemIds - 购物车项ID数组（可选，不传则使用所有选中的商品）
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: { order, orderItems } }
 */
exports.createOrder = async (req, res) => {
  // 开启数据库事务
  const t = await sequelize.transaction();
  
  try {
    const { cartItemIds } = req.body;
    const userId = req.userId;

    // ========== 1. 查询购物车商品 ==========
    const where = { userId };
    
    if (cartItemIds && Array.isArray(cartItemIds)) {
      // 指定购物车项ID
      where.id = cartItemIds;
    } else {
      // 使用所有选中的商品
      where.selected = true;
    }

    const cartItems = await CartItem.findAll({
      where,
      include: [{
        model: Product,
        as: 'product'
      }],
      transaction: t
    });

    // 验证购物车不为空
    if (cartItems.length === 0) {
      await t.rollback();
      return error(res, ErrorCodes.CART_EMPTY, '购物车为空或未选中商品');
    }

    // ========== 2. 验证商品库存和状态 ==========
    let totalAmount = 0;
    const orderItemsData = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product;

      // 检查商品是否存在
      if (!product) {
        await t.rollback();
        return error(res, ErrorCodes.PRODUCT_NOT_FOUND, `商品ID ${cartItem.productId} 不存在`);
      }

      // 检查商品是否已下架
      if (product.status !== 1) {
        await t.rollback();
        return error(res, ErrorCodes.PRODUCT_OFF_SHELF, `商品 ${product.name} 已下架`);
      }

      // 检查库存是否充足
      if (product.stock < cartItem.quantity) {
        await t.rollback();
        return error(res, ErrorCodes.PRODUCT_STOCK_INSUFFICIENT, 
          `商品 ${product.name} 库存不足，仅剩 ${product.stock} 件`);
      }

      // 计算小计
      const subtotal = parseFloat(product.price) * cartItem.quantity;
      totalAmount += subtotal;

      // 准备订单明细数据
      orderItemsData.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.price,
        subtotal: subtotal
      });
    }

    // ========== 3. 生成订单编号 ==========
    const orderNo = 'SN' + Date.now() + Math.floor(Math.random() * 10000);

    // ========== 4. 创建订单主表 ==========
    const order = await Order.create({
      orderNo,
      userId,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 0, // 待支付
      paymentMethod: null,
      paidAt: null
    }, { transaction: t });

    // ========== 5. 创建订单明细 ==========
    const orderItems = [];
    for (const itemData of orderItemsData) {
      const orderItem = await OrderItem.create({
        orderId: order.id,
        ...itemData
      }, { transaction: t });
      orderItems.push(orderItem);
    }

    // ========== 6. 锁定库存（扣减） ==========
    for (const cartItem of cartItems) {
      const product = cartItem.product;
      product.stock -= cartItem.quantity;
      await product.save({ transaction: t });
    }

    // ========== 7. 清空购物车中已下单的商品 ==========
    await CartItem.destroy({
      where: {
        id: cartItems.map(item => item.id)
      },
      transaction: t
    });

    // ========== 8. 提交事务 ==========
    await t.commit();

    // ========== 9. 重新查询订单（包含关联数据） ==========
    const result = await Order.findOne({
      where: { id: order.id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'imageUrl']
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'phone']
        }
      ]
    });

    return success(res, result, '订单创建成功');

  } catch (err) {
    // 回滚事务
    await t.rollback();
    console.error('创建订单失败:', err);
    return error(res, ErrorCodes.ORDER_CREATE_FAILED, err.message);
  }
};

/**
 * 获取订单列表
 * 路由：GET /api/orders
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 分页查询当前用户的订单列表，支持状态筛选
 * 
 * 请求参数：
 * @query {number} page - 页码（默认1）
 * @query {number} pageSize - 每页数量（默认10）
 * @query {number} status - 订单状态筛选（可选）
 * 
 * 返回数据：
 * @returns {Object} { 
 *   code: 200, 
 *   data: { 
 *     orders: [], 
 *     pagination: { page, pageSize, total, totalPages } 
 *   } 
 * }
 */
exports.getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 10, status } = req.query;

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // 构建查询条件
    const where = { userId };
    if (status !== undefined) {
      where.status = parseInt(status);
    }

    // 查询订单列表
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'imageUrl', 'barcode']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return success(res, {
      orders,
      pagination: {
        page: parseInt(page),
        pageSize: limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (err) {
    console.error('获取订单列表失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取订单详情
 * 路由：GET /api/orders/:id
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 查询指定订单的详细信息
 * 
 * 请求参数：
 * @params {number} id - 订单ID
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: order }
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'imageUrl', 'barcode', 'category']
          }]
        }
      ]
    });

    if (!order) {
      return error(res, ErrorCodes.ORDER_NOT_FOUND);
    }

    return success(res, order);

  } catch (err) {
    console.error('获取订单详情失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 取消订单
 * 路由：PUT /api/orders/:id/cancel
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 1. 验证订单状态（只有待支付的订单可以取消）
 * 2. 回滚库存
 * 3. 更新订单状态为已取消
 * 
 * 请求参数：
 * @params {number} id - 订单ID
 * 
 * 返回数据：
 * @returns {Object} { code: 200, message: '订单已取消' }
 */
exports.cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const userId = req.userId;

    // 查询订单
    const order = await Order.findOne({
      where: { id, userId },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{ model: Product, as: 'product' }]
      }],
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_NOT_FOUND);
    }

    // 验证订单状态
    if (order.status === 1) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_ALREADY_PAID);
    }

    if (order.status === 2) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_ALREADY_CANCELLED);
    }

    if (order.status === 3) {
      await t.rollback();
      return error(res, ErrorCodes.ORDER_CANNOT_CANCEL, '订单已完成，无法取消');
    }

    // ========== 回滚库存 ==========
    for (const item of order.orderItems) {
      const product = item.product;
      product.stock += item.quantity;
      await product.save({ transaction: t });
    }

    // ========== 更新订单状态 ==========
    order.status = 2; // 已取消
    await order.save({ transaction: t });

    await t.commit();

    return success(res, null, '订单已取消');

  } catch (err) {
    await t.rollback();
    console.error('取消订单失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 根据订单号查询订单
 * 路由：GET /api/orders/by-order-no/:orderNo
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 通过订单编号查询订单详情
 * 
 * 请求参数：
 * @params {string} orderNo - 订单编号
 * 
 * 返回数据：
 * @returns {Object} { code: 200, data: order }
 */
exports.getOrderByNo = async (req, res) => {
  try {
    const { orderNo } = req.params;
    const userId = req.userId;

    const order = await Order.findOne({
      where: { orderNo, userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }
      ]
    });

    if (!order) {
      return error(res, ErrorCodes.ORDER_NOT_FOUND);
    }

    return success(res, order);

  } catch (err) {
    console.error('查询订单失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

/**
 * 获取订单统计
 * 路由：GET /api/orders/stats
 * 权限：需要 JWT 认证
 * 
 * 功能说明：
 * 统计用户各状态的订单数量
 * 
 * 返回数据：
 * @returns {Object} { 
 *   code: 200, 
 *   data: { 
 *     pending: 0,    // 待支付
 *     paid: 0,       // 已支付
 *     cancelled: 0,  // 已取消
 *     completed: 0   // 已完成
 *   } 
 * }
 */
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.userId;

    // 分别统计各状态的订单数量
    const [pending, paid, cancelled, completed] = await Promise.all([
      Order.count({ where: { userId, status: 0 } }),
      Order.count({ where: { userId, status: 1 } }),
      Order.count({ where: { userId, status: 2 } }),
      Order.count({ where: { userId, status: 3 } })
    ]);

    return success(res, {
      pending,
      paid,
      cancelled,
      completed,
      total: pending + paid + cancelled + completed
    });

  } catch (err) {
    console.error('获取订单统计失败:', err);
    return error(res, ErrorCodes.SERVER_ERROR);
  }
};

