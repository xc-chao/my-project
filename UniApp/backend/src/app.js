// ==========================================
// ScanShop 后端服务器入口文件 v2.0
// 功能：配置 Express 服务器，注册路由，建立数据库连接
// ==========================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ========== 中间件配置 ==========
app.use(cors());                             // 允许跨域请求
app.use(express.json());                     // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 请求日志中间件（开发环境）
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.path}`);
    next();
  });
}

// ========== 路由注册 ==========
const authRoutes = require('./routes/authRoutes');       // 认证路由
const cartRoutes = require('./routes/cartRoutes');       // 购物车路由
const orderRoutes = require('./routes/orderRoutes');     // 订单路由
const paymentRoutes = require('./routes/paymentRoutes'); // 支付路由
const productRoutes = require('./routes/productRoutes'); // 商品路由

// 挂载路由
app.use('/api/auth', authRoutes);       // /api/auth/* 认证相关接口
app.use('/api/cart', cartRoutes);       // /api/cart/* 购物车相关接口
app.use('/api/orders', orderRoutes);    // /api/orders/* 订单相关接口
app.use('/api/payments', paymentRoutes); // /api/payments/* 支付相关接口
app.use('/api/products', productRoutes); // /api/products/* 商品相关接口

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Server is running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// ========== 错误处理 ==========
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

// 404 处理（放在所有路由之后）
app.use(notFoundHandler);

// 全局错误处理（放在最后）
app.use(errorHandler);

// ========== 启动服务器 ==========
const PORT = process.env.PORT || 3000;
const { sequelize } = require('./models');

// 连接数据库并启动服务器
sequelize.authenticate()
  .then(() => {
    console.log('✅ 数据库连接成功');
    
    // 同步数据库表结构（开发环境）
    return sequelize.sync({ alter: false }); // alter: true 会自动修改表结构
  })
  .then(() => {
    console.log('✅ 数据库表结构已同步');
    
    // 启动 HTTP 服务器
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🚀 ScanShop 后端服务器启动成功');
      console.log('='.repeat(50));
      console.log(`📍 服务地址: http://localhost:${PORT}`);
      console.log(`🌍 环境模式: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
      console.log('='.repeat(50));
      console.log('\n📝 可用接口：');
      console.log('   【认证模块】');
      console.log('   POST /api/auth/wechat-login  - 微信登录');
      console.log('   POST /api/auth/register      - 手机号注册');
      console.log('   POST /api/auth/login         - 手机号登录');
      console.log('   GET  /api/auth/profile       - 获取用户信息（需认证）');
      console.log('   PUT  /api/auth/profile       - 更新用户信息（需认证）');
      console.log('   PUT  /api/auth/password      - 修改密码（需认证）');
      console.log('   POST /api/auth/bind-phone    - 绑定手机号（需认证）');
      console.log('   GET  /api/auth/balance       - 查询余额（需认证）');
      console.log('');
      console.log('   【购物车模块】');
      console.log('   GET    /api/cart             - 获取购物车列表（需认证）');
      console.log('   POST   /api/cart             - 添加商品到购物车（需认证）');
      console.log('   PUT    /api/cart/:id         - 更新购物车商品（需认证）');
      console.log('   DELETE /api/cart/:id         - 删除购物车商品（需认证）');
      console.log('   DELETE /api/cart             - 清空购物车（需认证）');
      console.log('   PUT    /api/cart/select-all  - 全选/取消全选（需认证）');
      console.log('   GET    /api/cart/count       - 获取购物车数量（需认证）');
      console.log('');
      console.log('   【订单模块】');
      console.log('   POST   /api/orders           - 创建订单（需认证）');
      console.log('   GET    /api/orders           - 获取订单列表（需认证）');
      console.log('   GET    /api/orders/stats     - 订单统计（需认证）');
      console.log('   GET    /api/orders/:id       - 订单详情（需认证）');
      console.log('   PUT    /api/orders/:id/cancel - 取消订单（需认证）');
      console.log('');
      console.log('   【支付模块】');
      console.log('   POST   /api/payments/create  - 创建支付（需认证）');
      console.log('   POST   /api/payments/mock-pay - 模拟支付（开发环境）');
      console.log('   GET    /api/payments/:no     - 查询支付状态（需认证）');
      console.log('   POST   /api/payments/callback - 微信支付回调');
      console.log('');
      console.log('   【商品模块】');
      console.log('   GET    /api/products         - 获取商品列表');
      console.log('   GET    /api/products/categories - 获取分类列表');
      console.log('   GET    /api/products/:id     - 获取商品详情');
      console.log('   GET    /api/products/barcode/:code - 根据条码查询');
      console.log('');
      console.log('   【系统】');
      console.log('   GET  /health                 - 健康检查');
      console.log('');
    });
  })
  .catch(err => {
    console.error('❌ 服务器启动失败:', err);
    process.exit(1);
  });

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n⏸️  正在关闭服务器...');
  await sequelize.close();
  console.log('✅ 数据库连接已关闭');
  process.exit(0);
});

module.exports = app;

