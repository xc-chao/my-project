import { adminRepository } from './admin.repository.js';
import { AppError } from '../../common/errors/AppError.js';

export const adminService = {
  getOverview() {
    return adminRepository.getOverview();
  },
  listProducts() {
    return adminRepository.listProducts();
  },
  listOrders() {
    return adminRepository.listOrders();
  },
  listFeedback() {
    return adminRepository.listFeedback();
  },
  updateProduct(id, payload) {
    const product = adminRepository.updateProduct(id, payload);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return product;
  },
  updateOrderStatus(id, status) {
    const order = adminRepository.updateOrderStatus(id, status);

    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return order;
  },
  updateFeedbackStatus(id, status) {
    const feedback = adminRepository.updateFeedbackStatus(id, status);

    if (!feedback) {
      throw new AppError(404, 'FEEDBACK_NOT_FOUND', '反馈不存在');
    }

    return feedback;
  }
};
