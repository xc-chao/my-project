"use strict";
const common_vendor = require("../../common/vendor.js");
const services_addressService = require("../../services/addressService.js");
if (!Math) {
  (AppHeader + AddressCard + EmptyStateCard + FormSection)();
}
const AppHeader = () => "../../components/AppHeader.js";
const AddressCard = () => "../../components/common/AddressCard.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const FormSection = () => "../../components/common/FormSection.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const list = common_vendor.ref([]);
    const editingId = common_vendor.ref("");
    const form = common_vendor.reactive({
      name: "",
      phone: "",
      region: "",
      detail: "",
      isDefault: true
    });
    const submitLabel = common_vendor.computed(() => editingId.value ? "保存地址" : "新增地址");
    function fillForm(item) {
      form.name = (item == null ? void 0 : item.name) || "";
      form.phone = (item == null ? void 0 : item.phone) || "";
      form.region = (item == null ? void 0 : item.region) || "";
      form.detail = (item == null ? void 0 : item.detail) || "";
      form.isDefault = (item == null ? void 0 : item.isDefault) ?? true;
    }
    async function loadList() {
      list.value = await services_addressService.getAddressList();
    }
    async function handleSubmit() {
      if (!form.name || !form.phone || !form.region || !form.detail) {
        common_vendor.index.showToast({
          title: "请完善地址信息",
          icon: "none"
        });
        return;
      }
      if (editingId.value) {
        list.value = await services_addressService.updateAddress(editingId.value, form);
      } else {
        list.value = await services_addressService.createAddress(form);
      }
      editingId.value = "";
      fillForm();
    }
    function handleEdit(id) {
      const target = list.value.find((item) => item.id === id);
      editingId.value = id;
      fillForm(target);
    }
    async function handleDelete(id) {
      list.value = await services_addressService.deleteAddress(id);
      if (editingId.value === id) {
        editingId.value = "";
        fillForm();
      }
    }
    common_vendor.onMounted(async () => {
      await loadList();
      fillForm(list.value.find((item) => item.isDefault) || list.value[0]);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "地址管理",
          back: true
        }),
        b: list.value.length
      }, list.value.length ? {
        c: common_vendor.f(list.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(handleEdit, item.id),
            c: common_vendor.o(handleDelete, item.id),
            d: "15db8353-1-" + i0,
            e: common_vendor.p({
              item
            })
          };
        })
      } : {
        d: common_vendor.p({
          title: "还没有地址",
          desc: "新增一个常用收货地址后，确认订单页会自动带入默认地址。"
        })
      }, {
        e: form.name,
        f: common_vendor.o(($event) => form.name = $event.detail.value),
        g: form.phone,
        h: common_vendor.o(($event) => form.phone = $event.detail.value),
        i: form.region,
        j: common_vendor.o(($event) => form.region = $event.detail.value),
        k: form.detail,
        l: common_vendor.o(($event) => form.detail = $event.detail.value),
        m: common_vendor.n({
          active: form.isDefault
        }),
        n: common_vendor.o(($event) => form.isDefault = !form.isDefault),
        o: common_vendor.t(submitLabel.value),
        p: common_vendor.o(handleSubmit),
        q: common_vendor.p({
          title: "编辑地址",
          desc: "支持新增、修改和设置默认地址"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-15db8353"]]);
wx.createPage(MiniProgramPage);
