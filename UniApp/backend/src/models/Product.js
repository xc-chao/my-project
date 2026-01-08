// ==========================================
// 商品模型（Product）
// 表名：products
// 功能：存储商品信息，包括条形码、价格、库存、分类等
// ==========================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  // 主键 ID
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '商品ID'
  },
  
  // 商品条形码（用于扫码识别商品）
  barcode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '商品条形码'
  },
  
  // 商品名称
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '商品名称'
  },
  
  // 商品价格
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '商品价格',
    get() {
      const value = this.getDataValue('price');
      return value ? parseFloat(value) : 0;
    }
  },
  
  // 库存数量
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '库存数量'
  },
  
  // 商品图片 URL
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
    comment: '商品图片URL'
  },
  
  // 商品分类
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '商品分类'
  },
  
  // 商品描述
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '商品描述'
  },
  
  // 商品状态
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '状态：0=下架,1=上架'
  }
}, {
  tableName: 'products',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['barcode']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['name']
    }
  ],
  comment: '商品表'
});

module.exports = Product;

