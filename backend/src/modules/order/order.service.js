import { mockDb } from '../../data/mockDb.js';

export const orderService = {
  createOrder(userId) {
    const order = {
      id: `order_${Date.now()}`,
      userId,
      status: 'pending_payment',
      items: [...mockDb.cartItems],
      createdAt: new Date().toISOString()
    };

    mockDb.orders.unshift(order);
    return order;
  },
  listOrders(userId) {
    return mockDb.orders.filter((item) => item.userId === userId);
  },
  getOrderDetail(id, userId) {
    return mockDb.orders.find((item) => item.id === id && item.userId === userId) || null;
  }
};
