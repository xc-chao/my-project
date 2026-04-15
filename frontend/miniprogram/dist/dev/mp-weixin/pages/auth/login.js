"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_user = require("../../store/modules/user.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
if (!Math) {
  AppHeader();
}
const AppHeader = () => "../../components/AppHeader.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const supportVisuals = constants_pageImageMap.pageImageMap.auth.support;
    const trustAvatars = constants_pageImageMap.pageImageMap.auth.trustAvatars;
    async function handleLogin(identity = "user") {
      await userStore.login(identity);
      common_vendor.index.switchTab({
        url: identity === "admin" ? "/pages/profile/index" : "/pages/home/index"
      });
    }
    function handlePhoneLogin() {
      handleLogin("user");
    }
    function handleAdminLogin() {
      handleLogin("admin");
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: ""
        }),
        b: common_vendor.unref(constants_pageImageMap.pageImageMap).auth.hero,
        c: common_vendor.f(common_vendor.unref(supportVisuals), (item, k0, i0) => {
          return {
            a: item,
            b: item
          };
        }),
        d: common_vendor.f(common_vendor.unref(trustAvatars), (item, k0, i0) => {
          return {
            a: item,
            b: item
          };
        }),
        e: common_vendor.unref(userStore).loading,
        f: common_vendor.o(($event) => handleLogin("user")),
        g: common_vendor.o(handlePhoneLogin),
        h: common_vendor.o(handleAdminLogin)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6c56cc25"]]);
wx.createPage(MiniProgramPage);
