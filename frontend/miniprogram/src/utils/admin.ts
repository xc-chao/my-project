export function ensureAdminPageAccess(isAdmin: boolean) {
  if (isAdmin) {
    return true;
  }

  uni.showToast({
    title: '仅管理员可访问',
    icon: 'none'
  });

  setTimeout(() => {
    uni.switchTab({
      url: '/pages/profile/index'
    });
  }, 320);

  return false;
}
