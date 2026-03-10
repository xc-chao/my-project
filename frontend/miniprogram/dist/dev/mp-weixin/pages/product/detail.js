"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_cart = require("../../store/modules/cart.js");
if (!Math) {
  AppHeader();
}
const AppHeader = () => "../../components/AppHeader.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  setup(__props) {
    const product = common_vendor.ref(null);
    const selectedSize = common_vendor.ref("");
    const quantity = common_vendor.ref(1);
    const loading = common_vendor.ref(false);
    const cartStore = store_modules_cart.useCartStore();
    const userStore = store_modules_user.useUserStore();
    const totalPrice = common_vendor.computed(() => {
      var _a;
      return (((_a = product.value) == null ? void 0 : _a.price) || 0) * quantity.value;
    });
    async function loadDetail(id) {
      loading.value = true;
      try {
        const result = await services_productService.getProductDetail(id);
        if (result) {
          product.value = result;
          selectedSize.value = result.sizes[0];
        }
      } finally {
        loading.value = false;
      }
    }
    async function handleAddToCart() {
      if (!product.value) {
        return;
      }
      if (!userStore.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
        return;
      }
      await cartStore.add({
        productId: product.value.id,
        quantity: quantity.value,
        size: selectedSize.value
      });
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success"
      });
    }
    function handleBuyNow() {
      handleAddToCart().then(() => {
        common_vendor.index.switchTab({
          url: "/pages/cart/index"
        });
      });
    }
    common_vendor.onLoad((query) => {
      const productId = query == null ? void 0 : query.id;
      if (typeof productId === "string") {
        loadDetail(productId);
      }
    });
    function openChat() {
      if (!product.value) {
        return;
      }
      if (!userStore.isLoggedIn) {
        common_vendor.index.navigateTo({
          url: "/pages/auth/login"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/chat/index?productId=${product.value.id}&title=${encodeURIComponent(product.value.title)}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "商品详情",
          back: true,
          ["dark-action"]: "AI",
          ["action-path"]: product.value ? `/pages/chat/index?productId=${product.value.id}&title=${encodeURIComponent(product.value.title)}` : ""
        }),
        b: product.value
      }, product.value ? {
        c: product.value.cover,
        d: common_vendor.t(product.value.title),
        e: common_vendor.t(product.value.subtitle),
        f: common_vendor.t(product.value.price),
        g: common_vendor.t(product.value.originalPrice),
        h: common_vendor.t(product.value.stock),
        i: common_vendor.f(product.value.sizes, (size, k0, i0) => {
          return {
            a: common_vendor.t(size),
            b: size,
            c: common_vendor.n({
              active: selectedSize.value === size
            }),
            d: common_vendor.o(($event) => selectedSize.value = size, size)
          };
        }),
        j: common_vendor.t(product.value.detail),
        k: common_vendor.t(product.value.sales),
        l: common_vendor.o(openChat),
        m: common_vendor.o(($event) => quantity.value = Math.max(1, quantity.value - 1)),
        n: common_vendor.t(quantity.value),
        o: common_vendor.o(($event) => quantity.value = quantity.value + 1)
      } : {}, {
        p: product.value
      }, product.value ? {
        q: common_vendor.t(totalPrice.value),
        r: common_vendor.o(handleAddToCart),
        s: common_vendor.o(handleBuyNow)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8216645a"]]);
wx.createPage(MiniProgramPage);
