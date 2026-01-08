# 📝 更新 seed.sql 快速指南

## 🎯 完整流程

当你修改了 `database/seed.sql` 文件后，需要以下步骤：

### 第 1 步：清空旧数据

```bash
/usr/local/mysql/bin/mysql -u root -pxc1127 --default-character-set=utf8mb4 scanshop_db -e "
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE products;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
"
```

### 第 2 步：导入新数据

```bash
/usr/local/mysql/bin/mysql -u root -pxc1127 --default-character-set=utf8mb4 scanshop_db < /Users/qq/Desktop/Uniapp/database/seed.sql
```

### 第 3 步：重启后端服务器

```bash
# 停止旧服务器
lsof -ti:3000 | xargs kill -9

# 启动新服务器
cd /Users/qq/Desktop/Uniapp/backend
node src/app.js
```

### 第 4 步：在微信开发者工具中

1. 点击"清缓存" → "清除所有缓存"
2. 点击"编译"
3. 查看更新后的数据

---

## ⚡ 一键执行脚本

复制以下命令，在终端一次性执行：

```bash
# 一键更新数据库
cd /Users/qq/Desktop/Uniapp && \
/usr/local/mysql/bin/mysql -u root -pxc1127 --default-character-set=utf8mb4 scanshop_db -e "SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE payments; TRUNCATE TABLE order_items; TRUNCATE TABLE orders; TRUNCATE TABLE cart_items; TRUNCATE TABLE products; TRUNCATE TABLE users; SET FOREIGN_KEY_CHECKS = 1;" && \
/usr/local/mysql/bin/mysql -u root -pxc1127 --default-character-set=utf8mb4 scanshop_db < database/seed.sql && \
echo "✅ 数据库已更新！请重启后端服务器"
```

---

## 📊 验证更新

### 查看商品数据

```bash
/usr/local/mysql/bin/mysql -u root -pxc1127 scanshop_db -e "SELECT id, name, LEFT(image_url, 40) FROM products LIMIT 5;"
```

### 查看统计

```bash
/usr/local/mysql/bin/mysql -u root -pxc1127 scanshop_db -e "SELECT category, COUNT(*) as count FROM products GROUP BY category;"
```

---

## ✅ 刚才完成的操作

1. ✅ 清空旧数据
2. ✅ 导入你更新的 seed.sql（包含新的图片链接）
3. ✅ 后端服务器已重启

### 更新的图片链接

你把以下图片从阿里云链接改为了 s41.ax1x.com：

- 绿箭口香糖 ✅
- 维达纸巾 ✅
- 舒肤佳香皂 ✅
- 高露洁牙膏 ✅
- 云南白药牙膏 ✅
- 海飞丝洗发水 ✅
- 潘婷护发素 ✅
- 立白洗衣液 ✅
- 蓝月亮洗手液 ✅
- 妮维雅润肤露 ✅
- 威露士消毒液 ✅
- 立白洗洁精 ✅
- 蓝月亮洁厕灵 ✅
- 榄菊蚊香液 ✅
- 垃圾袋 ✅
- 保鲜膜 ✅
- 铝箔纸 ✅
- 厨房用纸 ✅

**这些链接（s41.ax1x.com）应该比阿里云的更稳定！** ✅

---

## 🚀 现在可以测试

在微信开发者工具中：

1. **点击"编译"**
2. **查看首页** - 商品图片应该都能正常显示
3. **测试购物车功能**

---

## 💡 以后修改 seed.sql 的流程

```
1. 编辑 database/seed.sql
   ↓
2. 在终端执行更新脚本（上面的一键脚本）
   ↓
3. 重启后端服务器
   ↓
4. 微信开发者工具中点击"编译"
```

---

**数据已更新完成！后端服务器正在运行！** ✅🚀

**现在点击"编译"查看新的图片效果！**
