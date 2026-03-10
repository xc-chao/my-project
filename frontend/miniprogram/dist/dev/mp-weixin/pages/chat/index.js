"use strict";
const common_vendor = require("../../common/vendor.js");
const services_chatService = require("../../services/chatService.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Math) {
  AppHeader();
}
const AppHeader = () => "../../components/AppHeader.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const sessionId = common_vendor.ref("");
    const productId = common_vendor.ref("");
    const productTitle = common_vendor.ref("当前商品");
    const inputValue = common_vendor.ref("");
    const sending = common_vendor.ref(false);
    const messages = common_vendor.ref([]);
    const quickQuestions = common_vendor.computed(() => [
      "这款商品怎么选尺码？",
      "这款适合日常通勤吗？",
      "多久可以发货？"
    ]);
    async function ensureSession() {
      if (!productId.value || sessionId.value) {
        return;
      }
      const session = await services_chatService.createChatSession(productId.value);
      sessionId.value = session.id;
      messages.value = session.messages;
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
      if (typeof (query == null ? void 0 : query.productId) === "string") {
        productId.value = query.productId;
      }
      if (typeof (query == null ? void 0 : query.title) === "string") {
        productTitle.value = decodeURIComponent(query.title);
      }
      await ensureSession();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "Agent 智能助手",
          back: true
        }),
        b: common_vendor.t(productTitle.value),
        c: common_vendor.f(quickQuestions.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => handleSend(item), item)
          };
        }),
        d: common_vendor.f(messages.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.content),
            b: `${item.role}-${index}`,
            c: common_vendor.n(item.role)
          };
        }),
        e: common_vendor.o(($event) => handleSend()),
        f: inputValue.value,
        g: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        h: common_vendor.t(sending.value ? "发送中" : "发送"),
        i: common_vendor.o(($event) => handleSend())
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da04a0a0"]]);
wx.createPage(MiniProgramPage);
