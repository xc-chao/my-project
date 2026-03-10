// ==========================================
// 小程序全局入口文件
// 功能：全局配置、全局数据、全局方法
// ==========================================

App({
  /**
   * 生命周期函数 - 小程序启动时执行
   */
  onLaunch: function () {
    // 检查用户是否已登录
    const token = wx.getStorageSync('token');
    if (token) {
      console.log('用户已登录');
      this.updateCartBadge();
    } else {
      console.log('用户未登录');
    }
  },

  /**
   * 全局共享数据
   */
  globalData: {
    userInfo: null,  // 用户信息
    cartCount: 0     // 购物车数量
  },

  /**
   * 更新购物车角标（支持自定义 TabBar）
   */
  async updateCartBadge() {
    try {
      const { getCartCount } = require('./utils/api');
      const res = await getCartCount();
      
      const count = (res.code === 200 && res.data) ? res.data.count : 0;
      
      // 更新全局数据
      this.globalData.cartCount = count;
      
      // 更新自定义 TabBar 的角标
      try {
        const pages = getCurrentPages();
        if (pages && pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          if (currentPage && typeof currentPage.getTabBar === 'function') {
            const tabBar = currentPage.getTabBar();
            if (tabBar) {
              tabBar.setData({ cartCount: count });
            }
          }
        }
      } catch (tabBarErr) {
        console.log('自定义TabBar更新失败（可忽略）:', tabBarErr.message);
      }
      
      // 同时更新原生 TabBar 角标（兼容）
      if (count > 0) {
        wx.setTabBarBadge({
          index: 1,
          text: String(count)
        });
      } else {
        wx.removeTabBarBadge({ index: 1 });
      }
    } catch (err) {
      console.error('更新购物车角标失败:', err);
      this.globalData.cartCount = 0;
      wx.removeTabBarBadge({ index: 1 }).catch(() => {});
    }
  }
})

