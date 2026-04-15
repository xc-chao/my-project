"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
const utils_productSearch = require("../../utils/product-search.js");
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
    const initialized = common_vendor.ref(false);
    const sort = common_vendor.ref("comprehensive");
    const filterKey = common_vendor.ref("all");
    constants_pageImageMap.pageImageMap.search.inspiration;
    const filterOptions = [
      { key: "all", label: "全部商品" },
      { key: "newIn48h", label: "48h 上新" },
      { key: "buyerFavorite", label: "买手好评" },
      { key: "onSale", label: "仅看在售" },
      { key: "categoryShoes", label: "鞋靴" },
      { key: "categoryClothes", label: "服饰" },
      { key: "categoryAccessories", label: "配件" }
    ];
    const filterPills = common_vendor.computed(() => {
      return [
        {
          key: "comprehensive",
          label: "综合",
          active: sort.value === "comprehensive"
        },
        {
          key: "price",
          label: sort.value === "priceAsc" ? "价格↑" : sort.value === "priceDesc" ? "价格↓" : "价格",
          active: sort.value === "priceAsc" || sort.value === "priceDesc"
        },
        {
          key: "filter",
          label: utils_productSearch.getSearchFilterLabel(filterKey.value),
          active: filterKey.value !== "all"
        }
      ];
    });
    common_vendor.computed(() => {
      const tags = [];
      if (sort.value === "priceAsc") {
        tags.push("价格升序");
      } else if (sort.value === "priceDesc") {
        tags.push("价格降序");
      }
      if (filterKey.value !== "all") {
        tags.push(utils_productSearch.getSearchFilterLabel(filterKey.value));
      }
      return tags;
    });
    const resultTitle = common_vendor.computed(() => {
      const normalizedKeyword = keyword.value.trim();
      if (normalizedKeyword) {
        return normalizedKeyword;
      }
      return filterKey.value === "all" ? "全部商品" : utils_productSearch.getSearchFilterLabel(filterKey.value);
    });
    function applySearchPreset(preset) {
      keyword.value = preset.keyword || "";
      sort.value = preset.sort || "comprehensive";
      filterKey.value = preset.filterKey || "all";
    }
    async function loadSearch() {
      loading.value = true;
      try {
        const result = await services_productService.getProductList({
          keyword: keyword.value.trim(),
          sort: sort.value,
          ...utils_productSearch.resolveSearchFilterQuery(filterKey.value)
        });
        list.value = result.list;
      } finally {
        loading.value = false;
        initialized.value = true;
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
    function resetToComprehensive() {
      if (sort.value === "comprehensive") {
        return;
      }
      sort.value = "comprehensive";
      loadSearch();
    }
    function togglePriceSort() {
      sort.value = sort.value === "priceAsc" ? "priceDesc" : "priceAsc";
      loadSearch();
    }
    function openFilterSheet() {
      common_vendor.index.showActionSheet({
        itemList: filterOptions.map((item) => item.label),
        success: (result) => {
          const next = filterOptions[result.tapIndex];
          if (!next) {
            return;
          }
          filterKey.value = next.key;
          loadSearch();
        },
        fail: () => {
        }
      });
    }
    function handlePillTap(key) {
      if (key === "comprehensive") {
        resetToComprehensive();
        return;
      }
      if (key === "price") {
        togglePriceSort();
        return;
      }
      openFilterSheet();
    }
    common_vendor.onLoad((query) => {
      if (typeof (query == null ? void 0 : query.keyword) === "string") {
        keyword.value = decodeURIComponent(query.keyword);
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
      const preset = utils_productSearch.consumeSearchPreset();
      if (preset) {
        applySearchPreset(preset);
        loadSearch();
        return;
      }
      if (!initialized.value) {
        loadSearch();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(loadSearch),
        b: keyword.value,
        c: common_vendor.o(($event) => keyword.value = $event.detail.value),
        d: common_vendor.o(loadSearch),
        e: common_vendor.f(filterPills.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: item.active
            }),
            d: common_vendor.o(($event) => handlePillTap(item.key), item.key)
          };
        }),
        f: common_vendor.t(resultTitle.value),
        g: common_vendor.t(list.value.length),
        h: list.value.length
      }, list.value.length ? {
        i: common_vendor.f(list.value, (item, k0, i0) => {
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
        j: common_vendor.o(goHome),
        k: common_vendor.p({
          title: "暂无匹配商品",
          desc: "可以尝试更换关键词，或者返回首页查看推荐商品。",
          ["action-text"]: "回首页"
        })
      }, {
        l: common_vendor.p({
          current: "search"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-308a4d57"]]);
wx.createPage(MiniProgramPage);
