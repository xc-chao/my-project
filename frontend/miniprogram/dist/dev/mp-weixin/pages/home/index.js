"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
if (!Math) {
  (ProductCard + PillTabBar)();
}
const ProductCard = () => "../../components/ProductCard.js";
const PillTabBar = () => "../../components/PillTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const products = common_vendor.ref([]);
    const categories = common_vendor.ref([]);
    const currentCategory = common_vendor.ref("推荐");
    const filteredProducts = common_vendor.computed(() => {
      if (currentCategory.value === "推荐") {
        return products.value;
      }
      return products.value.filter((item) => item.category === currentCategory.value);
    });
    async function loadData() {
      loading.value = true;
      try {
        const result = await services_productService.getProductList();
        products.value = result.list;
        categories.value = result.categories;
      } finally {
        loading.value = false;
      }
    }
    function openDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${id}`
      });
    }
    function openSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/index"
      });
    }
    common_vendor.onMounted(loadData);
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(openSearch),
        b: common_vendor.f(["推荐", ...categories.value], (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.n({
              active: currentCategory.value === item
            }),
            d: common_vendor.o(($event) => currentCategory.value = item, item)
          };
        }),
        c: common_vendor.o(openSearch),
        d: common_vendor.f(filteredProducts.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => openDetail(item.id), item.id),
            c: "2c5296db-0-" + i0,
            d: common_vendor.p({
              item
            })
          };
        }),
        e: common_vendor.p({
          current: "home"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2c5296db"]]);
wx.createPage(MiniProgramPage);
