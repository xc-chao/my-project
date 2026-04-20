const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  data?: Record<string, any>;
  token?: string;
}

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const token = options.token || uni.getStorageSync('shopping_access_token') || '';

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method: method as any,
      data: options.data,
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {})
      },
      success: (response) => {
        const payload = response.data as any;

        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(payload?.message || '请求失败'));
          return;
        }

        resolve(payload.data as T);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}
