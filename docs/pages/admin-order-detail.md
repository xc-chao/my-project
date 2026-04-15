# 订单详情页

## 页面目标

供管理员查看单个订单的金额、商品明细、物流信息、时间线与关联售后记录，并在详情页内推进订单流转。

## 入口与出口

- 入口：后台 `订单处理` 页的 `查看详情` 按钮。
- 出口：订单处理页、售后审批页。

## 权限规则

- 仅 `admin` 身份可访问。
- 普通用户不显示入口，接口层也必须校验管理员身份。

## 主要区域

- 订单概览头部。
- 订单汇总卡片。
- 商品明细区。
- 物流信息区。
- 订单时间线区。
- 关联售后区。

## 交互说明

- 点击顶部主操作，可推进订单状态。
- 发货前需要先录入物流单号。
- 点击 `保存物流信息`，更新承运商和物流单号。
- 点击 `售后审批页`，跳转到当前订单的售后审批列表。
- 在关联售后区中，可直接通过或驳回待审核售后记录。

## 字段/状态说明

- `order`：当前订单详情。
- `order.logistics`：物流信息。
- `order.timeline`：订单时间线。
- `relatedAfterSales`：当前订单关联售后记录。
- `order.status`：订单状态。

## 对应接口

- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`
- `PATCH /api/admin/orders/:id/logistics`
- `GET /api/admin/after-sales?orderId=`
- `PATCH /api/admin/after-sales/:id/status`
