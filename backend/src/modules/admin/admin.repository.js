import { mockDb } from '../../data/mockDb.js';

export const adminRepository = {
  getOverview() {
    const hotProducts = mockDb.products
      .slice()
      .sort((left, right) => right.sales - left.sales)
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        sales: item.sales,
        stock: item.stock
      }));
    const lowStockCount = mockDb.products.filter((item) => item.stock <= 20).length;
    const pendingFeedbackCount = mockDb.feedbacks.filter((item) => item.status === 'pending').length;

    return {
      metrics: [
        {
          label: '日订单',
          value: String(mockDb.adminDashboard.dailyOrders),
          hint: '较昨日 +12%'
        },
        {
          label: '待处理售后',
          value: String(mockDb.adminDashboard.pendingAfterSales),
          hint: '优先跟进异常订单',
          accent: 'danger'
        },
        {
          label: '在售商品',
          value: String(mockDb.products.length),
          hint: '含球鞋、服饰与配件'
        },
        {
          label: '待看反馈',
          value: String(pendingFeedbackCount),
          hint: '含评价与体验建议'
        }
      ],
      modules: [
        {
          key: 'product',
          title: '商品管理',
          desc: '新增商品、上下架、库存维护、图片与富文本描述。',
          value: `${mockDb.products.length} 款在列`,
          hint: `${lowStockCount} 款低库存商品待关注`
        },
        {
          key: 'order',
          title: '订单处理',
          desc: '发货审核、订单状态流转、售后审批与日志记录。',
          value: '18 单待流转',
          hint: `含 ${mockDb.adminDashboard.pendingAfterSales} 条售后待处理`
        },
        {
          key: 'feedback',
          title: '用户反馈与数据看板',
          desc: '用户反馈查看、热销商品排行、订单趋势与 Agent 调用监控。',
          value: '3 个重点看板',
          hint: `今日 Agent 调用 ${mockDb.adminDashboard.agentCalls} 次`
        }
      ],
      hotProducts,
      feedbacks: mockDb.feedbacks,
      monitor: {
        todayCalls: mockDb.adminDashboard.agentCalls,
        fallbackCount: mockDb.adminDashboard.fallbackCount,
        successRate: mockDb.adminDashboard.successRate,
        avgLatencyMs: mockDb.adminDashboard.avgLatencyMs
      }
    };
  },
  listProducts() {
    return mockDb.products;
  },
  listOrders() {
    return mockDb.orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: mockDb.products.find((product) => product.id === item.productId)
      }))
    }));
  },
  listFeedback() {
    return mockDb.feedbacks;
  },
  updateProduct(id, payload) {
    const target = mockDb.products.find((item) => item.id === id);

    if (!target) {
      return null;
    }

    if (typeof payload.saleStatus === 'string') {
      target.saleStatus = payload.saleStatus;
    }

    if (typeof payload.stock === 'number') {
      target.stock = payload.stock;
    }

    if (typeof payload.price === 'number') {
      target.price = payload.price;
    }

    return target;
  },
  updateOrderStatus(id, status) {
    const target = mockDb.orders.find((item) => item.id === id);

    if (!target) {
      return null;
    }

    target.status = status;

    return {
      ...target,
      items: target.items.map((item) => ({
        ...item,
        product: mockDb.products.find((product) => product.id === item.productId)
      }))
    };
  },
  updateFeedbackStatus(id, status) {
    const target = mockDb.feedbacks.find((item) => item.id === id);

    if (!target) {
      return null;
    }

    target.status = status;
    return target;
  }
};
