# 反馈与看板页

## 页面目标

供管理员统一查看用户反馈、处理状态，并结合趋势图、热销排行图表与 Agent 调用数据做后台运营判断。

## 入口与出口

- 入口：后台信息管理页中的 `用户反馈与数据看板` 卡片。
- 出口：后台信息管理页。

## 权限规则

- 仅 `admin` 身份可访问。
- 普通用户不显示入口，接口层必须拦截未授权请求。

## 主要区域

- 页面说明头部。
- 汇总卡片：反馈总数、待跟进、已处理。
- 趋势周期切换：支持 `近 7 天 / 近 30 天`。
- Agent 监控卡片与调用趋势图。
- 订单趋势图。
- 反馈处理趋势图。
- 热销商品排行图表。
- 分类销量排行。
- 售后原因排行。
- 反馈筛选栏与反馈列表。

## 交互说明

- 点击 `标记已处理`，将反馈状态切换为已处理。
- 点击 `重新打开`，将已处理反馈恢复为待跟进。
- 切换筛选项后，只查看对应状态的反馈。
- 切换趋势周期后，订单趋势、反馈处理趋势、Agent 调用趋势同步切换。

## 字段/状态说明

- `feedbacks`：反馈列表。
- `overview.monitor`：Agent 调用监控。
- `overview.charts.orderTrend.7d / 30d`：订单趋势。
- `overview.charts.agentTrend.7d / 30d`：Agent 调用趋势。
- `overview.rankings.categorySales`：分类销量排行。
- `overview.rankings.afterSaleReasons`：售后原因排行。
- `overview.hotProducts`：热销商品排行。
- `currentFilter`：反馈筛选项。

## 对应接口

- `GET /api/admin/overview`
- `GET /api/admin/feedback`
- `PATCH /api/admin/feedback/:id/status`
