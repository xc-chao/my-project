"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "FormSection",
  props: {
    title: {},
    desc: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.title),
        b: _ctx.desc
      }, _ctx.desc ? {
        c: common_vendor.t(_ctx.desc)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-03602b2b"]]);
wx.createComponent(Component);
