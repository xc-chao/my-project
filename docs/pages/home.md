# 首页

## 页面目标
展示首页 banner、分类入口、热销商品和 AI 导购入口，承担浏览和分发职责。

## 入口与出口
- 入口：`tabBar` 首页。
- 出口：搜索页、商品详情页、AI 聊天页。

## 主要区域
- 顶部品牌文案与搜索框。
- 本地化 banner 视觉区。
- 分类筛选胶囊。
- 热销商品列表。
- 右下悬浮 AI 按钮。

## 交互说明
- 点击搜索框跳转 `pages/search/index`。
- 点击分类切换当前商品列表。
- 点击商品卡跳转 `pages/product/detail`。
- 点击悬浮按钮进入 `pages/chat/index`。

## 字段/状态说明
- `products`：商品列表。
- `categories`：分类列表。
- `currentCategory`：当前筛选分类。

## 对应接口
- `GET /products`
- `GET /categories`

## 对应 Pencil 页面
- `CreatPencil.pen` 首页画板。
