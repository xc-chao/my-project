"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_data = require("../../mock/data.js");
const mock_pageImageMap = require("../../mock/page-image-map.js");
const services_afterSaleService = require("../../services/afterSaleService.js");
if (!Math) {
  (AppHeader + FormSection + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const FormSection = () => "../../components/common/FormSection.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const list = common_vendor.ref([]);
    const form = common_vendor.reactive({
      orderId: "",
      productTitle: "",
      reason: ""
    });
    const hasSeedData = common_vendor.computed(() => Boolean(list.value.length));
    async function loadList() {
      list.value = await services_afterSaleService.getAfterSaleList();
    }
    async function handleSubmit() {
      if (!form.orderId || !form.productTitle || !form.reason) {
        common_vendor.index.showToast({
          title: "请补全售后信息",
          icon: "none"
        });
        return;
      }
      const created = await services_afterSaleService.createAfterSale(form);
      list.value = [created, ...list.value];
      form.reason = "";
      common_vendor.index.showToast({
        title: "提交成功",
        icon: "success"
      });
    }
    function formatStatus(status) {
      return {
        submitted: "已提交",
        reviewing: "审核中",
        approved: "已通过",
        rejected: "已驳回"
      }[status] || status;
    }
    function getProductCover(title) {
      var _a;
      return ((_a = mock_data.mockProducts.find((item) => item.title === title)) == null ? void 0 : _a.cover) || mock_pageImageMap.pageImageMap.afterSale.accent;
    }
    common_vendor.onLoad((query) => {
      if (typeof (query == null ? void 0 : query.orderId) === "string") {
        form.orderId = query.orderId;
      }
      if (typeof (query == null ? void 0 : query.productTitle) === "string") {
        form.productTitle = decodeURIComponent(query.productTitle);
      }
    });
    common_vendor.onMounted(loadList);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "售后申请",
          back: true
        }),
        b: common_vendor.unref(mock_pageImageMap.pageImageMap).afterSale.banner,
        c: common_vendor.unref(mock_pageImageMap.pageImageMap).afterSale.accent,
        d: form.orderId,
        e: common_vendor.o(($event) => form.orderId = $event.detail.value),
        f: form.productTitle,
        g: common_vendor.o(($event) => form.productTitle = $event.detail.value),
        h: form.reason,
        i: common_vendor.o(($event) => form.reason = $event.detail.value),
        j: common_vendor.o(handleSubmit),
        k: common_vendor.p({
          title: "发起申请",
          desc: "支持填写订单号、商品名称与售后原因"
        }),
        l: hasSeedData.value
      }, hasSeedData.value ? {
        m: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: getProductCover(item.productTitle),
            b: common_vendor.t(item.productTitle),
            c: common_vendor.t(formatStatus(item.status)),
            d: common_vendor.t(item.orderId),
            e: common_vendor.t(item.reason),
            f: item.id
          };
        })
      } : {
        n: common_vendor.p({
          title: "暂无售后记录",
          desc: "提交售后申请后，会在这里看到审核进度与结果。"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c265f4cf"]]);
wx.createPage(MiniProgramPage);
