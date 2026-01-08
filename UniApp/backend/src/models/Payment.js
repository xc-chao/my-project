// ==========================================
// 支付记录模型（Payment）
// 表名：payments
// 功能：存储支付相关的信息和微信支付参数
// ==========================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  // 主键 ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '支付记录ID'
  },
  
  // 订单 ID（外键）
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id',
    comment: '订单ID'
  },
  
  // 支付流水号（系统生成）
  paymentNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'payment_no',
    comment: '支付流水号'
  },
  
  // 微信支付交易号（微信返回）
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'transaction_id',
    comment: '微信支付交易号'
  },
  
  // 支付方式
  paymentMethod: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'payment_method',
    comment: '支付方式：wechat=微信支付,balance=余额支付'
  },
  
  // 支付金额
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '支付金额',
    get() {
      const value = this.getDataValue('amount');
      return value ? parseFloat(value) : 0;
    }
  },
  
  // 支付状态
  // 0: 待支付, 1: 已支付, 2: 已退款, 3: 已关闭
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '支付状态：0=待支付,1=已支付,2=已退款,3=已关闭'
  },
  
  // 支付成功时间
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_at',
    comment: '支付成功时间'
  }
}, {
  tableName: 'payments',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['payment_no']
    },
    {
      fields: ['order_id']
    },
    {
      fields: ['transaction_id']
    },
    {
      fields: ['status']
    }
  ],
  comment: '支付记录表'
});

module.exports = Payment;

