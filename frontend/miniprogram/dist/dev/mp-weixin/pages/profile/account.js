"use strict";
const common_vendor = require("../../common/vendor.js");
const constants_pageImageMap = require("../../constants/page-image-map.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Math) {
  (AppHeader + FormSection + EmptyStateCard)();
}
const AppHeader = () => "../../components/AppHeader.js";
const EmptyStateCard = () => "../../components/common/EmptyStateCard.js";
const FormSection = () => "../../components/common/FormSection.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "account",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const saving = common_vendor.ref(false);
    const choosingAvatar = common_vendor.ref(false);
    const heroImage = constants_pageImageMap.pageImageMap.profile.banner;
    const avatarOptions = constants_pageImageMap.assetCatalog.avatars.featured.slice(0, 8);
    const roleOptions = [
      {
        key: "user",
        label: "普通用户",
        desc: "浏览商品、下单、售后与 AI 咨询"
      },
      {
        key: "admin",
        label: "管理员",
        desc: "额外开放后台信息管理与运营看板"
      }
    ];
    const form = common_vendor.reactive({
      nickname: "",
      avatar: constants_pageImageMap.pageImageMap.profile.avatar,
      role: "user"
    });
    const profile = common_vendor.computed(() => userStore.profile);
    const currentRoleDesc = common_vendor.computed(() => {
      return form.role === "admin" ? "已开启后台管理权限入口" : "当前为普通用户消费视角";
    });
    const isAlbumAvatar = common_vendor.computed(() => !avatarOptions.includes(form.avatar));
    function syncForm() {
      if (!userStore.profile) {
        return;
      }
      form.nickname = userStore.profile.nickname;
      form.avatar = userStore.profile.avatar || constants_pageImageMap.pageImageMap.profile.avatar;
      form.role = userStore.profile.role;
    }
    function ensureLoginAccess() {
      if (userStore.profile) {
        syncForm();
        return true;
      }
      return false;
    }
    function goLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/auth/login"
      });
    }
    function chooseImageFromAlbum() {
      return new Promise((resolve, reject) => {
        common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album"],
          success: (result) => resolve(result),
          fail: (error) => reject(error)
        });
      });
    }
    async function handleChooseAlbumAvatar() {
      var _a;
      choosingAvatar.value = true;
      try {
        const result = await chooseImageFromAlbum();
        const nextAvatar = (_a = result.tempFilePaths) == null ? void 0 : _a[0];
        if (!nextAvatar) {
          common_vendor.index.showToast({
            title: "未选择图片",
            icon: "none"
          });
          return;
        }
        form.avatar = nextAvatar;
        common_vendor.index.showToast({
          title: "已选择新头像，记得保存",
          icon: "none"
        });
      } catch (error) {
        const errorMessage = error && typeof error === "object" && "errMsg" in error ? String(error.errMsg || "") : "";
        if (errorMessage.toLowerCase().includes("cancel")) {
          return;
        }
        common_vendor.index.showToast({
          title: "头像选择失败",
          icon: "none"
        });
      } finally {
        choosingAvatar.value = false;
      }
    }
    async function handleSave() {
      const nickname = form.nickname.trim();
      if (!nickname) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none"
        });
        return;
      }
      saving.value = true;
      try {
        await userStore.updateProfile({
          nickname,
          avatar: form.avatar,
          role: form.role
        });
        common_vendor.index.showToast({
          title: "资料已保存",
          icon: "none"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "资料保存失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        saving.value = false;
      }
    }
    async function handleLogout() {
      saving.value = true;
      try {
        await userStore.logout();
        common_vendor.index.showToast({
          title: "已退出登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/profile/index"
          });
        }, 240);
      } catch (error) {
        const message = error instanceof Error ? error.message : "退出登录失败";
        common_vendor.index.showToast({
          title: message,
          icon: "none"
        });
      } finally {
        saving.value = false;
      }
    }
    if (userStore.profile) {
      syncForm();
    }
    common_vendor.onShow(() => {
      ensureLoginAccess();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "个人信息管理",
          back: true
        }),
        b: profile.value
      }, profile.value ? {
        c: common_vendor.unref(heroImage),
        d: form.avatar,
        e: common_vendor.t(form.nickname),
        f: common_vendor.t(profile.value.phone),
        g: common_vendor.t(currentRoleDesc.value),
        h: form.nickname,
        i: common_vendor.o(($event) => form.nickname = $event.detail.value),
        j: common_vendor.t(profile.value.phone),
        k: common_vendor.p({
          title: "基础资料",
          desc: "昵称会同步展示在“我的”页顶部信息卡。"
        }),
        l: common_vendor.f(roleOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(form.role === item.key ? "当前" : "切换"),
            c: common_vendor.t(item.desc),
            d: item.key,
            e: common_vendor.n({
              active: form.role === item.key
            }),
            f: common_vendor.o(($event) => form.role = item.key, item.key)
          };
        }),
        m: common_vendor.p({
          title: "身份切换",
          desc: "当前项目为演示环境，可切换身份验证不同页面权限。"
        }),
        n: common_vendor.t(isAlbumAvatar.value ? "来自系统相册" : "来自本地素材库"),
        o: choosingAvatar.value,
        p: common_vendor.o(handleChooseAlbumAvatar),
        q: common_vendor.f(common_vendor.unref(avatarOptions), (item, k0, i0) => {
          return {
            a: item,
            b: item,
            c: common_vendor.n({
              active: form.avatar === item
            }),
            d: common_vendor.o(($event) => form.avatar = item, item)
          };
        }),
        r: common_vendor.p({
          title: "头像选择",
          desc: "支持本地素材选择，也支持从系统相册更换头像。"
        }),
        s: saving.value || common_vendor.unref(userStore).loading,
        t: common_vendor.o(handleSave),
        v: saving.value || common_vendor.unref(userStore).loading,
        w: common_vendor.o(handleLogout),
        x: common_vendor.p({
          title: "账号操作",
          desc: "保存会同步当前登录态，退出后会回到“我的”页未登录状态。"
        })
      } : {
        y: common_vendor.o(goLogin),
        z: common_vendor.p({
          title: "当前未登录",
          desc: "登录后可管理头像、昵称、演示身份以及退出当前账号。",
          ["action-text"]: "去登录"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dc9c68e0"]]);
wx.createPage(MiniProgramPage);
