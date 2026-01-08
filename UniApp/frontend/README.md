# ScanShop 微信小程序前端

## 📱 技术栈

- 微信小程序原生开发
- ES6+ 语法
- Vant Weapp UI 组件库

## 🚀 快速启动

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 构建 npm（重要）

在微信开发者工具中：
1. 顶部菜单 → **"工具"**
2. 选择 **"构建 npm"**
3. 等待构建完成

### 3. 配置

1. 点击 **"详情"** → **"本地设置"**
2. 勾选：
   - ✅ 不校验合法域名
   - ✅ 启用 ES6 转 ES5
   - ✅ 使用 npm 模块

### 4. 编译运行

点击 **"编译"** 按钮

## 📁 目录结构

```
frontend/
├── pages/
│   ├── index/          # 首页（商品列表）
│   ├── product/        # 商品详情
│   ├── cart/           # 购物车
│   ├── order/          # 订单（list + detail）
│   └── profile/        # 个人中心
├── utils/
│   ├── request.js      # 网络请求封装
│   └── api.js          # API接口封装（所有后端接口）
├── custom-tab-bar/     # 自定义TabBar（使用Vant图标）
├── assets/             # 静态资源
├── app.js              # 小程序入口
└── app.json            # 全局配置
```

## 🔌 API 调用

所有 API 都封装在 `utils/api.js`：

```javascript
import { 
  wechatLogin,      // 微信登录
  addToCart,        // 添加到购物车
  getCart,          // 获取购物车
  createOrder,      // 创建订单
  createPayment     // 创建支付
} from '../../utils/api';

// 使用示例
const res = await getCart();
```

## 🎨 UI 组件

使用 Vant Weapp 组件库：

- `van-card` - 商品卡片
- `van-stepper` - 数量选择器
- `van-submit-bar` - 结算栏
- `van-goods-action` - 商品页操作栏
- `van-empty` - 空状态
- `van-tabbar` - 底部导航（带图标）

## 🔧 配置

### BASE_URL

`utils/request.js` 第 11 行：
```javascript
const BASE_URL = 'http://localhost:3000/api';
```

## 📝 页面说明

- **index** - 首页（搜索、分类、商品列表、分页）
- **product/detail** - 商品详情（规格选择、加入购物车）
- **cart** - 购物车（选中、数量调整、结算）
- **order/list** - 订单列表（状态筛选）
- **order/detail** - 订单详情（支付功能）
- **profile** - 个人中心（登录、余额、订单统计）
