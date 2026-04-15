"use strict";
const common_vendor = require("../../common/vendor.js");
const services_authService = require("../../services/authService.js");
const TOKEN_KEY = "shopping_access_token";
const USER_KEY = "shopping_user_profile";
function normalizeProfile(profile) {
  if (!profile || !profile.id) {
    return null;
  }
  return {
    id: profile.id,
    nickname: profile.nickname || "校园买手",
    phone: profile.phone || "",
    avatar: profile.avatar || "",
    role: profile.role === "admin" ? "admin" : "user"
  };
}
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    token: common_vendor.index.getStorageSync(TOKEN_KEY) || "",
    profile: normalizeProfile(common_vendor.index.getStorageSync(USER_KEY) || null),
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    isAdmin: (state) => {
      var _a;
      return ((_a = state.profile) == null ? void 0 : _a.role) === "admin";
    }
  },
  actions: {
    setSession(profile, token = "") {
      this.token = token;
      this.profile = normalizeProfile(profile);
      if (this.token) {
        common_vendor.index.setStorageSync(TOKEN_KEY, this.token);
      } else {
        common_vendor.index.removeStorageSync(TOKEN_KEY);
      }
      if (this.profile) {
        common_vendor.index.setStorageSync(USER_KEY, this.profile);
      } else {
        common_vendor.index.removeStorageSync(USER_KEY);
      }
    },
    async login(identity = "user") {
      this.loading = true;
      try {
        const result = await services_authService.loginWithIdentity({
          code: "wechat_dev_code",
          nickname: identity === "admin" ? "系统管理员" : "校园买手",
          identity
        });
        this.setSession(result.user, result.accessToken);
      } finally {
        this.loading = false;
      }
    },
    async refreshProfile() {
      if (!this.token) {
        this.setSession(null, "");
        return null;
      }
      const profile = await services_authService.getAuthProfile();
      this.setSession(profile, this.token);
      return profile;
    },
    async updateProfile(payload) {
      this.loading = true;
      try {
        const result = await services_authService.updateAuthProfile(payload);
        this.setSession(result.user, result.accessToken);
        return this.profile;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;
      try {
        if (this.token) {
          await services_authService.logoutAuth();
        }
      } finally {
        this.setSession(null, "");
        this.loading = false;
      }
    }
  }
});
exports.useUserStore = useUserStore;
