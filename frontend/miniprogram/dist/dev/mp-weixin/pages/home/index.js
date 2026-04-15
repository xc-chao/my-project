"use strict";
const common_vendor = require("../../common/vendor.js");
const services_productService = require("../../services/productService.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
const utils_productSearch = require("../../utils/product-search.js");
if (!Math) {
  (UniIcons + ProductCard + PillTabBar)();
}
const UniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const ProductCard = () => "../../components/ProductCard.js";
const PillTabBar = () => "../../components/PillTabBar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const products = common_vendor.ref([]);
    const heroSlides = constants_pageImageMap.pageImageMap.home.carousel;
    const currentHeroIndex = common_vendor.ref(0);
    const agentX = common_vendor.ref(0);
    const agentY = common_vendor.ref(0);
    const currentHero = common_vendor.computed(() => {
      return heroSlides[currentHeroIndex.value] || heroSlides[0];
    });
    const metricCards = common_vendor.computed(() => {
      return [
        {
          value: "48h",
          label: "限定上新",
          desc: "暖色精选轮换陈列",
          filterKey: "newIn48h"
        },
        {
          value: "95%",
          label: "买手好评",
          desc: "球鞋与服饰稳定回购",
          filterKey: "buyerFavorite"
        },
        {
          value: `${products.value.length}`,
          label: "首页在列",
          desc: "连续浏览整组单品",
          filterKey: "all"
        }
      ];
    });
    async function loadData() {
      loading.value = true;
      try {
        const result = await services_productService.getProductList();
        products.value = result.list.slice(0, 50);
      } finally {
        loading.value = false;
      }
    }
    function openDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${id}`
      });
    }
    function openHeroDetail(productId) {
      if (!productId) {
        return;
      }
      openDetail(productId);
    }
    function openSearch() {
      openSearchWithPreset();
    }
    function openSearchWithPreset(preset = {}) {
      utils_productSearch.saveSearchPreset({
        keyword: "",
        sort: "comprehensive",
        filterKey: "all",
        ...preset
      });
      common_vendor.index.switchTab({
        url: "/pages/search/index"
      });
    }
    function openMetricSearch(filterKey) {
      openSearchWithPreset({
        filterKey
      });
    }
    function openAgent() {
      common_vendor.index.navigateTo({
        url: "/pages/chat/index?productId=p_001&title=%E6%99%BA%E8%83%BD%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B"
      });
    }
    function handleHeroChange(event) {
      currentHeroIndex.value = event.detail.current;
    }
    function initAgentPosition() {
      const { windowWidth, windowHeight } = common_vendor.index.getSystemInfoSync();
      const fabWidth = 64;
      const fabHeight = 64;
      const sideGap = 18;
      const bottomGap = 112;
      agentX.value = Math.max(windowWidth - fabWidth - sideGap, sideGap);
      agentY.value = Math.max(windowHeight - fabHeight - bottomGap, 160);
    }
    common_vendor.onMounted(() => {
      initAgentPosition();
      loadData();
    });
    common_vendor.onShow(() => {
      common_vendor.index.hideTabBar();
      initAgentPosition();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "search",
          size: 14,
          color: "#ffffff"
        }),
        b: common_vendor.o(openSearch),
        c: common_vendor.o(openSearch),
        d: common_vendor.t(currentHero.value.title),
        e: common_vendor.t(currentHero.value.desc),
        f: common_vendor.t(currentHero.value.badge),
        g: common_vendor.f(common_vendor.unref(heroSlides), (item, k0, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => openHeroDetail(item.productId), item.image),
            c: item.image
          };
        }),
        h: currentHeroIndex.value,
        i: common_vendor.o(handleHeroChange),
        j: common_vendor.f(common_vendor.unref(heroSlides), (_, index, i0) => {
          return {
            a: index,
            b: common_vendor.n({
              active: index === currentHeroIndex.value
            })
          };
        }),
        k: common_vendor.t(currentHeroIndex.value + 1),
        l: common_vendor.t(common_vendor.unref(heroSlides).length),
        m: common_vendor.f(metricCards.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.value),
            b: common_vendor.t(item.label),
            c: common_vendor.t(item.desc),
            d: item.label,
            e: common_vendor.o(($event) => openMetricSearch(item.filterKey), item.label)
          };
        }),
        n: common_vendor.o(openSearch),
        o: common_vendor.f(products.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => openDetail(item.id), item.id),
            c: "2c5296db-1-" + i0,
            d: common_vendor.p({
              item
            })
          };
        }),
        p: common_vendor.p({
          type: "chat",
          size: 24,
          color: "#ffffff"
        }),
        q: common_vendor.o(openAgent),
        r: agentX.value,
        s: agentY.value,
        t: common_vendor.p({
          current: "home"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2c5296db"]]);
wx.createPage(MiniProgramPage);
