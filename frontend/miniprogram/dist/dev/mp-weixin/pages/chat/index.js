"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
const services_chatService = require("../../services/chatService.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Math) {
  (AppHeader + ChatBubble + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const ChatBubble = () => "../../components/common/ChatBubble.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const mode = common_vendor.ref("chat");
    const sessionId = common_vendor.ref("");
    const productId = common_vendor.ref("");
    const productTitle = common_vendor.ref("当前商品");
    const inputValue = common_vendor.ref("");
    const sending = common_vendor.ref(false);
    const messages = common_vendor.ref([]);
    const history = common_vendor.ref([]);
    const routeKey = common_vendor.ref("");
    const initialized = common_vendor.ref(false);
    let initTaskId = 0;
    const quickQuestions = common_vendor.computed(() => [
      "这款商品怎么选尺码？",
      "这款适合日常通勤吗？",
      "多久可以发货？"
    ]);
    function getHistoryThumb(session) {
      return session.productCover || constants_pageImageMap.pageImageMap.chat.historyThumb;
    }
    function decodeTitle(title) {
      if (typeof title !== "string" || !title) {
        return "";
      }
      try {
        return decodeURIComponent(title);
      } catch (_error) {
        return title;
      }
    }
    function normalizeQuery(query) {
      const nextMode = (query == null ? void 0 : query.mode) === "history" ? "history" : "chat";
      const nextTitle = decodeTitle(query == null ? void 0 : query.title) || (nextMode === "history" ? "咨询记录" : "当前商品");
      return {
        mode: nextMode,
        productId: typeof (query == null ? void 0 : query.productId) === "string" ? query.productId : "",
        title: nextTitle
      };
    }
    function buildRouteKey(query) {
      return `${query.mode}|${query.productId}|${query.title}`;
    }
    function resetPageState(query) {
      mode.value = query.mode;
      sessionId.value = "";
      productId.value = query.productId;
      productTitle.value = query.title;
      inputValue.value = "";
      sending.value = false;
      messages.value = [];
      history.value = [];
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
    async function ensureSession(taskId) {
      if (mode.value === "history" || !productId.value || sessionId.value) {
        return;
      }
      const session = await services_chatService.createChatSession(productId.value);
      if (taskId !== initTaskId) {
        return;
      }
      sessionId.value = session.id;
      messages.value = session.messages;
    }
    async function loadHistory(taskId) {
      const nextHistory = await services_chatService.getChatHistory();
      if (taskId !== initTaskId) {
        return;
      }
      history.value = nextHistory;
    }
    async function initializePage(rawQuery, options = {}) {
      if (!userStore.isLoggedIn) {
        common_vendor.index.redirectTo({
          url: "/pages/auth/login"
        });
        return;
      }
      const nextQuery = normalizeQuery(rawQuery);
      const nextKey = buildRouteKey(nextQuery);
      const sameRoute = routeKey.value === nextKey;
      if (!sameRoute) {
        resetPageState(nextQuery);
        routeKey.value = nextKey;
      }
      const taskId = ++initTaskId;
      if (nextQuery.mode === "history") {
        if (!sameRoute || options.refreshHistory) {
          await loadHistory(taskId);
        }
        initialized.value = true;
        return;
      }
      if (!sameRoute) {
        productTitle.value = nextQuery.title;
        productId.value = nextQuery.productId;
      }
      if (sameRoute && sessionId.value) {
        initialized.value = true;
        return;
      }
      await ensureSession(taskId);
      initialized.value = true;
    }
    async function handleSend(question) {
      const finalQuestion = (question || inputValue.value).trim();
      if (!finalQuestion || !sessionId.value) {
        return;
      }
      sending.value = true;
      try {
        const result = await services_chatService.sendChatMessage(sessionId.value, finalQuestion);
        messages.value = result.messages;
        inputValue.value = "";
      } finally {
        sending.value = false;
      }
    }
    common_vendor.onLoad(async (query) => {
      await initializePage(query);
    });
    common_vendor.onShow(() => {
      if (!initialized.value) {
        return;
      }
      void initializePage(getCurrentPageQuery(), {
        refreshHistory: true
      });
    });
    function handleH5HashChange() {
      if (typeof window === "undefined" || !window.location.hash.includes("/pages/chat/index")) {
        return;
      }
      void initializePage(getH5Query(), {
        refreshHistory: true
      });
    }
    common_vendor.onMounted(() => {
      if (typeof window === "undefined") {
        return;
      }
      window.addEventListener("hashchange", handleH5HashChange);
    });
    common_vendor.onUnmounted(() => {
      if (typeof window === "undefined") {
        return;
      }
      window.removeEventListener("hashchange", handleH5HashChange);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "Agent 智能助手",
          back: true
        }),
        b: common_vendor.t(mode.value === "history" ? "会话记录" : "商品上下文已接入"),
        c: common_vendor.t(productTitle.value),
        d: common_vendor.t(mode.value === "history" ? "这里展示你最近的 AI 咨询会话摘要。" : "你可以直接提问尺码、材质、物流、售后政策，AI 会结合当前商品信息回答。"),
        e: mode.value === "chat"
      }, mode.value === "chat" ? {
        f: common_vendor.f(quickQuestions.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => handleSend(item), item)
          };
        })
      } : {}, {
        g: mode.value === "chat"
      }, mode.value === "chat" ? {
        h: common_vendor.f(messages.value, (item, index, i0) => {
          return {
            a: `${item.role}-${index}`,
            b: "da04a0a0-1-" + i0,
            c: common_vendor.p({
              role: item.role,
              content: item.content
            })
          };
        })
      } : common_vendor.e({
        i: history.value.length
      }, history.value.length ? {
        j: common_vendor.f(history.value, (item, k0, i0) => {
          var _a;
          return {
            a: getHistoryThumb(item),
            b: common_vendor.t(item.title),
            c: common_vendor.t(((_a = item.messages[item.messages.length - 1]) == null ? void 0 : _a.content) || "暂无消息"),
            d: item.id
          };
        })
      } : {
        k: common_vendor.p({
          title: "还没有 AI 咨询记录",
          desc: "从首页或商品详情进入 AI 助手提问后，会在这里看到最近的会话摘要。"
        })
      }), {
        l: mode.value === "chat"
      }, mode.value === "chat" ? {
        m: common_vendor.o(($event) => handleSend()),
        n: inputValue.value,
        o: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        p: common_vendor.t(sending.value ? "发送中" : "发送"),
        q: common_vendor.o(($event) => handleSend())
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da04a0a0"]]);
wx.createPage(MiniProgramPage);
