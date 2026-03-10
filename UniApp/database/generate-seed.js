#!/usr/bin/env node

// ==========================================
// 商品数据 SQL 生成脚本
// 功能：从 products-data.json 读取商品数据并生成 SQL 插入语句
// 使用方法：node database/generate-seed.js
// ==========================================

const fs = require('fs');
const path = require('path');

// 读取商品数据
const dataPath = path.join(__dirname, 'products-data.json');
const outputPath = path.join(__dirname, 'seed-generated.sql');

console.log('📦 开始生成商品数据 SQL...\n');

try {
  // 读取 JSON 文件
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);
  const products = data.products;

  console.log(`✅ 成功读取 ${products.length} 个商品数据`);

  // 生成 SQL 文件头部
  let sql = `-- ==========================================
-- ScanShop 商品数据 SQL（自动生成）
-- 生成时间：${new Date().toLocaleString('zh-CN')}
-- 商品数量：${products.length} 个
-- ==========================================

USE scanshop_db;

-- ==========================================
-- 清空现有数据（可选，开发环境使用）
-- ==========================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE products;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. 插入测试用户数据
-- 注意：密码为 bcrypt 加密后的 "123456"
-- ==========================================
INSERT INTO \`users\` (\`openid\`, \`nickname\`, \`avatar\`, \`phone\`, \`password\`, \`balance\`) VALUES
('mock_openid_user_001', '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132', '13800138001', '$2a$10$jiE/OYOlNhkzVCnOVOewx.vsOStvOkEs.B6se1.4/YCuKqudvr/te', 100.00),
('mock_openid_user_002', '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132', '13800138002', '$2a$10$jiE/OYOlNhkzVCnOVOewx.vsOStvOkEs.B6se1.4/YCuKqudvr/te', 50.00),
('mock_openid_user_003', '王五（微信用户）', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132', NULL, NULL, 0.00);

-- 测试账号说明：
-- 张三和李四：可使用手机号 + 密码登录（密码：123456）
-- 王五：仅微信登录，未绑定手机号

-- ==========================================
-- 2. 插入商品数据（按分类组织）
-- ==========================================

`;

  // 按分类分组商品
  const categories = {};
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  });

  // 生成每个分类的 SQL
  Object.keys(categories).sort().forEach(category => {
    sql += `-- ${category}类\n`;
    sql += `INSERT INTO \`products\` (\`barcode\`, \`name\`, \`price\`, \`stock\`, \`image_url\`, \`category\`, \`description\`) VALUES\n`;
    
    const items = categories[category];
    items.forEach((product, index) => {
      const isLast = index === items.length - 1;
      const escapedName = product.name.replace(/'/g, "\\'");
      const escapedDesc = product.description.replace(/'/g, "\\'");
      const escapedUrl = product.imageUrl.replace(/'/g, "\\'");
      
      sql += `('${product.barcode}', '${escapedName}', ${product.price}, ${product.stock}, '${escapedUrl}', '${category}', '${escapedDesc}')`;
      sql += isLast ? ';\n\n' : ',\n';
    });
  });

  // 添加购物车和订单数据
  sql += `-- ==========================================
-- 3. 插入购物车数据
-- ==========================================
INSERT INTO \`cart_items\` (\`user_id\`, \`product_id\`, \`quantity\`) VALUES
(1, 1, 2),  -- 张三的购物车：2瓶可口可乐
(1, 11, 1), -- 张三的购物车：1包乐事薯片
(2, 2, 3),  -- 李四的购物车：3瓶农夫山泉
(2, 21, 2); -- 李四的购物车：2包康师傅方便面

-- ==========================================
-- 4. 插入订单数据
-- ==========================================
INSERT INTO \`orders\` (\`order_no\`, \`user_id\`, \`total_amount\`, \`status\`, \`payment_method\`, \`paid_at\`) VALUES
('SN202512300001', 1, 15.50, 1, 'wechat', '2025-12-30 10:30:00'),
('SN202512300002', 2, 10.00, 1, 'balance', '2025-12-30 11:00:00'),
('SN202512300003', 1, 8.00, 0, NULL, NULL);

-- ==========================================
-- 5. 插入订单商品数据
-- ==========================================
INSERT INTO \`order_items\` (\`order_id\`, \`product_id\`, \`quantity\`, \`price\`, \`subtotal\`) VALUES
-- 订单1（张三的已支付订单）
(1, 1, 2, 3.00, 6.00),   -- 2瓶可口可乐
(1, 11, 1, 7.50, 7.50),  -- 1包乐事薯片
(1, 2, 1, 2.00, 2.00),   -- 1瓶农夫山泉

-- 订单2（李四的已支付订单）
(2, 2, 5, 2.00, 10.00),  -- 5瓶农夫山泉

-- 订单3（张三的待支付订单）
(3, 21, 1, 4.50, 4.50),  -- 1包康师傅方便面
(3, 5, 1, 3.50, 3.50);   -- 1盒伊利纯牛奶

-- ==========================================
-- 数据初始化完成
-- ==========================================

-- 查看插入的数据
SELECT '========== 用户列表 ==========' AS '';
SELECT id, nickname, phone, balance FROM users;

SELECT '========== 商品列表（按分类） ==========' AS '';
SELECT id, barcode, name, category, price, stock FROM products ORDER BY category, id;

SELECT '========== 购物车数据 ==========' AS '';
SELECT 
  ci.id,
  u.nickname AS user_name,
  p.name AS product_name,
  ci.quantity
FROM cart_items ci
JOIN users u ON ci.user_id = u.id
JOIN products p ON ci.product_id = p.id;

SELECT '========== 订单列表 ==========' AS '';
SELECT 
  o.order_no,
  u.nickname AS user_name,
  o.total_amount,
  CASE o.status 
    WHEN 0 THEN '待支付'
    WHEN 1 THEN '已支付'
    WHEN 2 THEN '已取消'
    WHEN 3 THEN '已完成'
  END AS status_text,
  o.payment_method,
  o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id;

SELECT '========== 订单明细 ==========' AS '';
SELECT 
  o.order_no,
  p.name AS product_name,
  oi.quantity,
  oi.price,
  oi.subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id;

SELECT '========== 商品分类统计 ==========' AS '';
SELECT 
  category,
  COUNT(*) AS product_count,
  SUM(stock) AS total_stock
FROM products
GROUP BY category;
`;

  // 写入文件
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`✅ SQL 文件生成成功：${outputPath}`);
  console.log(`\n📊 统计信息：`);
  Object.keys(categories).sort().forEach(category => {
    console.log(`   ${category}：${categories[category].length} 个商品`);
  });
  console.log(`   总计：${products.length} 个商品\n`);
  
  console.log(`💡 使用方法：`);
  console.log(`   mysql -u root -p < ${outputPath}`);
  console.log(`\n或者直接替换原文件：`);
  console.log(`   mv ${outputPath} ${path.join(__dirname, 'seed.sql')}`);

} catch (error) {
  console.error('❌ 生成失败:', error.message);
  process.exit(1);
}

