# ScanShop 后端 API

## 📦 技术栈

- Node.js 16+ + Express 4.x
- MySQL 8.0 + Sequelize ORM
- JWT 认证 + bcrypt 密码加密

## 🚀 快速启动

```bash
# 1. 安装依赖
cd backend
npm install

# 2. 配置数据库密码
# 编辑 src/config/database.js，修改 DB_PASS

# 3. 初始化数据库
npm run init-db

# 4. 启动服务器
npm run dev
```

服务器运行在 `http://localhost:3000`

## 📁 目录结构

```
backend/src/
├── app.js                 # 服务器入口
├── initDb.js              # 数据库初始化
├── config/                # 配置文件
│   └── database.js        # 数据库连接
├── models/                # 数据模型（6个）
│   ├── index.js           # 模型关联
│   ├── User.js
│   ├── Product.js
│   ├── CartItem.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── Payment.js
├── controllers/           # 控制器（4个）
│   ├── authController.js  # 认证逻辑
│   ├── cartController.js  # 购物车逻辑
│   ├── orderController.js # 订单逻辑
│   └── paymentController.js # 支付逻辑
│   └── productController.js # 商品逻辑
├── routes/                # 路由（5个）
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── productRoutes.js
├── middlewares/           # 中间件（2个）
│   ├── authMiddleware.js  # JWT认证
│   └── errorHandler.js    # 错误处理
├── constants/
│   └── errorCodes.js      # 错误码定义
└── utils/
    ├── response.js        # 响应格式
    └── validator.js       # 数据验证
```

## 📝 API 接口（30个）

### 认证模块（8个）
- POST /api/auth/wechat-login
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile
- PUT /api/auth/password
- POST /api/auth/bind-phone
- GET /api/auth/balance

### 购物车模块（8个）
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:id
- DELETE /api/cart/:id
- DELETE /api/cart
- PUT /api/cart/select-all
- GET /api/cart/count
- DELETE /api/cart/batch

### 订单模块（6个）
- POST /api/orders
- GET /api/orders
- GET /api/orders/stats
- GET /api/orders/:id
- GET /api/orders/by-order-no/:no
- PUT /api/orders/:id/cancel

### 支付模块（4个）
- POST /api/payments/create
- POST /api/payments/mock-pay
- GET /api/payments/:no
- POST /api/payments/callback

### 商品模块（4个）
- GET /api/products
- GET /api/products/:id
- GET /api/products/barcode/:code
- GET /api/products/categories

## 🧪 测试

```bash
# 认证测试
node test-auth.js

# 购物车测试
node test-cart.js

# 订单测试
node test-order.js

# 快速测试
bash quick-test.sh
```

## 🔐 测试账号

- 手机号：13800138001 / 密码：123456（余额¥100）
- 手机号：13800138002 / 密码：123456（余额¥50）

## 📖 核心技术

- **Sequelize ORM** - 数据库操作
- **JWT** - 无状态认证
- **bcrypt** - 密码加密
- **数据库事务** - 保证数据一致性
- **库存锁定** - 防止超卖
