// ==========================================
// 个人中心页面
// 功能：用户登录、查看个人信息、跳转订单页面
// ==========================================

import { wechatLogin, getUserProfile, getBalance, getOrderStats } from '../../utils/api';

Page({
  // 页面数据
  data: {
    userInfo: null,   // 用户信息
    balance: 0,       // 账户余额
    orderStats: {}    // 订单统计
  },

  /**
   * 生命周期函数 - 页面显示时执行
   */
  onShow() {
    // 设置 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 2  // 我的页面的索引
      });
    }
    
    const token = wx.getStorageSync('token');
    if (token) {
      this.loadUserInfo();
      this.loadBalance();
      this.loadOrderStats();
    } else {
      // 从本地存储读取缓存的用户信息
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({ userInfo });
      }
    }
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const res = await getUserProfile();
      if (res.code === 200) {
        this.setData({ userInfo: res.data });
        wx.setStorageSync('userInfo', res.data);
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
  },

  /**
   * 加载账户余额
   */
  async loadBalance() {
    try {
      const res = await getBalance();
      if (res.code === 200) {
        this.setData({ balance: res.data.balance });
      }
    } catch (err) {
      console.error('获取余额失败:', err);
    }
  },

  /**
   * 加载订单统计
   */
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

  /**
   * 用户登录（问题5修复：提供多种登录方式选择）
   */
  async onLogin() {
    wx.showActionSheet({
      itemList: ['微信快捷登录', '手机号登录'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.wechatLogin();
        } else {
          this.phoneLogin();
        }
      }
    });
  },

  /**
   * 微信快捷登录
   */
  async wechatLogin() {
    try {
      // 1. 获取用户信息
      const userInfoRes = await wx.getUserProfile({
        desc: '用于完善会员资料'
      });
      
      // 2. 调用微信登录
      const loginRes = await wx.login();
      
      // 3. 调用后端接口
      const res = await wechatLogin(
        loginRes.code,
        userInfoRes.userInfo.nickName,
        userInfoRes.userInfo.avatarUrl
      );
      
      if (res.code === 200) {
        // 保存 token 和用户信息
        wx.setStorageSync('token', res.data.token);
        wx.setStorageSync('userInfo', res.data.user);
        
        // 更新页面数据
        this.setData({ userInfo: res.data.user });
        
        // 加载其他数据
        this.loadBalance();
        this.loadOrderStats();
        
        wx.showToast({ title: '登录成功' });
      }
    } catch (err) {
      console.error('微信登录失败:', err);
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  /**
   * 手机号登录（问题5修复：暂时提示功能）
   */
  phoneLogin() {
    wx.showModal({
      title: '手机号登录',
      content: '手机号登录功能需要单独的登录页面。\n\n测试账号：\n手机号：13800138001\n密码：123456\n\n当前可使用微信快捷登录',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '微信登录',
      success: (res) => {
        if (res.confirm) {
          this.wechatLogin();
        }
      }
    });
  },

  /**
   * 跳转到订单页面
   * @param {number} status - 订单状态（可选）
   */
  goToOrders(status) {
    let url = '/pages/order/list';
    if (status !== undefined) {
      url += `?status=${status}`;
    }
    wx.navigateTo({ url });
  },

  /**
   * 订单状态点击
   */
  onOrderNav(e) {
    const { status } = e.currentTarget.dataset;
    this.goToOrders(status);
  },

  /**
   * 关于我们（问题6修复）
   */
  onAbout() {
    wx.showModal({
      title: 'ScanShop 扫码购物',
      content: '版本：v2.0\n\n一个功能完整的扫码购物系统\n\n技术栈：\n- 微信小程序\n- Node.js + Express\n- MySQL + Sequelize\n\n© 2025 ScanShop Team',
      showCancel: false,
      confirmText: '知道了'
    });
  }
})


