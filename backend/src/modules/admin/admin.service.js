import { adminRepository } from './admin.repository.db.js';
import { AppError } from '../../common/errors/AppError.js';

export const adminService = {
  async getOverview() {
    return adminRepository.getOverview();
  },
  async listProducts() {
    return adminRepository.listProducts();
  },
  async getProductDetail(id) {
    const product = await adminRepository.getProductDetail(id);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return product;
  },
  async createProduct(payload) {
    return adminRepository.createProduct(payload);
  },
  async listOrders() {
    return adminRepository.listOrders();
  },
  async getOrderDetail(id) {
    const order = await adminRepository.getOrderDetail(id);

    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return order;
  },
  async listAfterSales(orderId) {
    return adminRepository.listAfterSales(orderId);
  },
  async listFeedback() {
    return adminRepository.listFeedback();
  },
  async updateProduct(id, payload) {
    const product = await adminRepository.updateProduct(id, payload);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return product;
  },
  async updateOrderStatus(id, status) {
    const order = await adminRepository.updateOrderStatus(id, status);

    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return order;
  },
  async updateOrderLogistics(id, payload) {
    const order = await adminRepository.updateOrderLogistics(id, payload);

    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return order;
  },
  async updateAfterSaleStatus(id, status) {
    const afterSale = await adminRepository.updateAfterSaleStatus(id, status);

    if (!afterSale) {
      throw new AppError(404, 'AFTER_SALE_NOT_FOUND', '售后记录不存在');
    }

    return afterSale;
  },
  async updateFeedbackStatus(id, status) {
    const feedback = await adminRepository.updateFeedbackStatus(id, status);

    if (!feedback) {
      throw new AppError(404, 'FEEDBACK_NOT_FOUND', '反馈不存在');
    }

    return feedback;
  }
};
