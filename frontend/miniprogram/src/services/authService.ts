import { request } from './request';
import type { UserProfile, UserRole } from '../mock/data';

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

export function loginWithIdentity(payload: { code: string; nickname?: string; identity?: UserRole }) {
  return request<LoginResponse>('/auth/wechat-login', {
    method: 'POST',
    data: payload
  });
}
