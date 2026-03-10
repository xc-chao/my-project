// ==========================================
// 订单详情页
// 功能：展示订单详情，支持支付
// ==========================================

import { getOrderDetail, createPayment, mockPay, cancelOrder } from '../../utils/api';

Page({
  data: {
    order: {},
    orderId: 0,
    needPay: false
  },

  onLoad(options) {
    const { id, needPay } = options;
    this.setData({
      orderId: parseInt(id),
      needPay: needPay === 'true'
    });
    this.loadOrder();
  },

  async loadOrder() {
    try {
      wx.showLoading({ title: '加载中...' });
      const res = await getOrderDetail(this.data.orderId);
      
      if (res.code === 200) {
        this.setData({ order: res.data });
        
        // 如果需要支付且订单状态为待支付
        if (this.data.needPay && res.data.status === 0) {
          wx.hideLoading();
          this.showPaymentOptions();
        } else {
          wx.hideLoading();
        }
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
    }
  },

  showPaymentOptions() {
    wx.showActionSheet({
      itemList: ['微信支付（模拟）', '余额支付'],
      success: (res) => {
        const paymentMethod = res.tapIndex === 0 ? 'wechat' : 'balance';
        this.onPay(paymentMethod);
      }
    });
  },

  async onPay(paymentMethod = 'wechat') {
    try {
      wx.showLoading({ title: '处理中...' });
      
      // 1. 创建支付订单
      const payRes = await createPayment(this.data.orderId, paymentMethod);
      
      if (payRes.code === 200) {
        if (paymentMethod === 'balance') {
          // 余额支付直接完成
          wx.hideLoading();
          wx.showToast({ title: '支付成功' });
          await this.loadOrder();
        } else {
          // 微信支付（开发环境使用模拟支付）
          await mockPay(payRes.data.paymentNo);
          wx.hideLoading();
          wx.showToast({ title: '支付成功' });
          await this.loadOrder();
        }
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '支付失败', icon: 'none' });
    }
  },

  async onCancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '取消中...' });
            await cancelOrder(this.data.orderId);
            wx.hideLoading();
            wx.showToast({ title: '订单已取消' });
            await this.loadOrder();
          } catch (err) {
            wx.hideLoading();
            wx.showToast({ title: err.message || '取消失败', icon: 'none' });
          }
        }
      }
    });
  },

  getStatusText(status) {
    const map = { 0: '等待支付', 1: '支付成功', 2: '已取消', 3: '已完成' };
    return map[status] || '未知';
  },

  getStatusIcon(status) {
    const map = { 0: '⏰', 1: '✅', 2: '❌', 3: '🎉' };
    return map[status] || '📦';
  },

  getPaymentMethodText(method) {
    const map = { wechat: '微信支付', balance: '余额支付' };
    return map[method] || '未支付';
  }
});
