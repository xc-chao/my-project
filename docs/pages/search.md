# 搜索页

## 页面目标

承接首页搜索入口，按关键词、排序和筛选条件展示匹配商品，并提供空状态反馈。

## 入口与出口

- 入口：首页搜索框、首页“查看全部”。
- 出口：商品详情页、首页。

## 主要区域

- 顶部返回和标题。
- 搜索输入栏。
- 排序栏。
- 筛选栏。
- 结果统计栏。
- 商品结果列表或空状态卡片。

## 交互说明

- 输入关键词后确认搜索。
- 点击 `综合` 切换默认排序。
- 点击 `价格` 在升序和降序间切换。
- 点击 `筛选` 弹出筛选项菜单，可切换到 `48h 上新`、`买手好评`、`仅看在售`、分类筛选。
- 修改排序或筛选项后重新请求结果列表。
- 点击商品卡进入详情。
- 无结果时可返回首页。

## 字段/状态说明

- `keyword`：当前搜索词。
- `list`：搜索结果列表。
- `loading`：加载状态。
- `currentSort`：当前排序值。
- `filters`：当前筛选条件。
- `page / pageSize`：分页参数。
- `total`：结果总数。

## 建议状态模型

- `sort = comprehensive | priceAsc | priceDesc | hot`
- `scene = newIn48h | buyerFavorite`
- `category`
- `onSaleOnly`
- `isNewIn48h`
- `minPrice / maxPrice`
- `page / pageSize`

## 推荐实现方式

- 排序和筛选统一进入 `loadSearch()` 的 query 参数。
- 任一排序或筛选条件变化后，将 `page` 重置为 `1`。
- 页面不要只切换 pill 高亮，必须触发真实数据刷新。
- 搜索结果统计应展示当前关键词、当前筛选结果总数。

## 对应接口

- `GET /products?keyword=&sort=&page=&pageSize=`
- `GET /products`

## 接口落地备注

建议搜索页最终只依赖一个统一入口：

- `GET /api/products`

由 query 参数承载：

- 关键词
- 排序
- 分类
- 价格区间
- 是否 48h 上新
- 分页

## 对应 Pencil 页面

- `CreatPencil.pen` 搜索结果页。
