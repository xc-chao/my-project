import { AppError } from '../../common/errors/AppError.js';
import { afterSaleRepository } from './afterSale.repository.js';

export const afterSaleService = {
  async list(userId) {
    return afterSaleRepository.listByUserId(userId);
  },
  async create(userId, payload) {
    const result = await afterSaleRepository.create(userId, payload);

    if (!result) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return result;
  }
};
