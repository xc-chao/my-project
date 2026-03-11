import { mockDb } from '../../data/mockDb.js';

export const afterSaleService = {
  list(userId) {
    return mockDb.afterSales.filter((item) => item.userId === userId);
  },
  create(userId, payload) {
    const created = {
      id: `after_${Date.now()}`,
      userId,
      orderId: payload.orderId,
      productTitle: payload.productTitle,
      reason: payload.reason,
      status: 'submitted'
    };

    mockDb.afterSales.unshift(created);
    return created;
  }
};
