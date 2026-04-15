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
  __name: "index",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const loading = common_vendor.ref(false);
    const overview = common_vendor.ref(null);
    function ensureAdminAccess() {
      return utils_admin.ensureAdminPageAccess(userStore.isAdmin);
    }
    async function loadOverview() {
      if (!ensureAdminAccess()) {
        return;
      }
      loading.value = true;
      try {
        overview.value = await services_adminService.getAdminOverview();
      } catch (error) {
        const message = error instanceof Error ? error.message : "后台数据加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function openModule(key) {
      const routeMap = {
        product: "/pages/admin/products",
        order: "/pages/admin/orders",
        feedback: "/pages/admin/feedback"
      };
      common_vendor.index.navigateTo({
        url: routeMap[key]
      });
    }
    function goProfile() {
      common_vendor.index.switchTab({
        url: "/pages/profile/index"
      });
    }
    common_vendor.onMounted(loadOverview);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "后台管理",
          back: true
        }),
        b: overview.value
      }, overview.value ? {
        c: common_vendor.f(overview.value.metrics, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: common_vendor.t(item.hint),
            d: item.label,
            e: common_vendor.n({
              danger: item.accent === "danger"
            })
          };
        }),
        d: common_vendor.f(overview.value.modules, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: common_vendor.t(item.value),
            d: common_vendor.t(item.hint),
            e: item.key,
            f: common_vendor.o(($event) => openModule(item.key), item.key)
          };
        }),
        e: common_vendor.f(overview.value.hotProducts, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.sales),
            d: common_vendor.t(item.stock),
            e: item.id
          };
        }),
        f: common_vendor.f(overview.value.feedbacks, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.userName),
            b: common_vendor.t(item.status === "resolved" ? "已处理" : "待跟进"),
            c: common_vendor.n({
              resolved: item.status === "resolved"
            }),
            d: common_vendor.t(item.productTitle),
            e: common_vendor.t(item.summary),
            f: common_vendor.t(item.createdAt),
            g: item.id
          };
        }),
        g: common_vendor.t(overview.value.monitor.todayCalls),
        h: common_vendor.t(overview.value.monitor.fallbackCount),
        i: common_vendor.t(overview.value.monitor.successRate),
        j: common_vendor.t(overview.value.monitor.avgLatencyMs)
      } : {
        k: common_vendor.o(goProfile),
        l: common_vendor.p({
          title: loading.value ? "后台数据加载中" : "暂无后台数据",
          desc: loading.value ? "正在准备管理员概览，请稍候。" : "可以稍后重试，或先返回我的页面。",
          ["action-text"]: "返回我的"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f94c733c"]]);
wx.createPage(MiniProgramPage);
