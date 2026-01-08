# ScanShop 数据库

## 🗄️ 数据库设计

### 数据库名称
`scanshop_db`

### 数据表（6张）

1. **users** - 用户表
2. **products** - 商品表（50个商品）
3. **cart_items** - 购物车表
4. **orders** - 订单表
5. **order_items** - 订单明细表
6. **payments** - 支付记录表

## 🚀 快速初始化

### 方法 1：使用 SQL 脚本

```bash
# 创建表结构
mysql -u root -p --default-character-set=utf8mb4 < database/schema.sql

# 导入测试数据
mysql -u root -p --default-character-set=utf8mb4 scanshop_db < database/seed.sql
```

### 方法 2：使用 Node.js 脚本

```bash
cd backend
npm run init-db
```

## 📊 表结构

### users（用户表）
- id, openid, nickname, avatar, phone, password, balance

### products（商品表）
- id, barcode, name, price, stock, image_url, category, description, status

### cart_items（购物车表）
- id, user_id, product_id, quantity, selected

### orders（订单表）
- id, order_no, user_id, total_amount, status, payment_method, paid_at

### order_items（订单明细表）
- id, order_id, product_id, quantity, price, subtotal

### payments（支付记录表）
- id, order_id, payment_no, transaction_id, payment_method, amount, status, paid_at

## 🧪 测试数据

- **用户**：3个（张三、李四、王五）
- **商品**：50个（饮料10、零食12、方便食品8、日用品20）
- **订单**：3个测试订单

## ⚠️ 注意事项

**字符集必须使用 utf8mb4**：
```bash
# 正确的导入方式
mysql -u root -p --default-character-set=utf8mb4 < seed.sql

# 错误的方式（会导致中文乱码）
mysql -u root -p < seed.sql
```

## 📝 商品数据管理

- **products-data.json** - 商品数据源
- **generate-seed.js** - 自动生成SQL脚本

修改商品数据：
1. 编辑 products-data.json
2. 运行 `node generate-seed.js`
3. 导入生成的 seed.sql
