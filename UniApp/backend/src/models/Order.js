// ==========================================
// 订单模型（Order）
// 表名：orders
// 功能：存储用户的订单主表信息
// ==========================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  // 主键 ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '订单ID'
  },
  
  // 订单编号（唯一标识）
  orderNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_no',
    comment: '订单编号'
  },
  
  // 用户 ID（外键）
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    comment: '用户ID'
  },
  
  // 订单总金额
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount',
    comment: '订单总金额',
    get() {
      const value = this.getDataValue('totalAmount');
      return value ? parseFloat(value) : 0;
    }
  },
  
  // 订单状态
  // 0: 待支付, 1: 已支付, 2: 已取消, 3: 已完成
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '订单状态：0=待支付,1=已支付,2=已取消,3=已完成'
  },
  
  // 支付方式
  paymentMethod: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'payment_method',
    comment: '支付方式：wechat=微信支付,balance=余额支付'
  },
  
  // 支付时间
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_at',
    comment: '支付时间'
  }
}, {
  tableName: 'orders',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['order_no']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ],
  comment: '订单表'
});

module.exports = Order;

