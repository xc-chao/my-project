import { mockDb } from '../../data/mockDb.js';

function enrichOrder(order) {
  return {
    ...order,
    items: order.items.map((item) => {
      return {
        ...item,
        product: mockDb.products.find((product) => product.id === item.productId)
      };
    })
  };
}

export const orderService = {
  getPreview(userId) {
    const address = mockDb.addresses.find((item) => item.userId === userId && item.isDefault);
    const items = mockDb.cartItems.map((item) => {
      return {
        ...item,
        product: mockDb.products.find((product) => product.id === item.productId)
      };
    });
    const goodsAmount = items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
    const shippingFee = items.length ? 12 : 0;
    const discountAmount = items.length ? 20 : 0;

    return {
      address,
      items,
      summary: {
        goodsAmount,
        shippingFee,
        discountAmount,
        payableAmount: Math.max(goodsAmount + shippingFee - discountAmount, 0)
      }
    };
  },
  createOrder(userId, payload = {}) {
    const preview = this.getPreview(userId);
    const order = {
      id: `order_${Date.now()}`,
      userId,
      status: 'pending_payment',
      items: [...mockDb.cartItems],
      amount: preview.summary.payableAmount,
      addressId: payload.addressId || preview.address?.id || '',
      remark: payload.remark || '',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
    };

    mockDb.orders.unshift(order);
    mockDb.cartItems.splice(0, mockDb.cartItems.length);
    return order;
  },
  listOrders(userId) {
    return mockDb.orders.filter((item) => item.userId === userId).map(enrichOrder);
  },
  getOrderDetail(id, userId) {
    const order = mockDb.orders.find((item) => item.id === id && item.userId === userId) || null;
    return order ? enrichOrder(order) : null;
  }
};
