"use strict";
const common_vendor = require("../../common/vendor.js");
const services_orderService = require("../../services/orderService.js");
if (!Math) {
  (AppHeader + OrderCard + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const OrderCard = () => "../../components/common/OrderCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "list",
  setup(__props) {
    const highlightId = common_vendor.ref("");
    const statusTab = common_vendor.ref("all");
    const orders = common_vendor.ref([]);
    const tabs = [
      { key: "all", label: "全部" },
      { key: "pending", label: "进行中" },
      { key: "done", label: "已完成" }
    ];
    const filteredOrders = common_vendor.computed(() => {
      if (statusTab.value === "all") {
        return orders.value;
      }
      if (statusTab.value === "pending") {
        return orders.value.filter((item) => ["pending_payment", "pending_shipping", "shipped"].includes(item.status));
      }
      return orders.value.filter((item) => ["completed", "cancelled"].includes(item.status));
    });
    async function loadOrders() {
      orders.value = await services_orderService.getOrderList();
    }
    function goAfterSale(orderId) {
      var _a, _b;
      const order = orders.value.find((item) => item.id === orderId);
      const first = (_a = order == null ? void 0 : order.items) == null ? void 0 : _a[0];
      common_vendor.index.navigateTo({
        url: `/pages/after-sale/index?orderId=${orderId}&productTitle=${encodeURIComponent(((_b = first == null ? void 0 : first.product) == null ? void 0 : _b.title) || "订单商品")}`
      });
    }
    function goHome() {
      common_vendor.index.switchTab({
        url: "/pages/home/index"
      });
    }
    common_vendor.onLoad((query) => {
      if (typeof (query == null ? void 0 : query.highlight) === "string") {
        highlightId.value = query.highlight;
      }
    });
    common_vendor.onMounted(loadOrders);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "历史订单",
          back: true
        }),
        b: common_vendor.f(tabs, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: statusTab.value === item.key
            }),
            d: common_vendor.o(($event) => statusTab.value = item.key, item.key)
          };
        }),
        c: filteredOrders.value.length
      }, filteredOrders.value.length ? {
        d: common_vendor.f(filteredOrders.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(goAfterSale, item.id),
            b: "80f8e5f8-1-" + i0,
            c: common_vendor.p({
              item,
              ["action-text"]: "申请售后"
            }),
            d: item.id,
            e: common_vendor.n({
              highlight: item.id === highlightId.value
            })
          };
        })
      } : {
        e: common_vendor.o(goHome),
        f: common_vendor.p({
          title: "还没有订单记录",
          desc: "可以先去首页浏览商品，完成加购和下单后再回来查看。",
          ["action-text"]: "去首页"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-80f8e5f8"]]);
wx.createPage(MiniProgramPage);
