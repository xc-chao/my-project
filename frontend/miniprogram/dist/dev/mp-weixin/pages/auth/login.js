"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_user = require("../../store/modules/user.js");
require("../../mock/data.js");
const mock_pageImageMap = require("../../mock/page-image-map.js");
if (!Math) {
  AppHeader();
}
const AppHeader = () => "../../components/AppHeader.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const supportVisuals = mock_pageImageMap.pageImageMap.auth.support;
    const trustAvatars = mock_pageImageMap.pageImageMap.auth.trustAvatars;
    async function handleLogin() {
      await userStore.login();
      common_vendor.index.switchTab({
        url: "/pages/home/index"
      });
    }
    function handlePhoneLogin() {
      handleLogin();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: ""
        }),
        b: common_vendor.unref(mock_pageImageMap.pageImageMap).auth.hero,
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
        f: common_vendor.o(handleLogin),
        g: common_vendor.o(handlePhoneLogin)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6c56cc25"]]);
wx.createPage(MiniProgramPage);
