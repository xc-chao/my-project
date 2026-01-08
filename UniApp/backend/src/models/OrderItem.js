// ==========================================
// 订单商品模型（OrderItem）
// 表名：order_items
// 功能：存储订单的商品明细（一个订单可以包含多个商品）
// ==========================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  // 主键 ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '订单明细ID'
  },
  
  // 订单 ID（外键）
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id',
    comment: '订单ID'
  },
  
  // 商品 ID（外键）
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    comment: '商品ID'
  },
  
  // 购买数量
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '购买数量',
    validate: {
      min: 1
    }
  },
  
  // 商品单价（冗余字段，防止商品改价后影响历史订单）
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '商品单价（下单时的价格）',
    get() {
      const value = this.getDataValue('price');
      return value ? parseFloat(value) : 0;
    }
  },
  
  // 小计金额（单价 × 数量）
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '小计金额',
    get() {
      const value = this.getDataValue('subtotal');
      return value ? parseFloat(value) : 0;
    }
  }
}, {
  tableName: 'order_items',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['order_id']
    },
    {
      fields: ['product_id']
    }
  ],
  comment: '订单商品表'
});

module.exports = OrderItem;

