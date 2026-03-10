"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_cart = require("../../store/modules/cart.js");
if (!Math) {
  PillTabBar();
}
const PillTabBar = () => "../../components/PillTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const cartStore = store_modules_cart.useCartStore();
    const userStore = store_modules_user.useUserStore();
    async function loadCart() {
      if (!userStore.isLoggedIn) {
        return;
      }
      await cartStore.fetchCart();
    }
    function goLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/auth/login"
      });
    }
    common_vendor.onMounted(loadCart);
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
      loadCart();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(cartStore).totalCount),
        b: !common_vendor.unref(userStore).isLoggedIn
      }, !common_vendor.unref(userStore).isLoggedIn ? {
        c: common_vendor.o(goLogin)
      } : common_vendor.e({
        d: common_vendor.unref(cartStore).list.length
      }, common_vendor.unref(cartStore).list.length ? {
        e: common_vendor.f(common_vendor.unref(cartStore).list, (item, k0, i0) => {
          var _a, _b, _c;
          return {
            a: (_a = item.product) == null ? void 0 : _a.cover,
            b: common_vendor.t((_b = item.product) == null ? void 0 : _b.title),
            c: common_vendor.t(item.size),
            d: common_vendor.t((_c = item.product) == null ? void 0 : _c.price),
            e: common_vendor.o(($event) => common_vendor.unref(cartStore).changeQuantity(item.id, item.quantity - 1), item.id),
            f: common_vendor.t(item.quantity),
            g: common_vendor.o(($event) => common_vendor.unref(cartStore).changeQuantity(item.id, item.quantity + 1), item.id),
            h: common_vendor.o(($event) => common_vendor.unref(cartStore).remove(item.id), item.id),
            i: item.id
          };
        })
      } : {}), {
        f: common_vendor.unref(userStore).isLoggedIn
      }, common_vendor.unref(userStore).isLoggedIn ? {
        g: common_vendor.t(common_vendor.unref(cartStore).totalAmount)
      } : {}, {
        h: common_vendor.p({
          current: "cart"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3277fd7b"]]);
wx.createPage(MiniProgramPage);
