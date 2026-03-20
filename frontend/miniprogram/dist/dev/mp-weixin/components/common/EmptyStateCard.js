"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "EmptyStateCard",
  props: {
    title: {},
    desc: {},
    actionText: {}
  },
  emits: ["action"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.title),
        b: common_vendor.t(_ctx.desc),
        c: _ctx.actionText
      }, _ctx.actionText ? {
        d: common_vendor.t(_ctx.actionText),
        e: common_vendor.o(($event) => emit("action"))
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-af59061d"]]);
wx.createComponent(Component);
