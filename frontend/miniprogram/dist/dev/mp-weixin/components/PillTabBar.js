"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PillTabBar",
  props: {
    current: {}
  },
  setup(__props) {
    const props = __props;
    const tabs = [
      { key: "home", label: "首页", url: "/pages/home/index" },
      { key: "cart", label: "购物车", url: "/pages/cart/index" },
      { key: "profile", label: "我的", url: "/pages/profile/index" }
    ];
    function switchPage(url) {
      common_vendor.index.switchTab({ url });
    }
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: tab.key,
            c: common_vendor.n({
              active: props.current === tab.key
            }),
            d: common_vendor.o(($event) => switchPage(tab.url), tab.key)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6ed46dc"]]);
wx.createComponent(Component);
