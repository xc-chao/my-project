// ==========================================
// 数据库配置文件
// 功能：创建 Sequelize 实例，连接 MySQL 数据库
// ==========================================

const { Sequelize } = require('sequelize'); // 引入 Sequelize ORM 框架
require('dotenv').config();                  // 加载 .env 环境变量

// 创建 Sequelize 实例，配置数据库连接参数
const sequelize = new Sequelize(
  process.env.DB_NAME || 'scanshop_db',  // 数据库名称
  process.env.DB_USER || 'root',         // 数据库用户名
  process.env.DB_PASS || 'xc1127',     // 数据库密码
  {
    host: process.env.DB_HOST || 'localhost', // 数据库主机地址
    dialect: 'mysql',                          // 使用 MySQL 数据库
    logging: false,                            // 关闭 SQL 日志输出（开发时可设为 console.log）
    dialectOptions: {
      charset: 'utf8mb4'                       // 设置字符集为 utf8mb4
    },
    define: {
      charset: 'utf8mb4',                      // 模型字符集
      collate: 'utf8mb4_unicode_ci'            // 排序规则
    }
  }
);

// 导出 sequelize 实例，供其他模块使用
module.exports = sequelize;

