"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Math) {
  PillTabBar();
}
const PillTabBar = () => "../../components/PillTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const shortcuts = common_vendor.computed(() => [
      "地址管理",
      "历史订单",
      "AI 咨询记录",
      "售后申请"
    ]);
    function handleLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/auth/login"
      });
    }
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).profile
      }, common_vendor.unref(userStore).profile ? {
        b: common_vendor.t(common_vendor.unref(userStore).profile.nickname.slice(0, 1)),
        c: common_vendor.t(common_vendor.unref(userStore).profile.nickname),
        d: common_vendor.t(common_vendor.unref(userStore).profile.phone)
      } : {
        e: common_vendor.o(handleLogin)
      }, {
        f: common_vendor.f(shortcuts.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        }),
        g: common_vendor.p({
          current: "profile"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97f9319"]]);
wx.createPage(MiniProgramPage);
