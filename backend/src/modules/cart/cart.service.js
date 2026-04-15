import { AppError } from '../../common/errors/AppError.js';
import { cartRepository } from './cart.repository.js';

export const cartService = {
  async getCart(userId) {
    return cartRepository.getCart(userId);
  },
  async addItem(userId, payload) {
    const result = await cartRepository.addItem(userId, payload);

    if (!result) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    return result;
  },
  async updateItem(userId, id, quantity) {
    const result = await cartRepository.updateItem(userId, id, quantity);

    if (!result) {
      throw new AppError(404, 'CART_ITEM_NOT_FOUND', '购物车商品不存在');
    }

    return result;
  },
  async removeItem(userId, id) {
    const result = await cartRepository.removeItem(userId, id);

    if (!result) {
      throw new AppError(404, 'CART_ITEM_NOT_FOUND', '购物车商品不存在');
    }

    return result;
  }
};
