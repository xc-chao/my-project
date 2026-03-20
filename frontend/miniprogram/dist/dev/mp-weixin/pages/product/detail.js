"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_cart = require("../../store/modules/cart.js");
if (!Math) {
  (AppHeader + QuantityStepper)();
}
const AppHeader = () => "../../components/AppHeader.js";
const QuantityStepper = () => "../../components/common/QuantityStepper.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  setup(__props) {
    const product = common_vendor.ref(null);
    const selectedSize = common_vendor.ref("");
    const quantity = common_vendor.ref(1);
    const loading = common_vendor.ref(false);
    const previewImage = common_vendor.ref("");
    const cartStore = store_modules_cart.useCartStore();
    const userStore = store_modules_user.useUserStore();
    const totalPrice = common_vendor.computed(() => {
      var _a;
      return (((_a = product.value) == null ? void 0 : _a.price) || 0) * quantity.value;
    });
    async function loadDetail(id) {
      var _a;
      loading.value = true;
      try {
        const result = await services_productService.getProductDetail(id);
        if (result) {
          product.value = result;
          selectedSize.value = result.sizes[0];
          previewImage.value = ((_a = result.gallery) == null ? void 0 : _a[0]) || result.cover;
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
    async function handleBuyNow() {
      await handleAddToCart();
      if (!userStore.isLoggedIn) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/order/confirm"
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
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.p({
          title: "商品详情",
          back: true,
          ["dark-action"]: "AI",
          ["action-path"]: product.value ? `/pages/chat/index?productId=${product.value.id}&title=${encodeURIComponent(product.value.title)}` : ""
        }),
        b: product.value
      }, product.value ? common_vendor.e({
        c: previewImage.value || product.value.cover,
        d: (_a = product.value.gallery) == null ? void 0 : _a.length
      }, ((_b = product.value.gallery) == null ? void 0 : _b.length) ? {
        e: common_vendor.f(product.value.gallery, (item, k0, i0) => {
          return {
            a: item,
            b: common_vendor.n({
              active: previewImage.value === item
            }),
            c: item,
            d: common_vendor.o(($event) => previewImage.value = item, item)
          };
        })
      } : {}, {
        f: common_vendor.t(product.value.title),
        g: common_vendor.t(product.value.subtitle),
        h: common_vendor.t(product.value.price),
        i: common_vendor.t(product.value.originalPrice),
        j: common_vendor.t(product.value.stock),
        k: common_vendor.f(product.value.sizes, (size, k0, i0) => {
          return {
            a: common_vendor.t(size),
            b: size,
            c: common_vendor.n({
              active: selectedSize.value === size
            }),
            d: common_vendor.o(($event) => selectedSize.value = size, size)
          };
        }),
        l: common_vendor.t(product.value.detail),
        m: common_vendor.t(product.value.sales),
        n: common_vendor.o(openChat),
        o: (_c = product.value.gallery) == null ? void 0 : _c.length
      }, ((_d = product.value.gallery) == null ? void 0 : _d.length) ? {
        p: common_vendor.f(product.value.gallery, (item, k0, i0) => {
          return {
            a: `detail-${item}`,
            b: item
          };
        })
      } : {}, {
        q: common_vendor.o(($event) => quantity.value = $event),
        r: common_vendor.p({
          modelValue: quantity.value
        })
      }) : {}, {
        s: product.value
      }, product.value ? {
        t: common_vendor.t(totalPrice.value),
        v: common_vendor.o(handleAddToCart),
        w: common_vendor.o(handleBuyNow)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8216645a"]]);
wx.createPage(MiniProgramPage);
