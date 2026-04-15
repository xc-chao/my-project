"use strict";
const services_request = require("./request.js");
function loginWithIdentity(payload) {
  return services_request.request("/auth/wechat-login", {
    method: "POST",
    data: payload
  });
}
function getAuthProfile() {
  return services_request.request("/auth/profile");
}
function updateAuthProfile(payload) {
  return services_request.request("/auth/profile", {
    method: "PATCH",
    data: payload
  });
}
function logoutAuth() {
  return services_request.request("/auth/logout", {
    method: "POST"
  });
}
exports.getAuthProfile = getAuthProfile;
exports.loginWithIdentity = loginWithIdentity;
exports.logoutAuth = logoutAuth;
exports.updateAuthProfile = updateAuthProfile;
