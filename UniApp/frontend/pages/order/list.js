// ==========================================
// 订单列表页
// 功能：展示用户的订单列表，支持状态筛选
// ==========================================

import { getOrders, cancelOrder, getOrderStats } from '../../utils/api';

Page({
  data: {
    orders: [],
    currentTab: -1,  // -1=全部, 0=待支付, 1=已支付, 3=已完成
    orderStats: {}
  },

  onLoad(options) {
    // 如果从其他页面传来了状态参数
    if (options.status !== undefined) {
      this.setData({ currentTab: parseInt(options.status) });
    }
    this.loadOrderStats();
    this.loadOrders();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadOrderStats();
    this.loadOrders();
  },

  async loadOrderStats() {
    try {
      const res = await getOrderStats();
      if (res.code === 200) {
        this.setData({ orderStats: res.data });
      }
    } catch (err) {
      console.error('获取订单统计失败:', err);
    }
  },

  async loadOrders() {
    try {
      const status = this.data.currentTab === -1 ? undefined : this.data.currentTab;
      const res = await getOrders(1, 20, status);
      
      if (res.code === 200) {
        this.setData({ orders: res.data.orders });
      }
    } catch (err) {
      console.error('获取订单列表失败:', err);
      if (err.message && err.message.includes('未提供认证令牌')) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success: (res) => {
            if (res.confirm) {
              wx.switchTab({ url: '/pages/profile/profile' });
            }
          }
        });
      }
    }
  },

  onTabChange(e) {
    const status = parseInt(e.currentTarget.dataset.status);
    this.setData({
      currentTab: status,
      orders: []
    });
    this.loadOrders();
  },

  async onCancelOrder(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '取消中...' });
            await cancelOrder(id);
            wx.hideLoading();
            wx.showToast({ title: '订单已取消' });
            await this.loadOrders();
            await this.loadOrderStats();
          } catch (err) {
            wx.hideLoading();
            wx.showToast({ title: err.message || '取消失败', icon: 'none' });
          }
        }
      }
    });
  },

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/detail?id=${id}`
    });
  },

  onPayOrder(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/detail?id=${id}&needPay=true`
    });
  },

  getStatusText(status) {
    const map = { 0: '待支付', 1: '已支付', 2: '已取消', 3: '已完成' };
    return map[status] || '未知';
  }
});
