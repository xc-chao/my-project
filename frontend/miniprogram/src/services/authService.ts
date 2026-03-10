import { request } from './request';
import type { UserProfile } from '../mock/data';

interface LoginResponse {
  user: UserProfile;
  accessToken: string;
}

export function loginWithWechat(payload: { code: string; nickname?: string }) {
  return request<LoginResponse>('/auth/wechat-login', {
    method: 'POST',
    data: payload
  });
}
