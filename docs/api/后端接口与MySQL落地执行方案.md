# 后端接口与 MySQL 落地执行方案

## 文档目标

这份文档用于回答 3 个关键问题：

1. 当前前端页面和功能是否已经形成可进入后端开发的闭环
2. 如果进入真实后端开发，应该先做哪些模块，后做哪些模块
3. 如何把当前 `Express + mockDb` 平滑升级为 `Express + MySQL`

这不是一份“接口字段罗列文档”，而是一份**执行方案**。

目标是让项目从“前端演示可用”逐步升级为“前后端真实可用、数据可持久化、接口可持续演进”的状态。

## 一、当前结论

### 1. 前端是否已经形成闭环

结论：

- 从**前端演示闭环**角度看，已经基本形成闭环
- 从**真实生产闭环**角度看，还没有完全形成闭环
- 但当前状态已经足够支持进入后端真实接口与数据库开发阶段

### 2. 已形成的前端演示闭环

#### 普通用户链路

- 登录
- 首页浏览
- 搜索与筛选
- 商品详情
- 加入购物车
- 下单确认
- 历史订单
- 售后申请
- 地址管理
- 个人资料管理
- AI 咨询

#### 管理员链路

- 管理员登录
- 我的页后台入口
- 后台总览
- 商品管理
- 商品新增/编辑
- 订单处理
- 订单详情
- 售后审批
- 反馈与看板

### 3. 当前还不是“真实生产闭环”的原因

- 前端请求默认仍可走 `mock`
- 登录仍是演示登录，不是真实微信或短信登录
- 支付链路未接真实支付与回调
- 聊天仍是 mock AI 回复
- 少量页面仍依赖前端 mock 数据思路
- 当前后端数据层仍是 `mockDb` 内存对象，并未落 MySQL

结论：

- 不需要再继续堆前端页面
- 应该开始分模块落地后端真实接口
- 数据层应尽快从 `mockDb` 切到 `MySQL`

## 二、总执行原则

### 1. 契约先行，再写代码

每个模块都按这个顺序做：

1. 先确定接口路径
2. 再确定请求参数
3. 再确定响应结构
4. 再确定数据库表结构
5. 最后再写 controller / service / repository

### 2. 先做主链路，再做增强能力

开发顺序必须优先保障：

- 登录
- 商品
- 地址
- 购物车
- 下单
- 订单
- 售后

而不是先做：

- 高级报表
- AI 优化
- 复杂推荐
- 运营扩展字段

### 3. 先只读，再读写，再事务

每个模块落地顺序建议是：

1. 先做列表和详情
2. 再做新增和编辑
3. 最后做带事务和状态流转的接口

例如：

- 商品先做 `GET /products`、`GET /products/:id`
- 地址再做 `POST /addresses`
- 订单最后做 `POST /orders`

### 4. 前端逐模块脱离 mock

不要一次性把整个前端切到真实后端。

建议做法：

- 某个模块后端完成后
- 只让对应前端模块先切真实接口
- 其他未完成模块继续保留 mock

这样更安全，也更容易定位问题。

## 三、建议数据库实体

当前项目从 `mockDb` 升级到 MySQL 时，建议先建立这些核心表。

### 1. 用户与认证

- `users`

核心字段建议：

- `id`
- `nickname`
- `phone`
- `avatar`
- `role`
- `wechat_openid`
- `created_at`
- `updated_at`

### 2. 商品

- `products`
- `product_galleries`

核心字段建议：

- `products.id`
- `title`
- `subtitle`
- `price`
- `original_price`
- `stock`
- `sales`
- `category`
- `cover`
- `detail`
- `sale_status`
- `badges_json`
- `sizes_json`

如果后续需要更强扩展性，再拆：

- `product_badges`
- `product_skus`

### 3. 地址

- `addresses`

核心字段建议：

- `id`
- `user_id`
- `name`
- `phone`
- `region`
- `detail`
- `is_default`

### 4. 购物车

- `cart_items`

核心字段建议：

- `id`
- `user_id`
- `product_id`
- `quantity`
- `size`

### 5. 订单

- `orders`
- `order_items`
- `order_timeline`
- `order_shipments`

核心字段建议：

- `orders.id`
- `user_id`
- `status`
- `amount`
- `address_id`
- `remark`
- `created_at`
- `updated_at`

### 6. 售后

- `after_sales`

核心字段建议：

- `id`
- `user_id`
- `order_id`
- `product_title`
- `reason`
- `status`
- `created_at`
- `updated_at`

### 7. 用户反馈

- `feedbacks`

核心字段建议：

- `id`
- `user_id`
- `product_id`
- `summary`
- `status`
- `created_at`

### 8. 聊天

- `chat_sessions`
- `chat_messages`

第一阶段只需要做到：

- 会话可持久化
- 消息可持久化

AI 回复本身可以后接。

## 四、推荐目录落地

建议在 `backend` 里新增数据库层目录：

```text
backend/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── env.js
│   │   └── db.js
│   ├── common/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── address/
│   │   ├── afterSale/
│   │   ├── chat/
│   │   └── admin/
│   └── integrations/
├── database/
│   ├── migrations/
│   └── seeds/
└── package.json
```

## 五、分阶段执行方案

下面的阶段不是“可选建议”，而是推荐的实际执行顺序。

### Phase 0：冻结接口契约

#### Phase 0 目标

在正式连 MySQL 之前，先把接口边界定死，避免边开发边改路径和字段。

#### Phase 0 任务

1. 统一接口前缀为 `/api`
2. 搜索能力尽量收敛到 `GET /api/products`
3. 统一成功响应结构
4. 统一错误响应结构
5. 统一分页、排序、筛选 query 参数
6. 统一订单状态与售后状态流转
7. 统一哪些接口需要登录、哪些接口需要管理员权限

#### Phase 0 产出

- 最终接口清单
- 字段字典
- 状态流转说明
- 前后端接口映射表

#### Phase 0 完成标志

- 后续所有模块都按统一契约实现
- 不再出现“页面要什么字段就临时补什么字段”的情况

### Phase 1：搭建 MySQL 基础设施

#### Phase 1 目标

把当前后端从“只有 Express，没有数据库基础设施”升级为“可连接 MySQL、可迁移、可导入初始数据”。

#### Phase 1 任务

1. 安装数据库依赖
2. 配置数据库连接池
3. 新增 `.env` 数据库配置
4. 建立 `migrations` 目录
5. 建立 `seeds` 目录
6. 增加数据库健康检查能力
7. 先导入基础 seed 数据

#### Phase 1 建议依赖

- `mysql2`
- `knex`
- `dotenv`

#### Phase 1 产出

- `backend/src/config/db.js`
- `backend/database/migrations/*`
- `backend/database/seeds/*`
- 初始数据库连接能力

#### Phase 1 完成标志

- 本地可连接 MySQL
- migration 可以执行
- seed 可以导入
- 服务启动时可正常连接数据库

### Phase 2：先做 Auth + User

#### Phase 2 原因

所有需要登录的模块都依赖稳定的 `userId` 和 `role`。

#### Phase 2 优先接口

1. `POST /api/auth/wechat-login`
2. `POST /api/auth/sms-code`
3. `POST /api/auth/sms-login`
4. `GET /api/auth/profile`
5. `PATCH /api/auth/profile`
6. `POST /api/auth/logout`

#### Phase 2 数据表

- `users`

#### Phase 2 额外说明

- 这一阶段先保证 JWT、用户资料、管理员角色可用
- 不必一开始就接真实微信开放平台，也可以先保留演示登录逻辑，但用户读取和资料更新必须走真实数据库

#### Phase 2 完成标志

- 登录可返回真实数据库用户
- 资料页可读写真实用户数据
- 退出登录可清理真实会话或 token 状态

### Phase 3：商品 + 搜索

#### Phase 3 原因

首页、搜索页、商品详情页都依赖这个模块，是用户浏览链路核心。

#### Phase 3 优先接口

1. `GET /api/products`
2. `GET /api/products/:id`
3. `GET /api/categories`

#### Phase 3 查询参数建议

- `keyword`
- `sort = comprehensive | priceAsc | priceDesc | hot`
- `scene = newIn48h | buyerFavorite`
- `category`
- `onSaleOnly`
- `page`
- `pageSize`

#### Phase 3 数据表

- `products`
- `product_galleries`

#### Phase 3 完成标志

- 首页、搜索页、商品详情全部切真实商品数据
- 首页指标联动和搜索筛选联动走真实查询
- mock 商品查询能力可逐步下线

### Phase 4：地址 + 购物车

#### Phase 4 原因

这是下单前必须完成的交易准备链路。

#### Phase 4 优先接口

1. `GET /api/addresses`
2. `POST /api/addresses`
3. `PUT /api/addresses/:id`
4. `DELETE /api/addresses/:id`
5. `GET /api/cart`
6. `POST /api/cart/items`
7. `PATCH /api/cart/items/:id`
8. `DELETE /api/cart/items/:id`

#### Phase 4 数据表

- `addresses`
- `cart_items`

#### Phase 4 完成标志

- 地址页真实 CRUD
- 购物车真实增删改查
- 购物车数据已按用户隔离

### Phase 5：订单主链路

#### Phase 5 原因

这是最关键的写操作模块，必须单独控制质量。

#### Phase 5 优先接口

1. `GET /api/orders/preview`
2. `POST /api/orders`
3. `GET /api/orders`
4. `GET /api/orders/:id`

#### Phase 5 数据表

- `orders`
- `order_items`
- `order_timeline`
- `order_shipments`

#### Phase 5 必须实现的事务逻辑

1. 校验商品和库存
2. 创建订单主表
3. 创建订单明细
4. 写入初始时间线
5. 清理购物车
6. 必要时扣减库存

#### Phase 5 完成标志

- 下单不再依赖 mock
- 历史订单可读真实数据
- 管理端订单处理也可复用这套数据

### Phase 6：售后 + 反馈

#### Phase 6 原因

这一步完成后，用户交易主闭环才算真正完整。

#### Phase 6 优先接口

1. `GET /api/after-sales`
2. `POST /api/after-sales`
3. `GET /api/admin/feedback`
4. `PATCH /api/admin/feedback/:id/status`

#### Phase 6 数据表

- `after_sales`
- `feedbacks`

#### Phase 6 完成标志

- 用户端可提交售后申请
- 管理员可处理售后和反馈
- 反馈与售后不再依赖前端 mock 列表

### Phase 7：管理员后台模块

#### Phase 7 原因

管理端依赖商品、订单、售后、反馈这些基础数据，应该在主链路稳定后再切真实。

#### Phase 7 优先接口

1. `GET /api/admin/overview`
2. `GET /api/admin/products`
3. `GET /api/admin/products/:id`
4. `POST /api/admin/products`
5. `PATCH /api/admin/products/:id`
6. `GET /api/admin/orders`
7. `GET /api/admin/orders/:id`
8. `PATCH /api/admin/orders/:id/status`
9. `PATCH /api/admin/orders/:id/logistics`
10. `GET /api/admin/after-sales`
11. `PATCH /api/admin/after-sales/:id/status`
12. `GET /api/admin/feedback`
13. `PATCH /api/admin/feedback/:id/status`

#### Phase 7 数据表

- 复用前面所有业务表

#### Phase 7 额外说明

- `overview` 看板尽量由聚合查询生成
- 不建议先单独做一张“后台统计写死表”
- 指标应该从订单、商品、售后、反馈数据汇总得出

#### Phase 7 完成标志

- 管理后台总览、商品、订单、售后、反馈全部切真实数据

### Phase 8：聊天与 AI

#### Phase 8 原因

它重要，但不会卡住交易主链路，可以放在后面。

#### Phase 8 优先接口

1. `POST /api/chat/sessions`
2. `POST /api/chat/messages`
3. `GET /api/chat/history`

#### Phase 8 数据表

- `chat_sessions`
- `chat_messages`

#### Phase 8 完成标志

- 聊天会话和消息可持久化
- AI 回复可先保留 mock，再逐步接入真实模型

## 六、每个模块的固定开发模板

为了避免后端越写越乱，建议每个模块都严格按同一模板推进。

### 模板步骤

1. 写模块接口文档
2. 设计表结构
3. 写 migration
4. 写 seed
5. 写 repository
6. 写 service
7. 写 controller
8. 写 route
9. 写 validator
10. 前端联调
11. 关闭该模块的 mock

### 这样做的好处

- 问题定位更简单
- 每个模块都可独立完成验收
- 不会出现“前端能跑，但接口层和数据库层不一致”的问题

## 七、实际推荐开工顺序

如果现在立刻开始做，我建议按下面顺序执行：

1. `Phase 0` 冻结接口契约
2. `Phase 1` 搭 MySQL 与 migration 体系
3. `Phase 2` Auth + User
4. `Phase 3` Product + Search
5. `Phase 4` Address + Cart
6. `Phase 5` Order
7. `Phase 6` After-sale + Feedback
8. `Phase 7` Admin
9. `Phase 8` Chat

## 八、阶段验收标准

### 第 1 轮验收

- 用户可以真实登录
- 个人资料能从数据库读写

### 第 2 轮验收

- 首页、搜索页、详情页全部走真实商品接口

### 第 3 轮验收

- 地址、购物车、下单、订单走真实接口

### 第 4 轮验收

- 售后和反馈走真实接口

### 第 5 轮验收

- 后台所有模块走真实数据

### 第 6 轮验收

- AI 聊天会话持久化

## 九、当前最值得优先补的 5 个真实后端缺口

在正式开工时，最优先处理这 5 个问题：

1. 数据层从 `mockDb` 切到 `MySQL`
2. 登录从演示态切到真实用户数据读取
3. 商品与搜索走统一真实查询接口
4. 订单创建改为真实事务写库
5. 前端逐模块关闭 mock，进入真实联调

## 十、最后建议

当前项目最合理的推进方式不是“继续补页面”，而是：

- 前端保持稳定
- 后端按模块逐步落地
- 数据先入库
- 接口一批一批替换 mock

只有这样，项目才会从“设计稿驱动的前端演示工程”，真正升级成“可运行、可维护、可扩展的全栈系统”。
