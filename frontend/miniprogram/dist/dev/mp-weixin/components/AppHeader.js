"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AppHeader",
  props: {
    title: {},
    back: { type: Boolean, default: false },
    darkAction: { default: "" },
    actionPath: { default: "" }
  },
  setup(__props) {
    const props = __props;
    function handleBack() {
      if (getCurrentPages().length > 1) {
        common_vendor.index.navigateBack();
        return;
      }
      common_vendor.index.switchTab({
        url: "/pages/home/index"
      });
    }
    function handleAction() {
      if (!props.actionPath) {
        return;
      }
      common_vendor.index.navigateTo({
        url: props.actionPath
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.back
      }, props.back ? {} : {}, {
        b: common_vendor.o(($event) => props.back ? handleBack() : void 0),
        c: common_vendor.t(props.title),
        d: common_vendor.t(props.darkAction),
        e: common_vendor.n({
          dark: props.darkAction
        }),
        f: common_vendor.o(handleAction)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-48a13218"]]);
wx.createComponent(Component);
