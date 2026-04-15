"use strict";
const common_vendor = require("../common/vendor.js");
if (!Math) {
  UniIcons();
}
const UniIcons = () => "../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PillTabBar",
  props: {
    current: {}
  },
  setup(__props) {
    const props = __props;
    const tabs = [
      { key: "home", label: "首页", icon: "home", activeIcon: "home-filled", url: "/pages/home/index" },
      { key: "search", label: "搜索", icon: "search", activeIcon: "search", url: "/pages/search/index" },
      { key: "cart", label: "购物车", icon: "cart", activeIcon: "cart-filled", url: "/pages/cart/index" },
      { key: "profile", label: "我的", icon: "person", activeIcon: "person-filled", url: "/pages/profile/index" }
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
            a: "b6ed46dc-0-" + i0,
            b: common_vendor.p({
              type: props.current === tab.key ? tab.activeIcon : tab.icon,
              size: 20,
              color: props.current === tab.key ? "#ffffff" : "#8c93a1"
            }),
            c: common_vendor.t(tab.label),
            d: tab.key,
            e: common_vendor.n({
              active: props.current === tab.key
            }),
            f: common_vendor.o(($event) => switchPage(tab.url), tab.key)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6ed46dc"]]);
wx.createComponent(Component);
