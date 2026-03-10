"use strict";
const common_vendor = require("../common/vendor.js");
const mock_handlers = require("../mock/handlers.js");
var define_import_meta_env_default = {};
const BASE_URL = define_import_meta_env_default.VITE_API_BASE_URL || "http://localhost:3000/api";
const USE_MOCK = define_import_meta_env_default.VITE_USE_MOCK !== "false";
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function request(url, options = {}) {
  const method = options.method || "GET";
  const token = options.token || common_vendor.index.getStorageSync("shopping_access_token") || "";
  if (USE_MOCK) {
    await wait(180);
    const response = mock_handlers.handleMockRequest({
      method,
      url,
      data: options.data
    });
    return response.data;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}${url}`,
      method,
      data: options.data,
      header: token ? {
        Authorization: `Bearer ${token}`
      } : {},
      success: (response) => {
        const payload = response.data;
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error((payload == null ? void 0 : payload.message) || "请求失败"));
          return;
        }
        resolve(payload.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}
exports.request = request;
