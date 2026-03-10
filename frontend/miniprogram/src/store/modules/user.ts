import { defineStore } from 'pinia';
import { loginWithWechat } from '../../services/authService';
import type { UserProfile } from '../../mock/data';

const TOKEN_KEY = 'shopping_access_token';
const USER_KEY = 'shopping_user_profile';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync(TOKEN_KEY) || '',
    profile: (uni.getStorageSync(USER_KEY) || null) as UserProfile | null,
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token)
  },
  actions: {
    async login() {
      this.loading = true;

      try {
        const result = await loginWithWechat({
          code: 'mock_code',
          nickname: '校园买手'
        });

        this.token = result.accessToken;
        this.profile = result.user;
        uni.setStorageSync(TOKEN_KEY, this.token);
        uni.setStorageSync(USER_KEY, result.user);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = '';
      this.profile = null;
      uni.removeStorageSync(TOKEN_KEY);
      uni.removeStorageSync(USER_KEY);
    }
  }
});
