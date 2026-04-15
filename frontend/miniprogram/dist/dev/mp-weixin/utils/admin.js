"use strict";
const common_vendor = require("../common/vendor.js");
function ensureAdminPageAccess(isAdmin) {
  if (isAdmin) {
    return true;
  }
  common_vendor.index.showToast({
    title: "仅管理员可访问",
    icon: "none"
  });
  setTimeout(() => {
    common_vendor.index.switchTab({
      url: "/pages/profile/index"
    });
  }, 320);
  return false;
}
exports.ensureAdminPageAccess = ensureAdminPageAccess;
