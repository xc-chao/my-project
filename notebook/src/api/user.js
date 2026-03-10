import axios from 'axios';

const MODE = import.meta.env.MODE;

const baseUrl = MODE === 'development' ? '/api' : '';

const request = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const resetPassword = (data) => {
  return request.post('/user/reset-password', data);
};

export const login = (data) => {
  return request.post('/user/login', data);
};

export const getUserInfo = () => {
  return request.get('/user/get_userinfo');
};

export const updateUserInfo = (data) => {
  return request.post('/user/edit_userinfo', data);
};