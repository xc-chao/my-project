import { defineStore } from 'pinia';
import { loginWithIdentity } from '../../services/authService';
import type { UserProfile, UserRole } from '../../mock/data';

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
    async login(identity: UserRole = 'user') {
      this.loading = true;

      try {
        const result = await loginWithIdentity({
          code: 'mock_code',
          nickname: identity === 'admin' ? '系统管理员' : '校园买手',
          identity
        });

        this.token = result.accessToken;
        this.profile = normalizeProfile(result.user);
        uni.setStorageSync(TOKEN_KEY, this.token);
        uni.setStorageSync(USER_KEY, this.profile);
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
