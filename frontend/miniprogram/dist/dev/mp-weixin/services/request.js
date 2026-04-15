"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:3001/api";
async function request(url, options = {}) {
  const method = options.method || "GET";
  const token = options.token || common_vendor.index.getStorageSync("shopping_access_token") || "";
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
