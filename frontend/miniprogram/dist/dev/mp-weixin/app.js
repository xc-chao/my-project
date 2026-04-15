"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/auth/login.js";
  "./pages/home/index.js";
  "./pages/search/index.js";
  "./pages/product/detail.js";
  "./pages/chat/index.js";
  "./pages/order/confirm.js";
  "./pages/order/list.js";
  "./pages/address/index.js";
  "./pages/after-sale/index.js";
  "./pages/admin/index.js";
  "./pages/admin/products.js";
  "./pages/admin/product-form.js";
  "./pages/admin/orders.js";
  "./pages/admin/order-detail.js";
  "./pages/admin/after-sales.js";
  "./pages/admin/feedback.js";
  "./pages/cart/index.js";
  "./pages/profile/index.js";
  "./pages/profile/account.js";
}
const _sfc_main = {};
function _sfc_render(_ctx, _cache) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
