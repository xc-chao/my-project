"use strict";
const common_vendor = require("../../common/vendor.js");
const services_adminService = require("../../services/adminService.js");
const store_modules_user = require("../../store/modules/user.js");
const utils_admin = require("../../utils/admin.js");
if (!Math) {
  (AppHeader + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "products",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const loading = common_vendor.ref(false);
    const products = common_vendor.ref([]);
    const currentFilter = common_vendor.ref("all");
    const filters = [
      { key: "all", label: "全部商品" },
      { key: "on_sale", label: "在售" },
      { key: "low_stock", label: "低库存" },
      { key: "off_shelf", label: "已下架" }
    ];
    const summaryCards = common_vendor.computed(() => {
      const onSaleCount = products.value.filter((item) => getSaleStatus(item) === "on_sale").length;
      const lowStockCount = products.value.filter((item) => item.stock <= 20).length;
      return [
        { label: "商品总数", value: `${products.value.length}` },
        { label: "在售商品", value: `${onSaleCount}` },
        { label: "低库存", value: `${lowStockCount}` }
      ];
    });
    const filteredProducts = common_vendor.computed(() => {
      if (currentFilter.value === "all") {
        return products.value;
      }
      if (currentFilter.value === "low_stock") {
        return products.value.filter((item) => item.stock <= 20);
      }
      return products.value.filter((item) => getSaleStatus(item) === currentFilter.value);
    });
    function getSaleStatus(item) {
      return item.saleStatus || "on_sale";
    }
    function getSaleStatusLabel(item) {
      return getSaleStatus(item) === "on_sale" ? "在售中" : "已下架";
    }
    function applyProduct(updated) {
      const index = products.value.findIndex((item) => item.id === updated.id);
      if (index > -1) {
        products.value[index] = updated;
      }
    }
    async function loadProducts() {
      if (!utils_admin.ensureAdminPageAccess(userStore.isAdmin)) {
        return;
      }
      loading.value = true;
      try {
        products.value = await services_adminService.getAdminProducts();
      } catch (error) {
        const message = error instanceof Error ? error.message : "商品数据加载失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    }
    async function toggleProductStatus(item) {
      const nextStatus = getSaleStatus(item) === "on_sale" ? "off_shelf" : "on_sale";
      try {
        const updated = await services_adminService.updateAdminProduct(item.id, {
          saleStatus: nextStatus
        });
        applyProduct(updated);
        common_vendor.index.showToast({
          title: nextStatus === "on_sale" ? "已上架" : "已下架",
          icon: "none"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "商品状态更新失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      }
    }
    async function replenishStock(item) {
      try {
        const updated = await services_adminService.updateAdminProduct(item.id, {
          stock: item.stock + 10
        });
        applyProduct(updated);
        common_vendor.index.showToast({
          title: "库存 +10",
          icon: "none"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "库存更新失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      }
    }
    function openDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${id}`
      });
    }
    function openCreate() {
      common_vendor.index.navigateTo({
        url: "/pages/admin/product-form"
      });
    }
    function openEdit(id) {
      common_vendor.index.navigateTo({
        url: `/pages/admin/product-form?id=${id}`
      });
    }
    function goAdminHome() {
      common_vendor.index.redirectTo({
        url: "/pages/admin/index"
      });
    }
    common_vendor.onShow(loadProducts);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "商品管理",
          back: true
        }),
        b: common_vendor.o(openCreate),
        c: common_vendor.f(summaryCards.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        }),
        d: common_vendor.f(filters, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.key,
            c: common_vendor.n({
              active: currentFilter.value === item.key
            }),
            d: common_vendor.o(($event) => currentFilter.value = item.key, item.key)
          };
        }),
        e: filteredProducts.value.length
      }, filteredProducts.value.length ? {
        f: common_vendor.f(filteredProducts.value, (item, k0, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.subtitle),
            d: common_vendor.t(getSaleStatusLabel(item)),
            e: common_vendor.n({
              off: getSaleStatus(item) === "off_shelf"
            }),
            f: common_vendor.t(item.category),
            g: common_vendor.t(item.stock),
            h: common_vendor.n({
              warn: item.stock <= 20
            }),
            i: common_vendor.t(item.sales),
            j: common_vendor.t(item.price),
            k: common_vendor.t(item.originalPrice),
            l: common_vendor.o(($event) => openEdit(item.id), item.id),
            m: common_vendor.o(($event) => replenishStock(item), item.id),
            n: common_vendor.t(getSaleStatus(item) === "on_sale" ? "下架" : "上架"),
            o: common_vendor.o(($event) => toggleProductStatus(item), item.id),
            p: item.id,
            q: common_vendor.o(($event) => openDetail(item.id), item.id)
          };
        })
      } : {
        g: common_vendor.o(goAdminHome),
        h: common_vendor.p({
          title: loading.value ? "商品加载中" : "当前筛选下暂无商品",
          desc: loading.value ? "正在准备管理列表，请稍候。" : "可以切换筛选查看其他商品状态。",
          ["action-text"]: "返回后台"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-43fdcc37"]]);
wx.createPage(MiniProgramPage);
