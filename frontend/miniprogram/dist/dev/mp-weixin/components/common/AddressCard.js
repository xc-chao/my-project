"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AddressCard",
  props: {
    item: {},
    compact: { type: Boolean }
  },
  emits: ["edit", "delete"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.item.name),
        b: common_vendor.t(_ctx.item.phone),
        c: _ctx.item.isDefault
      }, _ctx.item.isDefault ? {} : {}, {
        d: !_ctx.compact
      }, !_ctx.compact ? {
        e: common_vendor.o(($event) => emit("edit", _ctx.item.id)),
        f: common_vendor.o(($event) => emit("delete", _ctx.item.id))
      } : {}, {
        g: common_vendor.t(_ctx.item.region),
        h: common_vendor.t(_ctx.item.detail)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ff0b15f"]]);
wx.createComponent(Component);
