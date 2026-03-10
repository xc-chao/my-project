"use strict";
const common_vendor = require("../../common/vendor.js");
const services_authService = require("../../services/authService.js");
const TOKEN_KEY = "shopping_access_token";
const USER_KEY = "shopping_user_profile";
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    token: common_vendor.index.getStorageSync(TOKEN_KEY) || "",
    profile: common_vendor.index.getStorageSync(USER_KEY) || null,
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token)
  },
  actions: {
    async login() {
      this.loading = true;
      try {
        const result = await services_authService.loginWithWechat({
          code: "mock_code",
          nickname: "校园买手"
        });
        this.token = result.accessToken;
        this.profile = result.user;
        common_vendor.index.setStorageSync(TOKEN_KEY, this.token);
        common_vendor.index.setStorageSync(USER_KEY, result.user);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = "";
      this.profile = null;
      common_vendor.index.removeStorageSync(TOKEN_KEY);
      common_vendor.index.removeStorageSync(USER_KEY);
    }
  }
});
exports.useUserStore = useUserStore;
