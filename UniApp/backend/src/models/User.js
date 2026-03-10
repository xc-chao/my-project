// ==========================================
// 用户模型（User）
// 表名：users
// 功能：存储微信小程序用户的完整信息
// ==========================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  // 主键 ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户ID'
  },
  
  // 微信用户唯一标识（通过 wx.login 获取）
  openid: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: '微信用户唯一标识'
  },
  
  // 用户昵称
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '用户昵称'
  },
  
  // 用户头像 URL
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '用户头像URL'
  },
  
  // 手机号码
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: '手机号码'
  },
  
  // 密码（bcrypt 加密存储）
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '密码（bcrypt加密）'
  },
  
  // 账户余额
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: '账户余额',
    get() {
      const value = this.getDataValue('balance');
      return value ? parseFloat(value) : 0;
    }
  }
}, {
  tableName: 'users',
  underscored: true, // 使用下划线命名（created_at, updated_at）
  timestamps: true,  // 自动管理 createdAt 和 updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['openid']
    },
    {
      fields: ['phone']
    }
  ],
  comment: '用户表'
});

module.exports = User;

