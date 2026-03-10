// 自定义 TabBar 组件
Component({
  data: {
    active: 0,
    cartCount: 0
  },

  lifetimes: {
    attached() {
      // 组件加载时，从全局数据读取购物车数量
      const app = getApp();
      if (app.globalData) {
        this.setData({
          cartCount: app.globalData.cartCount || 0
        });
      }
    }
  },

  methods: {
    onChange(event) {
      const index = event.detail;
      this.setData({ active: index });
      
      // 跳转到对应页面
      const urls = [
        '/pages/index/index',
        '/pages/cart/cart',
        '/pages/profile/profile'
      ];
      
      wx.switchTab({ url: urls[index] });
    },
    
    // 更新购物车数量（供外部调用）
    updateCartCount(count) {
      this.setData({ cartCount: count });
    }
  }
});

