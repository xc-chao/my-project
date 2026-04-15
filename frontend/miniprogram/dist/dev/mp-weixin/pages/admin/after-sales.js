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
  __name: "after-sales",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const loading = common_vendor.ref(false);
    const focusOrderId = common_vendor.ref("");
    const records = common_vendor.ref([]);
    const currentFilter = common_vendor.ref("all");
    const routeKey = common_vendor.ref("");
    const filters = [
      { key: "all", label: "全部" },
      { key: "pending", label: "待审核" },
      { key: "approved", label: "已通过" },
      { key: "rejected", label: "已驳回" }
    ];
    const filteredRecords = common_vendor.computed(() => {
      if (currentFilter.value === "all") {
        return records.value;
      }
      if (currentFilter.value === "pending") {
        return records.value.filter((item) => item.status === "submitted" || item.status === "reviewing");
      }
      return records.value.filter((item) => item.status === currentFilter.value);
    });
    const summaryCards = common_vendor.computed(() => {
      const pendingCount = records.value.filter((item) => item.status === "submitted" || item.status === "reviewing").length;
      const approvedCount = records.value.filter((item) => item.status === "approved").length;
      const rejectedCount = records.value.filter((item) => item.status === "rejected").length;
      return [
        { label: "售后总数", value: `${records.value.length}` },
        { label: "待审核", value: `${pendingCount}` },
        { label: "已通过", value: `${approvedCount}` },
        { label: "已驳回", value: `${rejectedCount}` }
      ];
    });
    function formatStatus(status) {
      return {
        submitted: "已提交",
        reviewing: "审核中",
        approved: "已通过",
        rejected: "已驳回"
      }[status] || status;
    }
    function cloneRecord(record) {
      return {
        ...record
      };
    }
    function normalizeQuery(query) {
      return {
        orderId: typeof (query == null ? void 0 : query.orderId) === "string" ? query.orderId : ""
      };
    }
    function buildRouteKey(query) {
      return query.orderId;
    }
    function resetPageState() {
      focusOrderId.value = "";
      currentFilter.value = "all";
      records.value = [];
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
    function applyRecord(updated) {
      records.value = records.value.map((item) => item.id === updated.id ? cloneRecord(updated) : item);
    }
    async function loadRecords() {
      if (!utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      loading.value = true;
      try {
        const list = await services_adminService.getAdminAfterSales(focusOrderId.value || void 0);
        records.value = list.map(cloneRecord);
      } catch (error) {
        const message = error instanceof Error ? error.message : "售后数据加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    async function updateStatus(item, status) {
      try {
        const updated = await services_adminService.updateAdminAfterSale(item.id, {
          status
        });
        applyRecord(updated);
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
    function openOrder(id) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/order-detail?id=${id}`
      });
    }
    function goAdminHome() {
      common_vendor.index.redirectTo({
        url: "/pages/admin/orders"
      });
    }
    async function initializePage(rawQuery) {
      const nextQuery = normalizeQuery(rawQuery);
      const nextRouteKey = buildRouteKey(nextQuery);
      if (routeKey.value !== nextRouteKey) {
        resetPageState();
        routeKey.value = nextRouteKey;
      }
      focusOrderId.value = nextQuery.orderId;
      await loadRecords();
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
          title: "售后审批",
          back: true
        }),
        b: common_vendor.t(focusOrderId.value ? `当前聚焦订单 ${focusOrderId.value} 的售后记录，可直接审核通过或驳回。` : "集中查看全部售后申请，并统一推进审核结果。"),
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
        e: filteredRecords.value.length
      }, filteredRecords.value.length ? {
        f: common_vendor.f(filteredRecords.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.productTitle),
            b: common_vendor.t(item.userName),
            c: common_vendor.t(item.orderId),
            d: common_vendor.t(item.createdAt),
            e: common_vendor.t(formatStatus(item.status)),
            f: `after-sale-status-${item.id}-${item.status}`,
            g: common_vendor.n(item.status),
            h: common_vendor.t(item.reason),
            i: common_vendor.o(($event) => openOrder(item.orderId), `after-sale-${item.id}-${item.status}`),
            j: item.status === "submitted" || item.status === "reviewing"
          }, item.status === "submitted" || item.status === "reviewing" ? {
            k: common_vendor.o(($event) => updateStatus(item, "rejected"), `after-sale-${item.id}-${item.status}`),
            l: common_vendor.o(($event) => updateStatus(item, "approved"), `after-sale-${item.id}-${item.status}`)
          } : {}, {
            m: `after-sale-actions-${item.id}-${item.status}`,
            n: `after-sale-${item.id}-${item.status}`
          });
        })
      } : {
        g: common_vendor.o(goAdminHome),
        h: common_vendor.p({
          title: loading.value ? "售后记录加载中" : "暂无售后记录",
          desc: loading.value ? "正在准备售后审批数据，请稍候。" : "当前筛选下没有可处理的售后记录。",
          ["action-text"]: "返回订单处理"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ca643792"]]);
wx.createPage(MiniProgramPage);
