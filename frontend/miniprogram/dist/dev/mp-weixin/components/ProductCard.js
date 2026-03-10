"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ProductCard",
  props: {
    item: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: _ctx.item.cover,
        b: common_vendor.f(_ctx.item.badges, (badge, k0, i0) => {
          return {
            a: common_vendor.t(badge),
            b: badge
          };
        }),
        c: common_vendor.t(_ctx.item.title),
        d: common_vendor.t(_ctx.item.subtitle),
        e: common_vendor.t(_ctx.item.price),
        f: common_vendor.t(_ctx.item.originalPrice),
        g: common_vendor.o(($event) => emit("select"))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a4cce9c2"]]);
wx.createComponent(Component);
