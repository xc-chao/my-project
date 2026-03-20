"use strict";
const common_vendor = require("../../common/vendor.js");
const services_chatService = require("../../services/chatService.js");
const store_modules_user = require("../../store/modules/user.js");
require("../../mock/data.js");
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
    const quickQuestions = common_vendor.computed(() => [
      "这款商品怎么选尺码？",
      "这款适合日常通勤吗？",
      "多久可以发货？"
    ]);
    async function ensureSession() {
      if (mode.value === "history" || !productId.value || sessionId.value) {
        return;
      }
      const session = await services_chatService.createChatSession(productId.value);
      sessionId.value = session.id;
      messages.value = session.messages;
    }
    async function loadHistory() {
      history.value = await services_chatService.getChatHistory();
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
      if (!userStore.isLoggedIn) {
        common_vendor.index.redirectTo({
          url: "/pages/auth/login"
        });
        return;
      }
      if ((query == null ? void 0 : query.mode) === "history") {
        mode.value = "history";
      }
      if (typeof (query == null ? void 0 : query.productId) === "string") {
        productId.value = query.productId;
      }
      if (typeof (query == null ? void 0 : query.title) === "string") {
        productTitle.value = decodeURIComponent(query.title);
      }
      if (mode.value === "history") {
        await loadHistory();
        return;
      }
      await ensureSession();
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
            a: common_vendor.t(item.title),
            b: common_vendor.t(((_a = item.messages[item.messages.length - 1]) == null ? void 0 : _a.content) || "暂无消息"),
            c: item.id
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
