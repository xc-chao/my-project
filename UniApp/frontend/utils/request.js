// ==========================================
// 网络请求封装工具
// 功能：封装微信小程序的 wx.request，简化 API 调用
// ==========================================

const BASE_URL = 'http://localhost:3000/api'; // 后端 API 基础路径

/**
 * 封装的网络请求函数
 * @param {string} url - 请求路径（相对路径，如：'/products'）
 * @param {Object} options - 请求配置
 * @param {string} options.method - 请求方法（GET, POST, PUT, DELETE）
 * @param {Object} options.data - 请求数据
 * @param {Object} options.header - 自定义请求头
 * @returns {Promise} - 返回 Promise 对象
 * 
 * 功能说明：
 * 1. 自动拼接完整的 API 地址
 * 2. 自动从本地存储读取 token 并添加到请求头
 * 3. 将微信的回调方式转换为 Promise 方式
 * 
 * 使用示例：
 * const res = await request('/products', { method: 'GET' });
 */
const request = (url, options = {}) => {
  // 从本地存储获取 token（用户登录后保存的）
  const token = wx.getStorageSync('token');
  
  // 构建请求头
  const header = {
    'Content-Type': 'application/json', // JSON 格式
    ...options.header // 合并自定义请求头
  };
  
  // 如果有 token，则添加 Authorization 头（用于身份认证）
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  // 返回 Promise 对象（支持 async/await 语法）
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,              // 完整的请求地址
      method: options.method || 'GET',       // 请求方法，默认 GET
      data: options.data,                    // 请求数据
      header: header,                        // 请求头
      success: (res) => {
        // 请求成功（HTTP 状态码 2xx）
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data); // 返回响应数据
        } else {
          reject(res.data);  // 返回错误信息
        }
      },
      fail: (err) => {
        // 请求失败（网络错误等）
        reject(err);
      }
    });
  });
};

// 导出函数供其他文件使用
module.exports = {
  request
};

