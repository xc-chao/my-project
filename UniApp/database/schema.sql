-- ==========================================
-- ScanShop 数据库表结构定义（重新设计）
-- 数据库：scanshop_db
-- 版本：v2.0
-- 创建时间：2025-12-30
-- ==========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS scanshop_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE scanshop_db;

-- ==========================================
-- 1. 用户表（users）
-- 存储微信小程序用户的完整信息
-- ==========================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` VARCHAR(100) DEFAULT NULL UNIQUE COMMENT '微信用户唯一标识',
  `nickname` VARCHAR(100) DEFAULT NULL COMMENT '用户昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '用户头像URL',
  `phone` VARCHAR(20) DEFAULT NULL UNIQUE COMMENT '手机号码',
  `password` VARCHAR(255) DEFAULT NULL COMMENT '密码（bcrypt加密）',
  `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_openid` (`openid`),
  UNIQUE INDEX `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ==========================================
-- 2. 商品表（products）
-- 存储商品信息，包括条形码、价格、库存、分类等
-- ==========================================
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `barcode` VARCHAR(50) NOT NULL UNIQUE COMMENT '商品条形码',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `price` DECIMAL(10, 2) NOT NULL COMMENT '商品价格',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '商品图片URL',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '商品分类',
  `description` TEXT DEFAULT NULL COMMENT '商品描述',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0=下架,1=上架',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_barcode` (`barcode`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- ==========================================
-- 3. 购物车表（cart_items）
-- 存储用户的购物车商品
-- ==========================================
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '购物车项ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `product_id` INT NOT NULL COMMENT '商品ID',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '商品数量',
  `selected` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否选中：0=未选中,1=已选中',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_user_product` (`user_id`, `product_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- ==========================================
-- 4. 订单表（orders）
-- 存储用户的订单主表信息
-- ==========================================
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `total_amount` DECIMAL(10, 2) NOT NULL COMMENT '订单总金额',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态：0=待支付,1=已支付,2=已取消,3=已完成',
  `payment_method` VARCHAR(20) DEFAULT NULL COMMENT '支付方式：wechat=微信支付,balance=余额支付',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_order_no` (`order_no`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ==========================================
-- 5. 订单商品表（order_items）
-- 存储订单的商品明细（一个订单可以包含多个商品）
-- ==========================================
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '订单明细ID',
  `order_id` INT NOT NULL COMMENT '订单ID',
  `product_id` INT NOT NULL COMMENT '商品ID',
  `quantity` INT NOT NULL COMMENT '购买数量',
  `price` DECIMAL(10, 2) NOT NULL COMMENT '商品单价（下单时的价格）',
  `subtotal` DECIMAL(10, 2) NOT NULL COMMENT '小计金额',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orderitems_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- ==========================================
-- 6. 支付记录表（payments）
-- 存储支付相关的信息和微信支付参数
-- ==========================================
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '支付记录ID',
  `order_id` INT NOT NULL COMMENT '订单ID',
  `payment_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '支付流水号',
  `transaction_id` VARCHAR(100) DEFAULT NULL COMMENT '微信支付交易号',
  `payment_method` VARCHAR(20) NOT NULL COMMENT '支付方式：wechat=微信支付,balance=余额支付',
  `amount` DECIMAL(10, 2) NOT NULL COMMENT '支付金额',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '支付状态：0=待支付,1=已支付,2=已退款,3=已关闭',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付成功时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_payment_no` (`payment_no`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_transaction_id` (`transaction_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- ==========================================
-- 创建视图：用户订单统计
-- ==========================================
CREATE OR REPLACE VIEW `view_user_order_stats` AS
SELECT 
  u.id AS user_id,
  u.nickname,
  COUNT(o.id) AS total_orders,
  SUM(CASE WHEN o.status = 1 THEN o.total_amount ELSE 0 END) AS total_spent,
  MAX(o.created_at) AS last_order_time
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.nickname;

-- ==========================================
-- 创建视图：商品销售统计
-- ==========================================
CREATE OR REPLACE VIEW `view_product_sales_stats` AS
SELECT 
  p.id AS product_id,
  p.barcode,
  p.name,
  p.category,
  COALESCE(SUM(oi.quantity), 0) AS total_sold,
  COALESCE(SUM(oi.subtotal), 0) AS total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 1
GROUP BY p.id, p.barcode, p.name, p.category;

-- ==========================================
-- 表结构创建完成
-- ==========================================

-- 显示所有表
SHOW TABLES;
