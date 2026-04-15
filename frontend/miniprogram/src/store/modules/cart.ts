import { defineStore } from 'pinia';
import {
  addCartItem,
  deleteCartItem,
  getCart,
  updateCartItem,
  type CartProductBrief
} from '../../services/cartService';

interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  product?: CartProductBrief;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: [] as CartLine[],
    totalCount: 0,
    totalAmount: 0,
    loading: false
  }),
  actions: {
    async fetchCart() {
      this.loading = true;

      try {
        const result = await getCart();
        this.list = result.list;
        this.totalCount = result.totalCount;
        this.totalAmount = result.totalAmount;
      } finally {
        this.loading = false;
      }
    },
    async add(payload: { productId: string; quantity: number; size: string }) {
      const result = await addCartItem(payload);
      this.list = result.list;
      this.totalCount = result.totalCount;
      this.totalAmount = result.totalAmount;
    },
    async changeQuantity(id: string, quantity: number) {
      const safeQuantity = Math.max(1, quantity);
      const result = await updateCartItem(id, safeQuantity);
      this.list = result.list;
      this.totalCount = result.totalCount;
      this.totalAmount = result.totalAmount;
    },
    async remove(id: string) {
      const result = await deleteCartItem(id);
      this.list = result.list;
      this.totalCount = result.totalCount;
      this.totalAmount = result.totalAmount;
    }
  }
});
