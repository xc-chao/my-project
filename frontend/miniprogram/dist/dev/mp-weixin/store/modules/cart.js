"use strict";
const common_vendor = require("../../common/vendor.js");
const services_cartService = require("../../services/cartService.js");
const useCartStore = common_vendor.defineStore("cart", {
  state: () => ({
    list: [],
    totalCount: 0,
    totalAmount: 0,
    loading: false
  }),
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const result = await services_cartService.getCart();
        this.list = result.list;
        this.totalCount = result.totalCount;
        this.totalAmount = result.totalAmount;
      } finally {
        this.loading = false;
      }
    },
    async add(payload) {
      const result = await services_cartService.addCartItem(payload);
      this.list = result.list;
      this.totalCount = result.totalCount;
      this.totalAmount = result.totalAmount;
    },
    async changeQuantity(id, quantity) {
      const safeQuantity = Math.max(1, quantity);
      const result = await services_cartService.updateCartItem(id, safeQuantity);
      this.list = result.list;
      this.totalCount = result.totalCount;
      this.totalAmount = result.totalAmount;
    },
    async remove(id) {
      const result = await services_cartService.deleteCartItem(id);
      this.list = result.list;
      this.totalCount = result.totalCount;
      this.totalAmount = result.totalAmount;
    }
  }
});
exports.useCartStore = useCartStore;
