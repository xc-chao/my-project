// ==========================================
// 购物车模型（CartItem）
// 表名：cart_items
// 功能：存储用户的购物车商品
// ==========================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  // 主键 ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '购物车项ID'
  },
  
  // 用户 ID（外键）
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    comment: '用户ID'
  },
  
  // 商品 ID（外键）
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    comment: '商品ID'
  },
  
  // 商品数量
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '商品数量',
    validate: {
      min: 1
    }
  },
  
  // 是否选中（用于结算时筛选）
  selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否选中'
  }
}, {
  tableName: 'cart_items',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['product_id']
    }
  ],
  comment: '购物车表'
});

module.exports = CartItem;

