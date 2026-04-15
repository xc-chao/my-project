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
  __name: "feedback",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const loading = common_vendor.ref(false);
    const feedbacks = common_vendor.ref([]);
    const overview = common_vendor.ref(null);
    const currentFilter = common_vendor.ref("all");
    const trendRange = common_vendor.ref("7d");
    const filters = [
      { key: "all", label: "全部反馈" },
      { key: "pending", label: "待跟进" },
      { key: "resolved", label: "已处理" }
    ];
    const trendRanges = [
      { key: "7d", label: "近 7 天" },
      { key: "30d", label: "近 30 天" }
    ];
    const filteredFeedbacks = common_vendor.computed(() => {
      if (currentFilter.value === "all") {
        return feedbacks.value;
      }
      return feedbacks.value.filter((item) => item.status === currentFilter.value);
    });
    const summaryCards = common_vendor.computed(() => {
      const pendingCount = feedbacks.value.filter((item) => item.status === "pending").length;
      const resolvedCount = feedbacks.value.filter((item) => item.status === "resolved").length;
      return [
        { label: "反馈总数", value: `${feedbacks.value.length}` },
        { label: "待跟进", value: `${pendingCount}` },
        { label: "已处理", value: `${resolvedCount}` }
      ];
    });
    function getChartPercent(value, max, min = 12) {
      if (!max) {
        return `${min}%`;
      }
      return `${Math.max(value / max * 100, min)}%`;
    }
    function getTrendCanvasWidth(length) {
      return length > 10 ? `${Math.max(length * 72, 760)}rpx` : "100%";
    }
    const currentRangeLabel = common_vendor.computed(() => trendRange.value === "30d" ? "30 日" : "7 日");
    const orderTrend = common_vendor.computed(() => {
      var _a;
      const list = ((_a = overview.value) == null ? void 0 : _a.charts.orderTrend[trendRange.value]) || [];
      const max = Math.max(...list.map((item) => item.value), 1);
      return list.map((item) => ({
        ...item,
        height: getChartPercent(item.value, max)
      }));
    });
    const agentTrend = common_vendor.computed(() => {
      var _a;
      const list = ((_a = overview.value) == null ? void 0 : _a.charts.agentTrend[trendRange.value]) || [];
      const max = Math.max(...list.map((item) => item.value), 1);
      return list.map((item) => ({
        ...item,
        height: getChartPercent(item.value, max)
      }));
    });
    const hotRanking = common_vendor.computed(() => {
      var _a;
      const list = ((_a = overview.value) == null ? void 0 : _a.hotProducts) || [];
      const max = Math.max(...list.map((item) => item.sales), 1);
      return list.map((item, index) => ({
        ...item,
        rank: index + 1,
        width: getChartPercent(item.sales, max, 18)
      }));
    });
    const categoryRanking = common_vendor.computed(() => {
      var _a;
      const list = ((_a = overview.value) == null ? void 0 : _a.rankings.categorySales) || [];
      const max = Math.max(...list.map((item) => item.value), 1);
      return list.map((item, index) => ({
        ...item,
        rank: index + 1,
        width: getChartPercent(item.value, max, 18)
      }));
    });
    const afterSaleReasonRanking = common_vendor.computed(() => {
      var _a;
      const list = ((_a = overview.value) == null ? void 0 : _a.rankings.afterSaleReasons) || [];
      const max = Math.max(...list.map((item) => item.value), 1);
      return list.map((item, index) => ({
        ...item,
        rank: index + 1,
        width: getChartPercent(item.value, max, 18)
      }));
    });
    function parseFeedbackDate(value) {
      return new Date(value.replace(/-/g, "/"));
    }
    function formatMonthDay(date) {
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return `${month}/${day}`;
    }
    const feedbackTrend = common_vendor.computed(() => {
      const source = feedbacks.value;
      const dayCount = trendRange.value === "30d" ? 30 : 7;
      const latestDate = source.length > 0 ? source.reduce((latest, item) => {
        const current = parseFeedbackDate(item.createdAt);
        return current.getTime() > latest.getTime() ? current : latest;
      }, parseFeedbackDate(source[0].createdAt)) : /* @__PURE__ */ new Date();
      const buckets = Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(latestDate);
        date.setDate(latestDate.getDate() - (dayCount - index - 1));
        return {
          label: formatMonthDay(date),
          pending: 0,
          resolved: 0
        };
      });
      const labelMap = new Map(buckets.map((item) => [item.label, item]));
      source.forEach((item) => {
        const label = formatMonthDay(parseFeedbackDate(item.createdAt));
        const target = labelMap.get(label);
        if (!target) {
          return;
        }
        if (item.status === "pending") {
          target.pending += 1;
          return;
        }
        target.resolved += 1;
      });
      const max = Math.max(...buckets.map((item) => Math.max(item.pending, item.resolved)), 1);
      return buckets.map((item) => ({
        ...item,
        pendingHeight: getChartPercent(item.pending, max),
        resolvedHeight: getChartPercent(item.resolved, max)
      }));
    });
    async function loadData() {
      if (!utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      loading.value = true;
      try {
        const [feedbackList, overviewPayload] = await Promise.all([
          services_adminService.getAdminFeedback(),
          services_adminService.getAdminOverview()
        ]);
        feedbacks.value = feedbackList.map((item) => ({ ...item }));
        overview.value = overviewPayload;
      } catch (error) {
        const message = error instanceof Error ? error.message : "反馈数据加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    function applyFeedback(updated) {
      feedbacks.value = feedbacks.value.map((item) => item.id === updated.id ? { ...updated } : item);
    }
    async function toggleFeedbackStatus(item) {
      const nextStatus = item.status === "pending" ? "resolved" : "pending";
      try {
        const updated = await services_adminService.updateAdminFeedback(item.id, {
          status: nextStatus
        });
        applyFeedback(updated);
        common_vendor.index.showToast({
          title: nextStatus === "resolved" ? "已标记处理" : "已重新打开",
          icon: "none"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "反馈状态更新失败";
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
    common_vendor.onShow(loadData);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "反馈与看板",
          back: true
        }),
        b: common_vendor.f(summaryCards.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        }),
        c: common_vendor.f(trendRanges, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: trendRange.value === item.key
            }),
            d: common_vendor.o(($event) => trendRange.value = item.key, item.key)
          };
        }),
        d: overview.value
      }, overview.value ? {
        e: common_vendor.t(overview.value.monitor.todayCalls),
        f: common_vendor.t(overview.value.monitor.successRate),
        g: common_vendor.t(overview.value.monitor.fallbackCount),
        h: common_vendor.t(overview.value.monitor.avgLatencyMs),
        i: common_vendor.t(currentRangeLabel.value),
        j: common_vendor.f(agentTrend.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.value),
            b: item.height,
            c: common_vendor.t(item.label),
            d: `agent-${item.label}`
          };
        }),
        k: getTrendCanvasWidth(agentTrend.value.length)
      } : {}, {
        l: overview.value
      }, overview.value ? {
        m: common_vendor.t(currentRangeLabel.value),
        n: common_vendor.f(orderTrend.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.value),
            b: item.height,
            c: common_vendor.t(item.label),
            d: `order-${item.label}`
          };
        }),
        o: getTrendCanvasWidth(orderTrend.value.length),
        p: common_vendor.t(currentRangeLabel.value),
        q: common_vendor.f(feedbackTrend.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.pending),
            b: common_vendor.t(item.resolved),
            c: item.pendingHeight,
            d: item.resolvedHeight,
            e: common_vendor.t(item.label),
            f: `feedback-${item.label}`
          };
        }),
        r: getTrendCanvasWidth(feedbackTrend.value.length)
      } : {}, {
        s: overview.value
      }, overview.value ? {
        t: common_vendor.f(hotRanking.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.rank),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.sales),
            d: item.width,
            e: common_vendor.t(item.stock),
            f: item.id
          };
        })
      } : {}, {
        v: overview.value
      }, overview.value ? {
        w: common_vendor.f(categoryRanking.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.rank),
            b: common_vendor.t(item.label),
            c: common_vendor.t(item.value),
            d: item.width,
            e: common_vendor.t(item.note),
            f: item.label
          };
        }),
        x: common_vendor.f(afterSaleReasonRanking.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.rank),
            b: common_vendor.t(item.label),
            c: common_vendor.t(item.value),
            d: item.width,
            e: common_vendor.t(item.note),
            f: item.label
          };
        })
      } : {}, {
        y: common_vendor.f(filters, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: currentFilter.value === item.key
            }),
            d: common_vendor.o(($event) => currentFilter.value = item.key, item.key)
          };
        }),
        z: filteredFeedbacks.value.length
      }, filteredFeedbacks.value.length ? {
        A: common_vendor.f(filteredFeedbacks.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.userName),
            b: common_vendor.t(item.productTitle),
            c: common_vendor.t(item.status === "resolved" ? "已处理" : "待跟进"),
            d: `feedback-status-${item.id}-${item.status}`,
            e: common_vendor.n({
              resolved: item.status === "resolved"
            }),
            f: common_vendor.t(item.summary),
            g: common_vendor.t(item.createdAt),
            h: common_vendor.t(item.status === "pending" ? "标记已处理" : "重新打开"),
            i: `feedback-action-${item.id}-${item.status}`,
            j: common_vendor.o(($event) => toggleFeedbackStatus(item), `feedback-action-${item.id}-${item.status}`),
            k: item.id
          };
        })
      } : {
        B: common_vendor.o(goAdminHome),
        C: common_vendor.p({
          title: loading.value ? "反馈加载中" : "当前筛选下暂无反馈",
          desc: loading.value ? "正在准备反馈列表，请稍候。" : "可以切换筛选查看其他处理状态。",
          ["action-text"]: "返回后台"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5be9530b"]]);
wx.createPage(MiniProgramPage);
