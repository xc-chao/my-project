// ==========================================
// 订单列表页面
// 功能：展示用户的历史订单
// ==========================================

const { request } = require('../../utils/request');

Page({
  // 页面数据
  data: {
    orders: []  // 订单列表
  },

  /**
   * 生命周期函数 - 页面显示时执行
   */
  onShow() {
    this.fetchOrders(); // 每次进入页面时刷新订单列表
  },

  /**
   * 从后端获取订单列表
   * GET /api/orders/my
   */
  async fetchOrders() {
    try {
      const res = await request('/orders/my');
      if (res.code === 200) {
        this.setData({ orders: res.data }); // 更新订单列表
      }
    } catch (err) { 
      console.error('获取订单列表失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  }
})

