"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "OrderCard",
  props: {
    item: {},
    actionText: {}
  },
  emits: ["action"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function formatStatus(status) {
      return {
        pending_payment: "待支付",
        pending_shipping: "待发货",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消"
      }[status] || status;
    }
    function openGoodsDetail(productId) {
      if (!productId) {
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${productId}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.item.id),
        b: common_vendor.t(formatStatus(_ctx.item.status)),
        c: `status-${_ctx.item.id}-${_ctx.item.status}`,
        d: common_vendor.f(_ctx.item.items, (goods, k0, i0) => {
          var _a, _b;
          return {
            a: (_a = goods.product) == null ? void 0 : _a.cover,
            b: common_vendor.t((_b = goods.product) == null ? void 0 : _b.title),
            c: common_vendor.t(goods.size),
            d: common_vendor.t(goods.quantity),
            e: goods.id,
            f: common_vendor.o(($event) => {
              var _a2;
              return openGoodsDetail(((_a2 = goods.product) == null ? void 0 : _a2.id) || goods.productId);
            }, goods.id)
          };
        }),
        e: common_vendor.t(_ctx.item.createdAt),
        f: common_vendor.t(_ctx.item.amount),
        g: _ctx.actionText
      }, _ctx.actionText ? {
        h: common_vendor.t(_ctx.actionText),
        i: `action-${_ctx.item.id}-${_ctx.item.status}`,
        j: common_vendor.o(($event) => emit("action", props.item.id))
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-344a917b"]]);
wx.createComponent(Component);
