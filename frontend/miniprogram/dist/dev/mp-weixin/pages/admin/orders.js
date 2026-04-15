"use strict";
const common_vendor = require("../../common/vendor.js");
const services_adminService = require("../../services/adminService.js");
const store_modules_user = require("../../store/modules/user.js");
const utils_admin = require("../../utils/admin.js");
if (!Math) {
  (AppHeader + OrderCard + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const OrderCard = () => "../../components/common/OrderCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "orders",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const loading = common_vendor.ref(false);
    const orders = common_vendor.ref([]);
    const currentFilter = common_vendor.ref("all");
    const filters = [
      { key: "all", label: "全部" },
      { key: "pending", label: "待处理" },
      { key: "shipping", label: "配送中" },
      { key: "done", label: "已完成" }
    ];
    const summaryCards = common_vendor.computed(() => {
      const pendingCount = orders.value.filter((item) => ["pending_payment", "pending_shipping"].includes(item.status)).length;
      const shippingCount = orders.value.filter((item) => item.status === "shipped").length;
      const doneCount = orders.value.filter((item) => ["completed", "cancelled"].includes(item.status)).length;
      return [
        { label: "订单总数", value: `${orders.value.length}` },
        { label: "待处理", value: `${pendingCount}` },
        { label: "配送中", value: `${shippingCount}` },
        { label: "已完成", value: `${doneCount}` }
      ];
    });
    const filteredOrders = common_vendor.computed(() => {
      if (currentFilter.value === "all") {
        return orders.value;
      }
      if (currentFilter.value === "pending") {
        return orders.value.filter((item) => ["pending_payment", "pending_shipping"].includes(item.status));
      }
      if (currentFilter.value === "shipping") {
        return orders.value.filter((item) => item.status === "shipped");
      }
      return orders.value.filter((item) => ["completed", "cancelled"].includes(item.status));
    });
    function cloneOrder(order) {
      return {
        ...order,
        items: order.items.map((goods) => ({
          ...goods,
          product: goods.product ? {
            ...goods.product
          } : goods.product
        }))
      };
    }
    async function loadOrders() {
      if (!utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      loading.value = true;
      try {
        const list = await services_adminService.getAdminOrders();
        orders.value = list.map(cloneOrder);
      } catch (error) {
        const message = error instanceof Error ? error.message : "订单数据加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function getNextStatus(status) {
      return {
        pending_payment: "pending_shipping",
        pending_shipping: "shipped",
        shipped: "completed"
      }[status] || "";
    }
    function getActionText(status) {
      return {
        pending_payment: "记为已支付",
        pending_shipping: "标记发货",
        shipped: "完成订单"
      }[status] || "";
    }
    function applyOrder(updated) {
      orders.value = orders.value.map((item) => item.id === updated.id ? cloneOrder(updated) : item);
    }
    async function promoteOrder(id) {
      const target = orders.value.find((item) => item.id === id);
      const nextStatus = getNextStatus((target == null ? void 0 : target.status) || "");
      if (!target || !nextStatus) {
        common_vendor.index.showToast({
          title: "当前状态无需推进",
          icon: "none"
        });
        return;
      }
      try {
        const updated = await services_adminService.updateAdminOrder(id, {
          status: nextStatus
        });
        applyOrder(updated);
        common_vendor.index.showToast({
          title: "订单状态已推进",
          icon: "none"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "订单状态更新失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      }
    }
    function goAdminHome() {
      common_vendor.index.redirectTo({
        url: "/pages/admin/index"
      });
    }
    function openOrderDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/order-detail?id=${id}`
      });
    }
    function openAfterSales(orderId) {
      const query = orderId ? `?orderId=${encodeURIComponent(orderId)}` : "";
      common_vendor.index.navigateTo({
        url: `/pages/admin/after-sales${query}`
      });
    }
    common_vendor.onShow(loadOrders);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "订单处理",
          back: true
        }),
        b: common_vendor.o(($event) => openAfterSales()),
        c: common_vendor.f(summaryCards.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        }),
        d: common_vendor.f(filters, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: currentFilter.value === item.key
            }),
            d: common_vendor.o(($event) => currentFilter.value = item.key, item.key)
          };
        }),
        e: filteredOrders.value.length
      }, filteredOrders.value.length ? {
        f: common_vendor.f(filteredOrders.value, (item, k0, i0) => {
          return {
            a: `order-card-${item.id}-${item.status}`,
            b: common_vendor.o(promoteOrder, `order-card-${item.id}-${item.status}`),
            c: "f4b81776-1-" + i0,
            d: common_vendor.p({
              item,
              ["action-text"]: getActionText(item.status)
            }),
            e: common_vendor.o(($event) => openOrderDetail(item.id), `order-${item.id}-${item.status}`),
            f: common_vendor.o(($event) => openAfterSales(item.id), `order-${item.id}-${item.status}`),
            g: `order-${item.id}-${item.status}`
          };
        })
      } : {
        g: common_vendor.o(goAdminHome),
        h: common_vendor.p({
          title: loading.value ? "订单加载中" : "当前筛选下暂无订单",
          desc: loading.value ? "正在准备订单管理列表，请稍候。" : "可以切换筛选查看其他处理状态。",
          ["action-text"]: "返回后台"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f4b81776"]]);
wx.createPage(MiniProgramPage);
