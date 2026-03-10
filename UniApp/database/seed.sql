-- ==========================================
-- ScanShop 商品数据 SQL（更新图片链接版）
-- 所有图片链接已替换为真实有效的图片
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
INSERT INTO `users` (`openid`, `nickname`, `avatar`, `phone`, `password`, `balance`) VALUES
('mock_openid_user_001', '张三', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLHqKQhLFFZRj2ZqxxGcfIL0lLicXpZg2VCOOsQ83QYHlcW6L2M5z4ibj4R4n8lY9wLiaqJg9QYQy2Vg/132', '13800138001', '$2a$10$jiE/OYOlNhkzVCnOVOewx.vsOStvOkEs.B6se1.4/YCuKqudvr/te', 100.00),
('mock_openid_user_002', '李四', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDXg3wvfwMZibPR8zclic8icn9FQ4ic0iaKKBxCgX8jqicicCf87qhBSxFWS3lJ1icOuQhBkRQqg0oBiayJzg/132', '13800138002', '$2a$10$jiE/OYOlNhkzVCnOVOewx.vsOStvOkEs.B6se1.4/YCuKqudvr/te', 50.00),
('mock_openid_user_003', '王五（微信用户）', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKzBGLvY0r0aQcPMV9ibLq5yiaQkQ8ibhCwS2VVibkiaH2x2P16ia2q3w7R4yZqSgX4T3ZJ7w9OeSicXx1Q/132', NULL, NULL, 0.00);

-- ==========================================
-- 2. 插入商品数据（图片链接已更新为真实有效链接）
-- ==========================================

-- 方便食品类
INSERT INTO `products` (`barcode`, `name`, `price`, `stock`, `image_url`, `category`, `description`) VALUES
('6901668001016', '康师傅红烧牛肉面', 4.5, 120, 'https://s3.bmp.ovh/imgs/2025/12/31/52cb684b1b89b6fb.webp', '方便食品', '经典红烧牛肉口味'),
('6901668001023', '康师傅香辣牛肉面', 4.5, 100, 'https://s3.bmp.ovh/imgs/2025/12/31/834b824c5a228786.webp', '方便食品', '香辣过瘾'),
('6901668001030', '统一老坛酸菜面', 4.5, 110, 'https://s3.bmp.ovh/imgs/2025/12/31/7e4ec96f0afd7bb4.webp', '方便食品', '酸爽开胃，回味悠长'),
('6921168520121', '统一汤达人 79g', 6.5, 80, 'https://s3.bmp.ovh/imgs/2025/12/31/63c54b611b7a8b50.webp', '方便食品', '真材实料，好汤好面'),
('6902083891091', '今麦郎红烧牛肉面', 4, 90, 'https://s3.bmp.ovh/imgs/2025/12/31/d55bec8f5dfc229e.webp', '方便食品', '料足味美'),
('6902265111146', '白象大辣娇 115g', 5, 75, 'https://s3.bmp.ovh/imgs/2025/12/31/c4c77177a8a9d3b0.webp', '方便食品', '辣到过瘾'),
('6901668001047', '海底捞自煮火锅', 35, 40, 'https://s3.bmp.ovh/imgs/2025/12/31/8ac0d018e58c02e0.webp', '方便食品', '随时随地享受火锅美味'),
('6921168520138', '自嗨锅麻辣烫 140g', 18, 55, 'https://s3.bmp.ovh/imgs/2025/12/31/7ec5646f4e8825fc.webp', '方便食品', '一个人的麻辣烫');

-- 日用品类
INSERT INTO `products` (`barcode`, `name`, `price`, `stock`, `image_url`, `category`, `description`) VALUES
('6901939622438', '益达口香糖 木糖醇', 6.5, 150, 'https://s3.bmp.ovh/imgs/2025/12/31/f33dc23590d76c75.webp', '日用品', '清新口气，保护牙齿'),
('6921168520145', '绿箭口香糖', 6, 140, 'https://s41.ax1x.com/2026/01/04/pZau6OO.webp', '日用品', '清新口气，自信微笑'),
('6902083891114', '清风纸巾 3包装', 9.9, 80, 'https://s3.bmp.ovh/imgs/2025/12/31/b4c47b94db320fb4.webp', '日用品', '柔软亲肤'),
('6902265111160', '维达纸巾 4包装', 12, 70, 'https://s41.ax1x.com/2026/01/04/pZauy6K.webp', '日用品', '韧性好，不易破'),
('6901668001054', '舒肤佳香皂', 5.5, 90, 'https://s41.ax1x.com/2026/01/04/pZau0YR.webp', '日用品', '健康除菌'),
('6921168520152', '高露洁牙膏 140g', 15, 65, 'https://s41.ax1x.com/2026/01/04/pZantIA.webp', '日用品', '防蛀固齿'),
('6902083891121', '云南白药牙膏 100g', 19.9, 55, 'O1CN017I6WtU2A1YEmov0E6_!!3301608143.jpg_.webp', '日用品', '呵护牙龈健康'),
('6902265111177', '海飞丝洗发水 200ml', 29.9, 40, '1https://s41.ax1x.com/2026/01/04/pZanUPI.webp', '日用品', '去屑止痒'),
('6901939622445', '潘婷护发素 200ml', 28, 45, 'https://s41.ax1x.com/2026/01/04/pZauwk9.webp', '日用品', '修复发质，柔顺亮泽'),
('6921168520169', '立白洗衣液 500g', 16.9, 50, 'https://s41.ax1x.com/2026/01/04/pZaK3AH.webp', '日用品', '强效去污，温和护衣'),
('6902083891138', '蓝月亮洗手液 500ml', 18.9, 60, 'https://s41.ax1x.com/2026/01/04/pZaKDEQ.webp', '日用品', '抑菌护手'),
('6902265111184', '妮维雅润肤露 200ml', 35, 35, 'https://s41.ax1x.com/2026/01/04/pZaKIUJ.webp', '日用品', '深层滋润，持久保湿'),
('6901668001061', '威露士消毒液 500ml', 22, 45, 'https://s41.ax1x.com/2026/01/04/pZaKt3t.webp', '日用品', '有效杀菌，安心守护'),
('6921168520176', '立白洗洁精 500g', 8.9, 100, 'https://s41.ax1x.com/2026/01/04/pZauL7Q.webp', '日用品', '强效去油，不伤手'),
('6902083891145', '蓝月亮洁厕灵 500ml', 12.9, 55, 'https://s41.ax1x.com/2026/01/04/pZaKfK0.webp', '日用品', '强力去污，清新除臭'),
('6902265111191', '榄菊蚊香液 2瓶装', 18, 40, 'https://s41.ax1x.com/2026/01/04/pZaKrNj.webp', '日用品', '驱蚊效果好，无刺激'),
('6901939622452', '垃圾袋 50只装', 9.9, 80, 'https://s41.ax1x.com/2026/01/04/pZaKm1x.webp', '日用品', '加厚耐用，不易破'),
('6921168520183', '保鲜膜 30m', 7.5, 70, 'https://s41.ax1x.com/2026/01/04/pZaKY9I.webp', '日用品', '安全环保，锁鲜保质'),
('6902083891152', '铝箔纸 10m', 12, 50, 'https://s41.ax1x.com/2026/01/04/pZaKEN9.webp', '日用品', '烧烤烘焙好帮手'),
('6902265111207', '厨房用纸 2卷装', 15, 60, 'https://s41.ax1x.com/2026/01/04/pZauXkj.webp', '日用品', '吸油吸水，厨房必备');

-- 零食类
INSERT INTO `products` (`barcode`, `name`, `price`, `stock`, `image_url`, `category`, `description`) VALUES
('6902083891053', '乐事原味薯片 70g', 7.5, 80, 'https://img.alicdn.com/imgextra/i2/6000000001159/O1CN01XSMYV81fq1r2k4yHX_!!6000000001159-0-at.jpg', '零食', '片片刻刻有乐事'),
('6921168520107', '乐事黄瓜味薯片 70g', 7.5, 75, 'https://img.alicdn.com/imgextra/i1/6000000003889/O1CN01KdrlMc1iMoTNfzL6p_!!6000000003889-0-at.jpg', '零食', '清新黄瓜味'),
('6902265111115', '旺旺雪饼 150g', 6, 90, 'https://img.alicdn.com/imgextra/i1/6000000003840/O1CN01QAd4be1iM02D3ZgNf_!!6000000003840-0-at.jpg', '零食', '香酥可口的经典零食'),
('6901939622421', '旺旺仙贝 150g', 6, 85, 'https://img.alicdn.com/imgextra/i1/6000000003840/O1CN01QAd4be1iM02D3ZgNf_!!6000000003840-0-at.jpg', '零食', '好吃你就多吃点'),
('6902083891060', '奥利奥夹心饼干', 8.5, 70, 'https://img.alicdn.com/imgextra/i4/6000000003592/O1CN01FPhb241eQq6A9Efkc_!!6000000003592-0-at.jpg', '零食', '扭一扭，舔一舔，泡一泡'),
('6902083891077', '士力架巧克力', 5, 100, 'https://img.alicdn.com/imgextra/i1/6000000001583/O1CN012s24Jl1fq1cXjW2BP_!!6000000001583-0-at.jpg', '零食', '横扫饥饿，补充能量'),
('6902265111122', '德芙巧克力 43g', 9.9, 60, 'https://img.alicdn.com/imgextra/i4/6000000000703/O1CN01DrLcr21fq8M0U9yYG_!!6000000000703-0-at.jpg', '零食', '纵享丝滑'),
('6921168520114', '上好佳洋葱圈 40g', 3.5, 110, 'https://img.alicdn.com/imgextra/i1/6000000002009/O1CN01T7npp81Yh6bVw0u5J_!!6000000002009-0-at.jpg', '零食', '香脆可口'),
('6902083891084', '卫龙辣条 106g', 5.5, 130, 'https://img.alicdn.com/imgextra/i4/6000000002009/O1CN01x9rbnS1Yh6bW8c5CI_!!6000000002009-0-at.jpg', '零食', '辣条界的扛把子'),
('6902265111139', '好丽友派 28g', 3, 95, 'https://img.alicdn.com/imgextra/i4/6000000001580/O1CN01pRGkw71fq1d0f9d53_!!6000000001580-0-at.jpg', '零食', '软软的，甜甜的'),
('6902083891107', '三只松鼠坚果 100g', 25, 60, 'https://img.alicdn.com/imgextra/i4/6000000001067/O1CN01Awm1DZ1fq1g7rw8e1_!!6000000001067-0-at.jpg', '零食', '每日坚果，营养健康'),
('6902265111153', '良品铺子猪肉脯', 28, 45, 'https://img.alicdn.com/imgextra/i4/725677994/O1CN01GdT7s728vIl0QJFzD_!!725677994.jpg_430x430q90.jpg', '零食', '香嫩可口，回味无穷');

-- 饮料类
INSERT INTO `products` (`barcode`, `name`, `price`, `stock`, `image_url`, `category`, `description`) VALUES
('6901028075831', '可口可乐 330ml', 3, 100, 'https://img.alicdn.com/imgextra/i4/725677994/O1CN01xUs0xZ28vIkn19noC_!!725677994.jpg_430x430q90.jpg', '饮料', '经典美味，畅爽怡神'),
('6902083891015', '农夫山泉 550ml', 2, 200, 'https://img.alicdn.com/imgextra/i2/6000000001229/O1CN01wNvC7C1fq1pN2Wcqr_!!6000000001229-0-at.jpg', '饮料', '我们不生产水，我们只是大自然的搬运工'),
('6921168509690', '怡宝纯净水 555ml', 1.5, 300, 'https://img.alicdn.com/imgextra/i3/6000000000869/O1CN015djmIP1fq8Lf6hOhL_!!6000000000869-0-at.jpg', '饮料', '纯净好水，健康之选'),
('6902083891022', '脉动青柠口味 600ml', 4, 150, 'https://img.alicdn.com/imgextra/i1/6000000000871/O1CN01DUTZBH1fq8Lv9aF6l_!!6000000000871-0-at.jpg', '饮料', '运动饮料，补充能量'),
('6901939622414', '伊利纯牛奶 250ml', 3.5, 180, 'https://img.alicdn.com/imgextra/i3/6000000001147/O1CN01JRQnKR1fq1rBUlw31_!!6000000001147-0-at.jpg', '饮料', '优质奶源，营养健康'),
('6901939613481', '蒙牛纯牛奶 250ml', 3.5, 160, 'https://img.alicdn.com/imgextra/i4/6000000003842/O1CN01mAW6zW1iM03T4rS9s_!!6000000003842-0-at.jpg', '饮料', '每天一杯，健康相伴'),
('6902083891039', '百事可乐 330ml', 3, 120, 'https://img.alicdn.com/imgextra/i1/6000000001626/O1CN01C28HhB1fq1e4B5Iyl_!!6000000001626-0-at.jpg', '饮料', '年轻人的选择'),
('6920907400014', '加多宝凉茶 310ml', 4.5, 100, 'https://img.alicdn.com/imgextra/i1/6000000000871/O1CN01Jmgszu1fq8M2qOeNT_!!6000000000871-0-at.jpg', '饮料', '怕上火，喝加多宝'),
('6901028015837', '雪碧 330ml', 3, 110, 'https://img.alicdn.com/imgextra/i3/6000000001159/O1CN01Cb0BRa1fq1r2g4y8o_!!6000000001159-0-at.jpg', '饮料', '清凉透心，活力畅爽'),
('6902083891046', '冰红茶 500ml', 3.5, 140, 'https://img.alicdn.com/imgextra/i1/6000000001229/O1CN018t7Kea1fq1pOkmfgY_!!6000000001229-0-at.jpg', '饮料', '清爽冰红茶，美味无法挡');

-- ==========================================
-- 3. 插入购物车数据
-- 注意：product_id 根据实际插入后的 id，不是固定的
-- 建议先查询 products 表获取正确的 id
-- ==========================================
INSERT INTO `cart_items` (`user_id`, `product_id`, `quantity`) VALUES
(1, 1, 2),  -- 张三的购物车：2份方便食品
(1, 29, 1), -- 张三的购物车：1份零食
(2, 2, 3),  -- 李四的购物车：3份方便食品
(2, 9, 2); -- 李四的购物车：2份日用品

-- ==========================================
-- 4. 插入订单数据
-- ==========================================
INSERT INTO `orders` (`order_no`, `user_id`, `total_amount`, `status`, `payment_method`, `paid_at`) VALUES
('SN202512300001', 1, 15.50, 1, 'wechat', '2025-12-30 10:30:00'),
('SN202512300002', 2, 10.00, 1, 'balance', '2025-12-30 11:00:00'),
('SN202512300003', 1, 8.00, 0, NULL, NULL);

-- ==========================================
-- 5. 插入订单商品数据
-- ==========================================
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`, `subtotal`) VALUES
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