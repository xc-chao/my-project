import { mockDb } from '../../data/mockDb.js';
import { AppError } from '../../common/errors/AppError.js';

function enrichCartItems() {
  return mockDb.cartItems.map((item) => {
    const product = mockDb.products.find((productItem) => productItem.id === item.productId);

    return {
      ...item,
      product
    };
  });
}

export const cartService = {
  getCart() {
    const list = enrichCartItems();
    const totalCount = list.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = list.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

    return {
      list,
      totalCount,
      totalAmount
    };
  },
  addItem(payload) {
    const product = mockDb.products.find((item) => item.id === payload.productId);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '商品不存在');
    }

    const existing = mockDb.cartItems.find(
      (item) => item.productId === payload.productId && item.size === payload.size
    );

    if (existing) {
      existing.quantity += payload.quantity;
      return this.getCart();
    }

    mockDb.cartItems.push({
      id: `cart_${Date.now()}`,
      productId: payload.productId,
      quantity: payload.quantity,
      size: payload.size,
      checked: true
    });

    return this.getCart();
  },
  updateItem(id, quantity) {
    const target = mockDb.cartItems.find((item) => item.id === id);

    if (!target) {
      throw new AppError(404, 'CART_ITEM_NOT_FOUND', '购物车商品不存在');
    }

    target.quantity = quantity;
    return this.getCart();
  },
  removeItem(id) {
    const index = mockDb.cartItems.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new AppError(404, 'CART_ITEM_NOT_FOUND', '购物车商品不存在');
    }

    mockDb.cartItems.splice(index, 1);
    return this.getCart();
  }
};
