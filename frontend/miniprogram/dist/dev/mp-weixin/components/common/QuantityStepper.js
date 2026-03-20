"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "QuantityStepper",
  props: {
    modelValue: {},
    min: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function update(next) {
      emit("update:modelValue", Math.max(props.min || 1, next));
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => update(_ctx.modelValue - 1)),
        b: common_vendor.t(_ctx.modelValue),
        c: common_vendor.o(($event) => update(_ctx.modelValue + 1))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f9120129"]]);
wx.createComponent(Component);
