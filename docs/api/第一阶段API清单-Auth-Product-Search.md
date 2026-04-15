# 第一阶段 API 清单（Auth + Product + Search）

## 文档目标

这份文档用于把第一阶段真正要开发的接口明确下来。

第一阶段只覆盖 3 个模块：

- `Auth`
- `Product`
- `Search`

原因是它们直接支撑当前最核心的前端页面：

- 登录页
- 个人资料页
- 首页
- 搜索页
- 商品详情页
- 后台商品管理页

## 一、第一阶段范围

### 1. 必须完成的能力

- 用户登录
- 获取用户资料
- 修改用户资料
- 退出登录
- 商品列表
- 商品详情
- 商品分类
- 搜索、排序、筛选联动

### 2. 可暂缓的能力

- 真实短信通道接入
- 真正的微信开放平台鉴权
- 支付
- 订单
- 售后
- AI 真实模型接入

## 二、统一接口约定

### 1. 接口前缀

统一使用：

- `/api`

### 2. 成功响应结构

```json
{
  "success": true,
  "message": "ok",
  "data": {}
}
```

### 3. 失败响应结构

```json
{
  "success": false,
  "message": "参数错误",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

### 4. 鉴权方式

需要登录的接口统一使用：

- `Authorization: Bearer <token>`

### 5. 第一阶段建议错误码

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `INVALID_TOKEN`
- `FORBIDDEN`
- `USER_NOT_FOUND`
- `PRODUCT_NOT_FOUND`

## 三、前端页面映射

本阶段接口主要服务以下页面：

| 页面 | 依赖接口 |
| --- | --- |
| `pages/auth/login` | `POST /api/auth/wechat-login`、`POST /api/auth/sms-code`、`POST /api/auth/sms-login` |
| `pages/profile/account` | `GET /api/auth/profile`、`PATCH /api/auth/profile`、`POST /api/auth/logout` |
| `pages/home/index` | `GET /api/products` |
| `pages/search/index` | `GET /api/products`、`GET /api/categories` |
| `pages/product/detail` | `GET /api/products/:id` |
| `pages/admin/products` | `GET /api/products`、后续管理端接口 |

## 四、Auth 模块接口

### Auth-01：微信登录

#### Auth-01 接口

- `POST /api/auth/wechat-login`

#### Auth-01 用途

- 登录页普通用户登录
- 登录页管理员演示登录

#### Auth-01 请求体

```json
{
  "code": "wx_login_code",
  "nickname": "校园买手",
  "identity": "user"
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `code` | `string` | 是 | 微信登录 code |
| `nickname` | `string` | 否 | 用户昵称，首次登录可写入 |
| `identity` | `user \| admin` | 否 | 当前项目用于演示身份切换 |

#### Auth-01 成功响应

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "u_001",
      "nickname": "校园买手",
      "phone": "13800000000",
      "avatar": "https://example.com/avatar.jpg",
      "role": "user"
    },
    "accessToken": "jwt_token",
    "session": {
      "expiresIn": "7d"
    }
  }
}
```

#### Auth-01 校验规则

- `code` 不能为空
- `nickname` 最长建议 20 到 50 字符
- `identity` 只允许 `user` 或 `admin`

#### Auth-01 数据层动作

1. 根据登录方式查找用户
2. 不存在则创建用户
3. 若传入昵称则更新昵称
4. 生成 JWT
5. 返回用户资料与 token

### Auth-02：发送短信验证码

#### Auth-02 接口

- `POST /api/auth/sms-code`

#### Auth-02 用途

- 为后续手机号验证码登录预留

#### Auth-02 请求体

```json
{
  "phone": "13800000000"
}
```

#### Auth-02 成功响应

```json
{
  "success": true,
  "message": "验证码已发送",
  "data": {
    "phone": "13800000000",
    "codeSent": true
  }
}
```

#### Auth-02 备注

- 第一阶段可以先做占位实现
- 第二阶段再接真实短信服务商

### Auth-03：短信验证码登录

#### Auth-03 接口

- `POST /api/auth/sms-login`

#### Auth-03 请求体

```json
{
  "phone": "13800000000",
  "code": "123456",
  "identity": "user"
}
```

#### Auth-03 成功响应

与 `POST /api/auth/wechat-login` 返回结构保持一致。

### Auth-04：获取当前用户资料

#### Auth-04 接口

- `GET /api/auth/profile`

#### Auth-04 用途

- 个人信息管理页加载
- 登录后刷新当前资料

#### Auth-04 成功响应

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "id": "u_001",
    "nickname": "校园买手",
    "phone": "13800000000",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user"
  }
}
```

#### Auth-04 校验要求

- 必须带有效 token

### Auth-05：更新当前用户资料

#### Auth-05 接口

- `PATCH /api/auth/profile`

#### Auth-05 用途

- 个人资料页修改昵称
- 修改头像
- 当前项目演示环境下切换身份

#### Auth-05 请求体

```json
{
  "nickname": "校园买手 Pro",
  "avatar": "https://example.com/avatar-new.jpg",
  "role": "admin"
}
```

#### Auth-05 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `nickname` | `string` | 否 | 新昵称 |
| `avatar` | `string` | 否 | 新头像地址 |
| `role` | `user \| admin` | 否 | 当前项目演示身份切换 |

#### Auth-05 成功响应

建议与登录接口保持一致，便于前端直接刷新会话：

```json
{
  "success": true,
  "message": "资料已更新",
  "data": {
    "user": {
      "id": "u_admin_001",
      "nickname": "系统管理员",
      "phone": "13900000000",
      "avatar": "https://example.com/avatar-admin.jpg",
      "role": "admin"
    },
    "accessToken": "jwt_token",
    "session": {
      "expiresIn": "7d"
    }
  }
}
```

### Auth-06：退出登录

#### Auth-06 接口

- `POST /api/auth/logout`

#### Auth-06 用途

- 个人资料页退出登录

#### Auth-06 成功响应

```json
{
  "success": true,
  "message": "已退出登录",
  "data": {}
}
```

## 五、Product + Search 模块接口

### Product-01：商品列表统一入口

#### Product-01 接口

- `GET /api/products`

#### Product-01 说明

这个接口既服务：

- 首页商品列表
- 搜索页结果列表
- 首页指标联动跳转后的搜索结果

不建议长期保留“单独 `/api/search` 再走一套逻辑”的方式。

#### Product-01 Query 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `keyword` | `string` | 否 | 搜索关键词 |
| `sort` | `string` | 否 | `comprehensive \| priceAsc \| priceDesc \| hot` |
| `scene` | `string` | 否 | `newIn48h \| buyerFavorite` |
| `category` | `string` | 否 | 分类筛选 |
| `onSaleOnly` | `boolean` | 否 | 仅看在售 |
| `page` | `number` | 否 | 页码，默认 `1` |
| `pageSize` | `number` | 否 | 每页数量，默认 `20` |

#### Product-01 示例请求

- `GET /api/products`
- `GET /api/products?keyword=jordan`
- `GET /api/products?sort=priceAsc`
- `GET /api/products?scene=newIn48h`
- `GET /api/products?category=鞋靴&onSaleOnly=1`

#### Product-01 成功响应

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": "p_001",
        "title": "Nike Air Jordan 1 Low",
        "subtitle": "黑白低帮",
        "price": 1899,
        "originalPrice": 2199,
        "stock": 36,
        "sales": 2300,
        "category": "鞋靴",
        "cover": "https://example.com/p001-cover.jpg",
        "badges": ["热门上新"],
        "sizes": ["39", "40", "41", "42", "43"],
        "detail": "经典低帮轮廓，适合通勤与日常穿搭。",
        "saleStatus": "on_sale"
      }
    ],
    "categories": ["推荐", "鞋靴", "服饰", "配件"],
    "page": 1,
    "pageSize": 20,
    "total": 50
  }
}
```

#### Product-01 查询行为要求

1. 先做关键词过滤
2. 再做营销场景过滤
3. 再做分类/在售过滤
4. 最后做排序
5. 最后做分页

#### Product-01 当前前端筛选语义

- `scene = newIn48h`：承接首页 `48h 限定上新`
- `scene = buyerFavorite`：承接首页 `95% 买手好评`
- `sort = comprehensive`：综合
- `sort = priceAsc / priceDesc`：价格升降序
- `sort = hot`：热门排序

### Product-02：商品详情

#### Product-02 接口

- `GET /api/products/:id`

#### Product-02 用途

- 商品详情页
- 订单商品点击跳转详情
- 管理端商品卡跳转前台详情

#### Product-02 路径参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | ---: | --- |
| `id` | `string` | 是 | 商品 id |

#### Product-02 成功响应建议

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "id": "p_001",
    "title": "Nike Air Jordan 1 Low",
    "subtitle": "黑白低帮",
    "price": 1899,
    "originalPrice": 2199,
    "stock": 36,
    "sales": 2300,
    "category": "鞋靴",
    "cover": "https://example.com/p001-cover.jpg",
    "gallery": [
      "https://example.com/p001-1.jpg",
      "https://example.com/p001-2.jpg",
      "https://example.com/p001-3.jpg"
    ],
    "badges": ["热门上新"],
    "sizes": ["39", "40", "41", "42", "43"],
    "detail": "经典低帮轮廓，适合通勤与日常穿搭。",
    "saleStatus": "on_sale",
    "marketing": {
      "isNewIn48h": true,
      "praiseRate": 95
    },
    "serviceTags": ["48h 上新", "95% 好评", "7天无理由"],
    "shipping": {
      "shipWithinHours": 48
    }
  }
}
```

#### Product-02 字段设计原因

因为当前项目已经明确要求：

- 首页 `48h 上新`
- 首页 `95% 好评`

要能在详情页找到结构化承接，而不是继续写死文案。

### Product-03：商品分类

#### Product-03 接口

- `GET /api/categories`

#### Product-03 用途

- 搜索页分类筛选
- 后续后台商品筛选

#### Product-03 成功响应

```json
{
  "success": true,
  "message": "ok",
  "data": ["推荐", "鞋靴", "服饰", "配件"]
}
```

### Product-04：兼容搜索接口

#### Product-04 接口

- `GET /api/search`

#### Product-04 说明

当前代码里仍存在这个路径，但建议只作为过渡兼容接口。

推荐做法：

- 内部复用 `GET /api/products` 的查询逻辑
- 前端后续逐步收敛到统一走 `GET /api/products`

## 六、第一阶段数据库映射

本阶段至少需要这些表：

- `users`
- `products`
- `product_galleries`

其中：

- `Auth` 主要依赖 `users`
- `Product/Search` 主要依赖 `products + product_galleries`

## 七、第一阶段开发顺序

建议实际编码顺序如下：

1. 建 `users`
2. 建 `products`
3. 建 `product_galleries`
4. 写 `auth.repository`
5. 写 `auth.service`
6. 写 `auth.controller + routes + validator`
7. 写 `product.repository`
8. 写 `product.service`
9. 写 `product.controller + routes`
10. 前端先切 `Auth`
11. 前端再切 `Product + Search`

## 八、第一阶段联调顺序

### 第一步：先切 Auth

先让这些页面切到真实接口：

- `pages/auth/login`
- `pages/profile/account`

### 第二步：再切 Product

再让这些页面切到真实接口：

- `pages/home/index`
- `pages/search/index`
- `pages/product/detail`

### 第三步：最后关掉对应 mock

关掉以下 mock 依赖：

- 前端 `mock/handlers` 中的 auth 逻辑
- 前端 `mock/handlers` 中的 products / search 逻辑
- 后端 `mockDb` 中的同模块内存查询依赖

## 九、第一阶段验收标准

### Auth 验收

- 登录页可返回真实 token
- 资料页能读取真实用户数据
- 修改头像、昵称、演示身份可写入数据库
- 退出登录后前端状态正确清理

### Product/Search 验收

- 首页商品来自真实数据库
- 搜索页 `综合`、`价格`、`筛选` 都走真实查询
- 首页 `48h 上新`、`95% 买手好评` 跳转搜索页可联动真实结果
- 商品详情页图集和营销字段可由真实接口返回

## 十、开始编码前最后确认项

正式进入第一阶段编码前，请先确认：

1. MySQL 已可连接
2. migration 工具已准备
3. `.env` 中数据库配置可用
4. 前端允许按模块关闭 mock
5. 当前字段命名已冻结，不再临时改来改去

确认这 5 件事后，就可以直接开始第一阶段后端编码。
