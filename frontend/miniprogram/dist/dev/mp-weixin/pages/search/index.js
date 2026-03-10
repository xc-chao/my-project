"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
if (!Math) {
  (AppHeader + ProductCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const ProductCard = () => "../../components/ProductCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    async function loadSearch() {
      loading.value = true;
      try {
        if (!keyword.value.trim()) {
          const result2 = await services_productService.getProductList();
          list.value = result2.list;
          return;
        }
        const result = await services_productService.searchProducts(keyword.value);
        list.value = result.list;
      } finally {
        loading.value = false;
      }
    }
    function openDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${id}`
      });
    }
    common_vendor.onLoad((query) => {
      if (typeof (query == null ? void 0 : query.keyword) === "string") {
        keyword.value = decodeURIComponent(query.keyword);
      }
      loadSearch();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "搜索结果",
          back: true
        }),
        b: common_vendor.o(loadSearch),
        c: keyword.value,
        d: common_vendor.o(($event) => keyword.value = $event.detail.value),
        e: common_vendor.o(loadSearch),
        f: common_vendor.t(keyword.value || "推荐"),
        g: common_vendor.t(list.value.length),
        h: list.value.length
      }, list.value.length ? {
        i: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => openDetail(item.id), item.id),
            c: "308a4d57-1-" + i0,
            d: common_vendor.p({
              item
            })
          };
        })
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-308a4d57"]]);
wx.createPage(MiniProgramPage);
