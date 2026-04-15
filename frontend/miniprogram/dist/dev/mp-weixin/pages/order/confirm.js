"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
const services_orderService = require("../../services/orderService.js");
if (!Math) {
  (AppHeader + AddressCard + FormSection + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const AddressCard = () => "../../components/common/AddressCard.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const FormSection = () => "../../components/common/FormSection.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "confirm",
  setup(__props) {
    const preview = common_vendor.ref(null);
    const remark = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const hasItems = common_vendor.computed(() => {
      var _a;
      return Boolean((_a = preview.value) == null ? void 0 : _a.items.length);
    });
    async function loadPreview() {
      preview.value = await services_orderService.getOrderPreview();
    }
    async function handleSubmit() {
      var _a, _b;
      if (!((_a = preview.value) == null ? void 0 : _a.items.length) || submitting.value) {
        return;
      }
      submitting.value = true;
      try {
        const result = await services_orderService.createOrder({
          addressId: (_b = preview.value.address) == null ? void 0 : _b.id,
          remark: remark.value
        });
        common_vendor.index.showToast({
          title: "订单已提交",
          icon: "success"
        });
        common_vendor.index.redirectTo({
          url: `/pages/order/list?highlight=${result.id}`
        });
      } finally {
        submitting.value = false;
      }
    }
    function goAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/address/index"
      });
    }
    function goCart() {
      common_vendor.index.switchTab({
        url: "/pages/cart/index"
      });
    }
    common_vendor.onMounted(loadPreview);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "确认订单",
          back: true
        }),
        b: hasItems.value && preview.value
      }, hasItems.value && preview.value ? common_vendor.e({
        c: common_vendor.unref(constants_pageImageMap.pageImageMap).orderConfirm.banner,
        d: common_vendor.unref(constants_pageImageMap.pageImageMap).orderConfirm.accent,
        e: preview.value.address
      }, preview.value.address ? {
        f: common_vendor.p({
          item: preview.value.address,
          compact: true
        })
      } : {}, {
        g: common_vendor.o(goAddress),
        h: common_vendor.p({
          title: "收货地址",
          desc: "默认地址会自动带入，也可在地址管理中调整"
        }),
        i: common_vendor.f(preview.value.items, (item, k0, i0) => {
          var _a, _b, _c;
          return {
            a: (_a = item.product) == null ? void 0 : _a.cover,
            b: common_vendor.t((_b = item.product) == null ? void 0 : _b.title),
            c: common_vendor.t(item.size),
            d: common_vendor.t(item.quantity),
            e: common_vendor.t((_c = item.product) == null ? void 0 : _c.price),
            f: item.id
          };
        }),
        j: common_vendor.p({
          title: "商品清单",
          desc: "来自购物车的待结算商品"
        }),
        k: common_vendor.t(preview.value.summary.goodsAmount),
        l: common_vendor.t(preview.value.summary.shippingFee),
        m: common_vendor.t(preview.value.summary.discountAmount),
        n: common_vendor.p({
          title: "配送与优惠",
          desc: "当前使用标准快递与新人优惠"
        }),
        o: remark.value,
        p: common_vendor.o(($event) => remark.value = $event.detail.value),
        q: common_vendor.p({
          title: "订单备注"
        })
      }) : {
        r: common_vendor.o(goCart),
        s: common_vendor.p({
          title: "当前没有待结算商品",
          desc: "先去首页浏览商品或回到购物车添加商品后，再继续下单。",
          ["action-text"]: "返回购物车"
        })
      }, {
        t: hasItems.value && preview.value
      }, hasItems.value && preview.value ? {
        v: common_vendor.t(preview.value.summary.payableAmount),
        w: common_vendor.t(submitting.value ? "提交中" : "提交订单"),
        x: common_vendor.o(handleSubmit)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-36cb8dad"]]);
wx.createPage(MiniProgramPage);
