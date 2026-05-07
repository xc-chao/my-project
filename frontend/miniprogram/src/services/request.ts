const ENV_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_BASE_URL = 'http://localhost:3001/api';
const STORAGE_BASE_URL_KEY = 'shopping_api_base_url';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  data?: Record<string, any>;
  token?: string;
}

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const token = options.token || uni.getStorageSync('shopping_access_token') || '';
  const storedBaseUrl = uni.getStorageSync(STORAGE_BASE_URL_KEY);
  const baseUrl = (typeof storedBaseUrl === 'string' && storedBaseUrl.trim()) || ENV_BASE_URL || DEFAULT_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method: method as any,
      data: options.data,
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {})
      },
      success: (response) => {
        const payload = response.data as any;

        if (response.statusCode && response.statusCode >= 400) {
          const error = new Error(payload?.message || '请求失败');
          console.error('[request] http error', {
            url: fullUrl,
            method,
            statusCode: response.statusCode,
            payload
          });
          reject(error);
          return;
        }

        resolve(payload.data as T);
      },
      fail: (error) => {
        console.error('[request] network fail', {
          url: fullUrl,
          method,
          error
        });
        reject(error);
      }
    });
  });
}
