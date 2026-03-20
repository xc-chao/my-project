"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
const mock_pageImageMap = require("../../mock/page-image-map.js");
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
    const heroShots = [
      mock_pageImageMap.pageImageMap.home.heroPrimary,
      mock_pageImageMap.pageImageMap.home.heroSecondary,
      mock_pageImageMap.pageImageMap.home.heroAccent
    ];
    async function loadData() {
      loading.value = true;
      try {
        const result = await services_productService.getProductList();
        console.log("result", result);
        products.value = result.list;
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
      common_vendor.index.switchTab({
        url: "/pages/search/index"
      });
    }
    function openAgent() {
      common_vendor.index.navigateTo({
        url: "/pages/chat/index?productId=p_001&title=%E6%99%BA%E8%83%BD%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B"
      });
    }
    common_vendor.onMounted(loadData);
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(openSearch),
        b: heroShots[0],
        c: heroShots[1],
        d: heroShots[2],
        e: common_vendor.o(openSearch),
        f: common_vendor.f(products.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => openDetail(item.id), item.id),
            c: "2c5296db-0-" + i0,
            d: common_vendor.p({
              item
            })
          };
        }),
        g: common_vendor.o(openAgent),
        h: common_vendor.p({
          current: "home"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2c5296db"]]);
wx.createPage(MiniProgramPage);
