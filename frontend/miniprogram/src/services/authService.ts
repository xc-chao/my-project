import { request } from './request';
import type { UserProfile, UserRole } from '../types/domain';

interface LoginResponse {
  user: UserProfile;
  accessToken: string;
}

interface ProfileUpdatePayload {
  nickname?: string;
  avatar?: string;
  role?: UserRole;
}

export function loginWithWechat(payload: { code: string; nickname?: string }) {
  return request<LoginResponse>('/auth/wechat-login', {
    method: 'POST',
    data: payload
  });
}

export function loginForDevelopment(payload: { role: UserRole }) {
  return request<LoginResponse>('/auth/dev-login', {
    method: 'POST',
    data: payload
  });
}

export function getAuthProfile() {
  return request<UserProfile>('/auth/profile');
}

export function updateAuthProfile(payload: ProfileUpdatePayload) {
  return request<LoginResponse>('/auth/profile', {
    method: 'PATCH',
    data: payload
  });
}

export function logoutAuth() {
  return request<Record<string, never>>('/auth/logout', {
    method: 'POST'
  });
}
