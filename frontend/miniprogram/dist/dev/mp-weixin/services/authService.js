"use strict";
const services_request = require("./request.js");
function loginWithWechat(payload) {
  return services_request.request("/auth/wechat-login", {
    method: "POST",
    data: payload
  });
}
exports.loginWithWechat = loginWithWechat;
