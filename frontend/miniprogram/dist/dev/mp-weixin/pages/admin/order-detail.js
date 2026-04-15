"use strict";
const common_vendor = require("../../common/vendor.js");
const services_adminService = require("../../services/adminService.js");
const store_modules_user = require("../../store/modules/user.js");
const utils_admin = require("../../utils/admin.js");
if (!Math) {
  (AppHeader + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "order-detail",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const orderId = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const order = common_vendor.ref(null);
    const relatedAfterSales = common_vendor.ref([]);
    const routeKey = common_vendor.ref("");
    const logisticsForm = common_vendor.reactive({
      carrier: "",
      trackingNo: ""
    });
    const summaryCards = common_vendor.computed(() => {
      var _a;
      if (!order.value) {
        return [];
      }
      return [
        { label: "订单金额", value: `¥${order.value.amount}` },
        { label: "商品数量", value: `${order.value.items.length}` },
        { label: "关联售后", value: `${relatedAfterSales.value.length}` },
        { label: "物流单号", value: ((_a = order.value.logistics) == null ? void 0 : _a.trackingNo) || "未录入" }
      ];
    });
    const timelineItems = common_vendor.computed(() => {
      var _a;
      return (((_a = order.value) == null ? void 0 : _a.timeline) || []).slice().reverse();
    });
    const orderStatusLabel = common_vendor.computed(() => {
      var _a;
      return formatOrderStatus(((_a = order.value) == null ? void 0 : _a.status) || "");
    });
    const nextOrderActionText = common_vendor.computed(() => {
      var _a;
      return getNextOrderActionText(((_a = order.value) == null ? void 0 : _a.status) || "");
    });
    function formatOrderStatus(status) {
      return {
        pending_payment: "待支付",
        pending_shipping: "待发货",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消"
      }[status] || status;
    }
    function formatAfterSaleStatus(status) {
      return {
        submitted: "已提交",
        reviewing: "审核中",
        approved: "已通过",
        rejected: "已驳回"
      }[status] || status;
    }
    function getNextOrderStatus(status = "") {
      return {
        pending_payment: "pending_shipping",
        pending_shipping: "shipped",
        shipped: "completed"
      }[status] || "";
    }
    function getNextOrderActionText(status = "") {
      return {
        pending_payment: "记为已支付",
        pending_shipping: "标记发货",
        shipped: "完成订单"
      }[status] || "";
    }
    function normalizeQuery(query) {
      return {
        id: typeof (query == null ? void 0 : query.id) === "string" ? query.id : ""
      };
    }
    function buildRouteKey(query) {
      return query.id;
    }
    function resetPageState() {
      order.value = null;
      relatedAfterSales.value = [];
      logisticsForm.carrier = "";
      logisticsForm.trackingNo = "";
    }
    function applyAfterSale(updated) {
      relatedAfterSales.value = relatedAfterSales.value.map((item) => item.id === updated.id ? { ...updated } : item);
    }
    function applyOrderDetail(payload) {
      order.value = {
        ...payload,
        logistics: payload.logistics ? { ...payload.logistics } : null,
        timeline: (payload.timeline || []).map((item) => ({ ...item })),
        items: payload.items.map((item) => ({
          ...item,
          product: item.product ? { ...item.product } : void 0
        }))
      };
      syncLogisticsForm();
    }
    function syncLogisticsForm() {
      var _a, _b, _c, _d;
      logisticsForm.carrier = ((_b = (_a = order.value) == null ? void 0 : _a.logistics) == null ? void 0 : _b.carrier) || "";
      logisticsForm.trackingNo = ((_d = (_c = order.value) == null ? void 0 : _c.logistics) == null ? void 0 : _d.trackingNo) || "";
    }
    function getCurrentPageQuery() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return (currentPage == null ? void 0 : currentPage.options) || {};
    }
    function getH5Query() {
      if (typeof window === "undefined") {
        return getCurrentPageQuery();
      }
      const hash = window.location.hash || "";
      const [, search = ""] = hash.split("?");
      return Object.fromEntries(new URLSearchParams(search).entries());
    }
    async function loadDetail() {
      if (!orderId.value || !utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      loading.value = true;
      try {
        const [orderPayload, afterSalePayload] = await Promise.all([
          services_adminService.getAdminOrderDetail(orderId.value),
          services_adminService.getAdminAfterSales(orderId.value)
        ]);
        applyOrderDetail(orderPayload);
        relatedAfterSales.value = afterSalePayload.map((item) => ({ ...item }));
      } catch (error) {
        const message = error instanceof Error ? error.message : "订单详情加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    async function promoteOrder() {
      var _a;
      if (!order.value) {
        return;
      }
      const nextStatus = getNextOrderStatus(order.value.status);
      if (!nextStatus) {
        common_vendor.index.showToast({
          title: "当前状态无需推进",
          icon: "none"
        });
        return;
      }
      if (nextStatus === "shipped" && !((_a = order.value.logistics) == null ? void 0 : _a.trackingNo)) {
        common_vendor.index.showToast({
          title: "请先录入物流单号",
          icon: "none"
        });
        return;
      }
      try {
        const updated = await services_adminService.updateAdminOrder(order.value.id, {
          status: nextStatus
        });
        applyOrderDetail(updated);
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
    async function saveLogistics() {
      if (!order.value) {
        return;
      }
      if (!logisticsForm.carrier.trim() || !logisticsForm.trackingNo.trim()) {
        common_vendor.index.showToast({
          title: "请填写完整物流信息",
          icon: "none"
        });
        return;
      }
      try {
        const updated = await services_adminService.updateAdminOrderLogistics(order.value.id, {
          carrier: logisticsForm.carrier.trim(),
          trackingNo: logisticsForm.trackingNo.trim()
        });
        applyOrderDetail(updated);
        common_vendor.index.showToast({
          title: "物流信息已保存",
          icon: "success"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "物流信息保存失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      }
    }
    async function handleAfterSale(id, status) {
      try {
        const updated = await services_adminService.updateAdminAfterSale(id, {
          status
        });
        applyAfterSale(updated);
        common_vendor.index.showToast({
          title: status === "approved" ? "已通过售后" : "已驳回售后",
          icon: "none"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "售后状态更新失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      }
    }
    function openAfterSalesPage() {
      common_vendor.index.navigateTo({
        url: `/pages/admin/after-sales?orderId=${encodeURIComponent(orderId.value)}`
      });
    }
    function goOrders() {
      common_vendor.index.redirectTo({
        url: "/pages/admin/orders"
      });
    }
    async function initializePage(rawQuery) {
      const nextQuery = normalizeQuery(rawQuery);
      const nextRouteKey = buildRouteKey(nextQuery);
      if (!nextQuery.id) {
        return;
      }
      if (routeKey.value !== nextRouteKey) {
        resetPageState();
        routeKey.value = nextRouteKey;
      }
      orderId.value = nextQuery.id;
      await loadDetail();
    }
    function handleH5RouteChange() {
      void initializePage(getH5Query());
    }
    common_vendor.onLoad((query) => {
      void initializePage(query);
    });
    common_vendor.onShow(() => {
      const query = typeof window === "undefined" ? getCurrentPageQuery() : getH5Query();
      void initializePage(query);
    });
    common_vendor.onMounted(() => {
      if (typeof window !== "undefined") {
        window.addEventListener("hashchange", handleH5RouteChange);
      }
    });
    common_vendor.onUnmounted(() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hashchange", handleH5RouteChange);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "订单详情",
          back: true
        }),
        b: order.value
      }, order.value ? common_vendor.e({
        c: common_vendor.t(order.value.id),
        d: common_vendor.t(order.value.createdAt),
        e: common_vendor.t(orderStatusLabel.value),
        f: `status-${order.value.id}-${order.value.status}`,
        g: nextOrderActionText.value
      }, nextOrderActionText.value ? {
        h: common_vendor.t(nextOrderActionText.value),
        i: `primary-${order.value.id}-${order.value.status}`,
        j: common_vendor.o(promoteOrder)
      } : {}, {
        k: common_vendor.o(openAfterSalesPage),
        l: common_vendor.f(summaryCards.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        }),
        m: common_vendor.f(order.value.items, (item, k0, i0) => {
          var _a, _b, _c;
          return {
            a: (_a = item.product) == null ? void 0 : _a.cover,
            b: common_vendor.t((_b = item.product) == null ? void 0 : _b.title),
            c: common_vendor.t(item.size),
            d: common_vendor.t(item.quantity),
            e: common_vendor.t(((_c = item.product) == null ? void 0 : _c.price) || 0),
            f: item.id
          };
        }),
        n: order.value.logistics
      }, order.value.logistics ? {
        o: common_vendor.t(order.value.logistics.updatedAt)
      } : {}, {
        p: logisticsForm.carrier,
        q: common_vendor.o(($event) => logisticsForm.carrier = $event.detail.value),
        r: logisticsForm.trackingNo,
        s: common_vendor.o(($event) => logisticsForm.trackingNo = $event.detail.value),
        t: common_vendor.o(saveLogistics),
        v: timelineItems.value.length
      }, timelineItems.value.length ? {
        w: common_vendor.f(timelineItems.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.desc),
            d: item.id
          };
        })
      } : {
        x: common_vendor.p({
          title: "暂无时间线记录",
          desc: "后续的支付确认、物流录入与发货完成会按时间顺序沉淀到这里。"
        })
      }, {
        y: relatedAfterSales.value.length
      }, relatedAfterSales.value.length ? {
        z: common_vendor.f(relatedAfterSales.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.productTitle),
            b: common_vendor.t(item.userName),
            c: common_vendor.t(item.createdAt),
            d: common_vendor.t(formatAfterSaleStatus(item.status)),
            e: `after-sale-status-${item.id}-${item.status}`,
            f: common_vendor.n(item.status),
            g: common_vendor.t(item.reason),
            h: item.status === "submitted" || item.status === "reviewing"
          }, item.status === "submitted" || item.status === "reviewing" ? {
            i: common_vendor.o(($event) => handleAfterSale(item.id, "rejected"), `after-sale-${item.id}-${item.status}`),
            j: common_vendor.o(($event) => handleAfterSale(item.id, "approved"), `after-sale-${item.id}-${item.status}`),
            k: `after-sale-actions-${item.id}-${item.status}`
          } : {}, {
            l: `after-sale-${item.id}-${item.status}`
          });
        })
      } : {
        A: common_vendor.o(openAfterSalesPage),
        B: common_vendor.p({
          title: "暂无关联售后",
          desc: "当前订单暂时没有售后申请记录。",
          ["action-text"]: "查看全部售后"
        })
      }) : {
        C: common_vendor.o(goOrders),
        D: common_vendor.p({
          title: loading.value ? "订单详情加载中" : "未找到订单",
          desc: loading.value ? "正在准备订单详情，请稍候。" : "可以返回订单处理页重新选择订单。",
          ["action-text"]: "返回订单处理"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4931ccb1"]]);
wx.createPage(MiniProgramPage);
