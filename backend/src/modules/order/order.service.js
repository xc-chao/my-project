import { AppError } from '../../common/errors/AppError.js';
import { orderRepository } from './order.repository.js';

export const orderService = {
  async getPreview(userId) {
    return orderRepository.getPreview(userId);
  },
  async createOrder(userId, payload = {}) {
    const preview = await orderRepository.getPreview(userId);

    if (!preview.items.length) {
      throw new AppError(400, 'ORDER_EMPTY', '当前没有待结算商品');
    }

    const order = await orderRepository.createOrder(userId, payload);

    if (!order) {
      throw new AppError(500, 'ORDER_CREATE_FAILED', '订单创建失败');
    }

    return order;
  },
  async listOrders(userId) {
    return orderRepository.listOrders(userId);
  },
  async getOrderDetail(id, userId) {
    return orderRepository.getOrderDetail(id, userId);
  }
};
