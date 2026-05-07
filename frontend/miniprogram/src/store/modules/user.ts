import { defineStore } from 'pinia';
import { getAuthProfile, loginWithWechat, logoutAuth, updateAuthProfile } from '../../services/authService';
import type { UserProfile, UserRole } from '../../types/domain';

const TOKEN_KEY = 'shopping_access_token';
const USER_KEY = 'shopping_user_profile';

function normalizeProfile(profile: Partial<UserProfile> | null) {
  if (!profile || !profile.id) {
    return null;
  }

  return {
    id: profile.id,
    nickname: profile.nickname || '校园买手',
    phone: profile.phone || '',
    avatar: profile.avatar || '',
    role: profile.role === 'admin' ? 'admin' : 'user'
  } as UserProfile;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync(TOKEN_KEY) || '',
    profile: normalizeProfile((uni.getStorageSync(USER_KEY) || null) as Partial<UserProfile> | null),
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    isAdmin: (state) => state.profile?.role === 'admin'
  },
  actions: {
    setSession(profile: Partial<UserProfile> | null, token = '') {
      this.token = token;
      this.profile = normalizeProfile(profile);

      if (this.token) {
        uni.setStorageSync(TOKEN_KEY, this.token);
      } else {
        uni.removeStorageSync(TOKEN_KEY);
      }

      if (this.profile) {
        uni.setStorageSync(USER_KEY, this.profile);
      } else {
        uni.removeStorageSync(USER_KEY);
      }
    },
    async login() {
      this.loading = true;

      try {
        const loginResult = await new Promise<{ code?: string }>((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          });
        });

        if (!loginResult.code) {
          throw new Error('微信登录失败');
        }

        const result = await loginWithWechat({
          code: loginResult.code
        });

        this.setSession(result.user, result.accessToken);
      } finally {
        this.loading = false;
      }
    },
    async refreshProfile() {
      if (!this.token) {
        this.setSession(null, '');
        return null;
      }

      const profile = await getAuthProfile();
      this.setSession(profile, this.token);
      return profile;
    },
    async updateProfile(payload: { nickname?: string; avatar?: string; role?: UserRole }) {
      this.loading = true;

      try {
        const result = await updateAuthProfile(payload);
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
          await logoutAuth();
        }
      } finally {
        this.setSession(null, '');
        this.loading = false;
      }
    }
  }
});
