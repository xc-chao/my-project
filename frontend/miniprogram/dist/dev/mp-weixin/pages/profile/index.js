"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_pageImageMap = require("../../mock/page-image-map.js");
const store_modules_user = require("../../store/modules/user.js");
require("../../mock/data.js");
if (!Math) {
  (EmptyStateCard + PillTabBar)();
}
const PillTabBar = () => "../../components/PillTabBar.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const profileBanner = mock_pageImageMap.pageImageMap.profile.banner;
    const shortcuts = common_vendor.computed(() => [
      {
        label: "地址管理",
        path: "/pages/address/index"
      },
      {
        label: "历史订单",
        path: "/pages/order/list"
      },
      {
        label: "AI 咨询记录",
        path: "/pages/chat/index?mode=history&productId=p_001&title=%E5%92%A8%E8%AF%A2%E8%AE%B0%E5%BD%95"
      },
      {
        label: "售后申请",
        path: "/pages/after-sale/index"
      }
    ]);
    function handleLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/auth/login"
      });
    }
    function openShortcut(path) {
      common_vendor.index.navigateTo({
        url: path
      });
    }
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).profile
      }, common_vendor.unref(userStore).profile ? {
        b: common_vendor.unref(profileBanner),
        c: common_vendor.unref(userStore).profile.avatar,
        d: common_vendor.t(common_vendor.unref(userStore).profile.nickname),
        e: common_vendor.t(common_vendor.unref(userStore).profile.phone)
      } : {
        f: common_vendor.o(handleLogin),
        g: common_vendor.p({
          title: "游客模式",
          desc: "登录后可同步订单、地址、售后与 AI 咨询记录。",
          ["action-text"]: "立即登录"
        })
      }, {
        h: common_vendor.f(shortcuts.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.label,
            c: common_vendor.o(($event) => openShortcut(item.path), item.label)
          };
        }),
        i: common_vendor.o(($event) => openShortcut("/pages/order/list")),
        j: common_vendor.o(($event) => openShortcut("/pages/after-sale/index")),
        k: common_vendor.p({
          current: "profile"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97f9319"]]);
wx.createPage(MiniProgramPage);
