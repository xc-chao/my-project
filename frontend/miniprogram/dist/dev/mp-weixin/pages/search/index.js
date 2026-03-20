"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
const mock_pageImageMap = require("../../mock/page-image-map.js");
if (!Math) {
  (ProductCard + EmptyStateCard + PillTabBar)();
}
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const PillTabBar = () => "../../components/PillTabBar.js";
const ProductCard = () => "../../components/ProductCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const filters = ["综合", "价格", "筛选"];
    const currentFilter = common_vendor.ref("综合");
    const inspirationCards = mock_pageImageMap.pageImageMap.search.inspiration;
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
    function goHome() {
      common_vendor.index.switchTab({
        url: "/pages/home/index"
      });
    }
    common_vendor.onLoad((query) => {
      if (typeof (query == null ? void 0 : query.keyword) === "string") {
        keyword.value = decodeURIComponent(query.keyword);
      }
      loadSearch();
    });
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
      if (!list.value.length) {
        loadSearch();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(keyword.value || "Jordan 1"),
        b: common_vendor.t(list.value.length || 2184),
        c: common_vendor.o(loadSearch),
        d: keyword.value,
        e: common_vendor.o(($event) => keyword.value = $event.detail.value),
        f: common_vendor.o(loadSearch),
        g: common_vendor.f(filters, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.n({
              active: currentFilter.value === item
            }),
            d: common_vendor.o(($event) => currentFilter.value = item, item)
          };
        }),
        h: common_vendor.f(common_vendor.unref(inspirationCards), (item, k0, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title
          };
        }),
        i: list.value.length
      }, list.value.length ? {
        j: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => openDetail(item.id), item.id),
            c: "308a4d57-0-" + i0,
            d: common_vendor.p({
              item
            })
          };
        })
      } : {
        k: common_vendor.o(goHome),
        l: common_vendor.p({
          title: "暂无匹配商品",
          desc: "可以尝试更换关键词，或者返回首页查看推荐商品。",
          ["action-text"]: "回首页"
        })
      }, {
        m: common_vendor.p({
          current: "search"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-308a4d57"]]);
wx.createPage(MiniProgramPage);
