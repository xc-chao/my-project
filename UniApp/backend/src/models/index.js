// ==========================================
// 数据模型统一导出和关联定义
// 功能：定义所有模型之间的关系，统一导出
// ==========================================

const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');

// ==========================================
// 定义模型关联关系
// ==========================================

// 1. 用户与购物车的关系（一对多）
User.hasMany(CartItem, {
  foreignKey: 'userId',
  as: 'cartItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
CartItem.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// 2. 商品与购物车的关系（一对多）
Product.hasMany(CartItem, {
  foreignKey: 'productId',
  as: 'cartItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// 3. 用户与订单的关系（一对多）
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// 4. 订单与订单明细的关系（一对多）
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// 5. 商品与订单明细的关系（一对多）
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// 6. 订单与支付记录的关系（一对多）
Order.hasMany(Payment, {
  foreignKey: 'orderId',
  as: 'payments',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Payment.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// ==========================================
// 导出所有模型和 sequelize 实例
// ==========================================

module.exports = {
  sequelize,
  User,
  Product,
  CartItem,
  Order,
  OrderItem,
  Payment
};

