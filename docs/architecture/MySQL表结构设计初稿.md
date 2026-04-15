# MySQL 表结构设计初稿

## 文档目标

这份文档用于把当前项目从 `mockDb` 升级到 `MySQL` 时的核心数据结构先定下来。

它解决的是 4 个问题：

1. 当前前端页面和字段到底应该落到哪些表
2. 第一阶段应该先建哪些表，后建哪些表
3. 哪些字段可以先用 `JSON`，哪些字段必须拆子表
4. 如何尽量兼容当前前端已有的数据结构，降低 mock 切库成本

## 一、设计边界

### 1. 当前目标

当前不是直接做一个“大而全”的电商库，而是优先服务当前项目已有的业务闭环：

- 用户登录与个人资料
- 首页、搜索、商品详情
- 地址、购物车、订单
- 售后与反馈
- 管理员后台
- AI 聊天记录

### 2. 主键策略

为减少当前前端与 mock 数据切换成本，第一阶段建议：

- 主业务表先使用 `varchar(40)` 作为业务主键
- 业务 id 格式尽量兼容现有前端习惯

例如：

- `u_001`
- `p_001`
- `order_001`
- `after_001`
- `feedback_001`

这样做的好处是：

- 前端不用大规模改 id 类型
- mock 数据迁移更平滑
- 管理端和 C 端页面的路由参数不需要同步重构

后续如果系统规模扩大，再评估是否引入内部 `bigint` 自增主键与业务 id 分离。

### 3. 命名规范

表名建议统一使用：

- 复数名词
- 小写
- 下划线分隔

例如：

- `users`
- `product_galleries`
- `cart_items`
- `order_timeline`

字段名建议统一使用：

- 小写
- 下划线分隔

例如：

- `original_price`
- `sale_status`
- `created_at`

### 4. 时间字段规范

建议所有核心表至少都有：

- `created_at datetime not null`
- `updated_at datetime not null`

订单时间线、聊天消息这类流水表，建议使用：

- `occurred_at`
- `sent_at`

而不是只有 `created_at`。

### 5. JSON 与子表的边界

当前项目为了快速落地，可以先接受部分字段用 JSON：

- `products.badges_json`
- `products.sizes_json`
- `orders.address_snapshot_json`

但图集不要放 JSON，建议拆成子表：

- `product_galleries`

原因是图集现在已经支持：

- 删除单张
- 拖拽调整顺序
- 设定首图顺序

这类能力更适合单独表结构。

## 二、推荐建表顺序

### 第一批必须先建

- `users`
- `products`
- `product_galleries`

这三张表对应第一阶段：

- `Auth`
- `Product`
- `Search`

### 第二批建议跟进

- `addresses`
- `cart_items`

### 第三批交易核心

- `orders`
- `order_items`
- `order_timeline`
- `order_shipments`

### 第四批闭环补充

- `after_sales`
- `feedbacks`

### 第五批增强能力

- `chat_sessions`
- `chat_messages`

## 三、第一阶段核心表详细设计

### 1. `users`

用途：

- 存储登录用户与管理员
- 承载 `profile/account` 页面资料修改
- 作为所有登录态业务的外键源

建议字段：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `id` | `varchar(40)` | 是 | 用户业务主键 |
| `nickname` | `varchar(50)` | 是 | 昵称 |
| `phone` | `varchar(20)` | 否 | 手机号 |
| `avatar` | `varchar(500)` | 否 | 头像 URL 或本地资源路径 |
| `role` | `enum('user','admin')` | 是 | 用户角色 |
| `wechat_openid` | `varchar(64)` | 否 | 微信登录标识 |
| `status` | `enum('active','disabled')` | 是 | 账号状态 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

建议索引：

- `primary key (id)`
- `unique key uk_users_phone (phone)`
- `unique key uk_users_wechat_openid (wechat_openid)`
- `key idx_users_role (role)`

建议 DDL：

```sql
create table users (
  id varchar(40) not null,
  nickname varchar(50) not null,
  phone varchar(20) null,
  avatar varchar(500) null,
  role enum('user', 'admin') not null default 'user',
  wechat_openid varchar(64) null,
  status enum('active', 'disabled') not null default 'active',
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  primary key (id),
  unique key uk_users_phone (phone),
  unique key uk_users_wechat_openid (wechat_openid),
  key idx_users_role (role)
) engine=InnoDB default charset=utf8mb4;
```

### 2. `products`

用途：

- 首页商品列表
- 搜索结果列表
- 商品详情页
- 管理端商品管理

建议字段：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `id` | `varchar(40)` | 是 | 商品业务主键 |
| `title` | `varchar(120)` | 是 | 商品标题 |
| `subtitle` | `varchar(255)` | 是 | 商品副标题 |
| `price` | `decimal(10,2)` | 是 | 现价 |
| `original_price` | `decimal(10,2)` | 是 | 原价 |
| `stock` | `int unsigned` | 是 | 库存 |
| `sales` | `int unsigned` | 是 | 销量 |
| `category` | `varchar(30)` | 是 | 商品分类 |
| `cover` | `varchar(500)` | 是 | 封面图 |
| `detail` | `text` | 是 | 商品说明 |
| `sale_status` | `enum('on_sale','off_shelf')` | 是 | 上下架状态 |
| `badges_json` | `json` | 否 | 标签数组 |
| `sizes_json` | `json` | 否 | 尺码/规格数组 |
| `is_new_in_48h` | `tinyint(1)` | 是 | 是否属于 48h 上新 |
| `praise_rate` | `decimal(5,2)` | 否 | 好评率，例如 `95.00` |
| `service_tags_json` | `json` | 否 | 服务标签 |
| `ship_within_hours` | `int unsigned` | 否 | 发货时效 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

建议索引：

- `primary key (id)`
- `key idx_products_category (category)`
- `key idx_products_sale_status (sale_status)`
- `key idx_products_price (price)`
- `key idx_products_sales (sales)`
- `key idx_products_new48h (is_new_in_48h)`
- `key idx_products_created_at (created_at)`

建议 DDL：

```sql
create table products (
  id varchar(40) not null,
  title varchar(120) not null,
  subtitle varchar(255) not null,
  price decimal(10,2) not null,
  original_price decimal(10,2) not null,
  stock int unsigned not null default 0,
  sales int unsigned not null default 0,
  category varchar(30) not null,
  cover varchar(500) not null,
  detail text not null,
  sale_status enum('on_sale', 'off_shelf') not null default 'on_sale',
  badges_json json null,
  sizes_json json null,
  is_new_in_48h tinyint(1) not null default 0,
  praise_rate decimal(5,2) null,
  service_tags_json json null,
  ship_within_hours int unsigned null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  primary key (id),
  key idx_products_category (category),
  key idx_products_sale_status (sale_status),
  key idx_products_price (price),
  key idx_products_sales (sales),
  key idx_products_new48h (is_new_in_48h),
  key idx_products_created_at (created_at)
) engine=InnoDB default charset=utf8mb4;
```

### 3. `product_galleries`

用途：

- 存储商品图集
- 支持后台图集顺序调整
- 支持首图在详情页优先展示

建议字段：

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `id` | `bigint unsigned` | 是 | 自增主键 |
| `product_id` | `varchar(40)` | 是 | 关联商品 |
| `image_url` | `varchar(500)` | 是 | 图片地址 |
| `sort_no` | `int unsigned` | 是 | 排序号，越小越靠前 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

建议索引：

- `primary key (id)`
- `key idx_product_galleries_product_id (product_id)`
- `unique key uk_product_galleries_sort (product_id, sort_no)`

建议 DDL：

```sql
create table product_galleries (
  id bigint unsigned not null auto_increment,
  product_id varchar(40) not null,
  image_url varchar(500) not null,
  sort_no int unsigned not null default 0,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  primary key (id),
  unique key uk_product_galleries_sort (product_id, sort_no),
  key idx_product_galleries_product_id (product_id)
) engine=InnoDB default charset=utf8mb4;
```

## 四、后续业务表草案

### 1. `addresses`

建议字段：

- `id`
- `user_id`
- `name`
- `phone`
- `region`
- `detail`
- `is_default`
- `created_at`
- `updated_at`

关键约束：

- `user_id` 必须建索引
- 同一个用户允许多地址
- 默认地址建议在 service 层保证只有一条

### 2. `cart_items`

建议字段：

- `id`
- `user_id`
- `product_id`
- `quantity`
- `size`
- `selected`
- `created_at`
- `updated_at`

关键约束：

- 唯一键建议使用 `(user_id, product_id, size)`

### 3. `orders`

建议字段：

- `id`
- `user_id`
- `status`
- `amount`
- `address_id`
- `address_snapshot_json`
- `remark`
- `created_at`
- `updated_at`

说明：

- 订单必须保留地址快照，不应只靠 `address_id` 回查
- 第一阶段可以只保留单一 `status`

### 4. `order_items`

建议字段：

- `id`
- `order_id`
- `product_id`
- `product_title_snapshot`
- `product_cover_snapshot`
- `price_snapshot`
- `size_snapshot`
- `quantity`
- `created_at`

说明：

- 订单明细不要依赖商品当前标题和当前价格
- 必须保留快照字段

### 5. `order_timeline`

建议字段：

- `id`
- `order_id`
- `title`
- `description`
- `occurred_at`

用途：

- 后台订单详情页时间线
- 用户订单后续详情页时间线

### 6. `order_shipments`

建议字段：

- `id`
- `order_id`
- `carrier`
- `tracking_no`
- `updated_at`

说明：

- 一期先按一单一运单设计
- 如果后续支持拆单，再扩展成一单多运单

### 7. `after_sales`

建议字段：

- `id`
- `user_id`
- `order_id`
- `order_item_id`
- `product_title`
- `reason`
- `status`
- `admin_remark`
- `created_at`
- `updated_at`

### 8. `feedbacks`

建议字段：

- `id`
- `user_id`
- `product_id`
- `user_name_snapshot`
- `product_title_snapshot`
- `summary`
- `status`
- `created_at`
- `updated_at`

### 9. `chat_sessions`

建议字段：

- `id`
- `user_id`
- `product_id`
- `title`
- `created_at`
- `updated_at`

### 10. `chat_messages`

建议字段：

- `id`
- `session_id`
- `role`
- `content`
- `created_at`

## 五、与当前前端字段的映射关系

### 1. 用户资料页

当前前端页面：

- `pages/profile/index`
- `pages/profile/account`

关键字段映射：

- `nickname` -> `users.nickname`
- `avatar` -> `users.avatar`
- `role` -> `users.role`
- `phone` -> `users.phone`

### 2. 首页与搜索页

关键字段映射：

- `title` -> `products.title`
- `subtitle` -> `products.subtitle`
- `price` -> `products.price`
- `originalPrice` -> `products.original_price`
- `cover` -> `products.cover`
- `badges` -> `products.badges_json`
- `saleStatus` -> `products.sale_status`
- `48h 上新` -> `products.is_new_in_48h`
- `95% 好评` -> `products.praise_rate`

### 3. 商品详情页

建议由后端直接返回或在 service 层组装：

- 基础信息
- 图集
- 营销标签
- 服务标签
- 发货时效

也就是说，`GET /api/products/:id` 的数据不应只来自 `products` 表，还应组装：

- `product_galleries`
- `badges_json`
- `service_tags_json`

### 4. 商品图集后台排序

当前后台商品表单已经支持：

- 追加图片
- 删除图片
- 拖拽调整顺序

因此保存商品时应把图集顺序写入：

- `product_galleries.sort_no`

而不是把顺序丢给前端自己记忆。

## 六、Migration 建议顺序

建议 migration 文件按以下顺序建立：

1. `001_create_users_table`
2. `002_create_products_table`
3. `003_create_product_galleries_table`
4. `004_create_addresses_table`
5. `005_create_cart_items_table`
6. `006_create_orders_table`
7. `007_create_order_items_table`
8. `008_create_order_timeline_table`
9. `009_create_order_shipments_table`
10. `010_create_after_sales_table`
11. `011_create_feedbacks_table`
12. `012_create_chat_sessions_table`
13. `013_create_chat_messages_table`

## 七、Seed 建议

第一阶段建议至少准备这些 seed：

- 1 个普通用户
- 1 个管理员
- 20 到 50 条商品数据
- 每个商品 3 到 5 张图集

第二阶段再补：

- 地址
- 购物车
- 订单
- 售后
- 反馈

这样更利于分阶段联调。

## 八、当前不建议立即做的复杂设计

以下能力可以后置，不建议第一版就做：

- 多仓库库存
- 多运单拆单
- SKU 复杂属性矩阵
- 优惠券表
- 支付流水表
- 商品收藏表
- 推荐算法表

第一版数据库只需要先支撑当前已经完成的前端页面闭环。

## 九、落地建议

如果下一步要正式开始编码，建议先只落这三张表：

- `users`
- `products`
- `product_galleries`

原因是它们能优先支撑：

- 登录与个人资料
- 首页与搜索页
- 商品详情页
- 后台商品管理

也就是最先能把 `Auth + Product + Search` 从 mock 中拆出来。
