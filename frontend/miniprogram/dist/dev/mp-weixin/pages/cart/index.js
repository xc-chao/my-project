"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_pageImageMap = require("../../mock/page-image-map.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_cart = require("../../store/modules/cart.js");
if (!Math) {
  (EmptyStateCard + QuantityStepper + PillTabBar)();
}
const PillTabBar = () => "../../components/PillTabBar.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const QuantityStepper = () => "../../components/common/QuantityStepper.js";
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
    function goCheckout() {
      if (!cartStore.list.length) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/order/confirm"
      });
    }
    function goHome() {
      common_vendor.index.switchTab({
        url: "/pages/home/index"
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
        c: common_vendor.o(goLogin),
        d: common_vendor.p({
          title: "登录后查看购物车",
          desc: "登录后可继续首页、详情、加购、确认订单的完整链路。",
          ["action-text"]: "去登录"
        })
      } : common_vendor.e({
        e: common_vendor.unref(mock_pageImageMap.pageImageMap).cart.banner,
        f: common_vendor.unref(mock_pageImageMap.pageImageMap).cart.accent,
        g: common_vendor.unref(cartStore).list.length
      }, common_vendor.unref(cartStore).list.length ? {
        h: common_vendor.f(common_vendor.unref(cartStore).list, (item, k0, i0) => {
          var _a, _b, _c;
          return {
            a: (_a = item.product) == null ? void 0 : _a.cover,
            b: common_vendor.t((_b = item.product) == null ? void 0 : _b.title),
            c: common_vendor.t(item.size),
            d: common_vendor.t((_c = item.product) == null ? void 0 : _c.price),
            e: common_vendor.o(($event) => common_vendor.unref(cartStore).changeQuantity(item.id, $event), item.id),
            f: "3277fd7b-1-" + i0,
            g: common_vendor.p({
              ["model-value"]: item.quantity
            }),
            h: common_vendor.o(($event) => common_vendor.unref(cartStore).remove(item.id), item.id),
            i: item.id
          };
        })
      } : {
        i: common_vendor.o(goHome),
        j: common_vendor.p({
          title: "购物车还是空的",
          desc: "可以先去首页浏览商品，点击任意商品进入详情页完成加购。",
          ["action-text"]: "去首页"
        })
      }), {
        k: common_vendor.unref(userStore).isLoggedIn
      }, common_vendor.unref(userStore).isLoggedIn ? {
        l: common_vendor.t(common_vendor.unref(cartStore).totalAmount),
        m: common_vendor.o(goCheckout)
      } : {}, {
        n: common_vendor.p({
          current: "cart"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3277fd7b"]]);
wx.createPage(MiniProgramPage);
