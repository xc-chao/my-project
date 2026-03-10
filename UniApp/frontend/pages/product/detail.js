// ==========================================
// 商品详情页
// 功能：展示商品详情，规格选择，加入购物车
// ==========================================

import { addToCart, getCartCount, getProductById, getProductByBarcode } from '../../utils/api';

Page({
  data: {
    product: {},      // 商品信息
    quantity: 1,      // 购买数量
    cartCount: 0,     // 购物车数量
    showSpec: false   // 是否显示规格弹窗
  },

  /**
   * 页面加载
   * @param {Object} options - 页面参数 { id, barcode }
   */
  onLoad(options) {
    if (options.id) {
      this.loadProductById(options.id);
    } else if (options.barcode) {
      this.loadProductByBarcode(options.barcode);
    }
  },

  /**
   * 页面显示时更新购物车数量
   */
  onShow() {
    this.updateCartCount();
  },

  /**
   * 根据ID加载商品
   */
  async loadProductById(id) {
    try {
      wx.showLoading({ title: '加载中...' });
      
      // 调用后端 API 获取商品详情
      const res = await getProductById(id);
      
      if (res.code === 200) {
        this.setData({ product: res.data });
        console.log('商品详情加载成功:', res.data.name);
      } else {
        wx.showToast({ title: '商品不存在', icon: 'none' });
      }
      
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.error('加载商品详情失败:', err);
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
    }
  },

  /**
   * 根据条码加载商品
   */
  async loadProductByBarcode(barcode) {
    try {
      wx.showLoading({ title: '查询商品...' });
      
      // 调用后端 API 根据条码查询商品
      const res = await getProductByBarcode(barcode);
      
      if (res.code === 200) {
        this.setData({ product: res.data });
        console.log('商品查询成功:', res.data.name);
      } else {
        wx.showToast({ title: '商品不存在', icon: 'none' });
      }
      
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.error('查询商品失败:', err);
      wx.showToast({ title: err.message || '商品未找到', icon: 'none' });
    }
  },

  /**
   * 更新购物车数量（角标）
   */
  async updateCartCount() {
    try {
      const res = await getCartCount();
      this.setData({ cartCount: res.data.count });
    } catch (err) {
      console.error('获取购物车数量失败:', err);
    }
  },

  /**
   * 显示规格选择弹窗
   */
  onShowSpec() {
    this.setData({ showSpec: true });
  },

  /**
   * 隐藏规格选择弹窗
   */
  onHideSpec() {
    this.setData({ showSpec: false });
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {},

  /**
   * 减少数量
   */
  onMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },

  /**
   * 增加数量
   */
  onPlus() {
    if (this.data.quantity < this.data.product.stock) {
      this.setData({ quantity: this.data.quantity + 1 });
    }
  },

  /**
   * 确认规格选择
   */
  onConfirmSpec() {
    this.onHideSpec();
  },

  /**
   * 加入购物车
   */
  async onAddToCart() {
    try {
      // 检查登录
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success: (res) => {
            if (res.confirm) {
              wx.switchTab({ url: '/pages/my/my' });
            }
          }
        });
        return;
      }

      wx.showLoading({ title: '添加中...' });
      
      await addToCart(this.data.product.id, this.data.quantity);
      
      wx.hideLoading();
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      
      // 重置数量
      this.setData({ quantity: 1 });
      
      // 更新购物车角标
      this.updateCartCount();
      
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '添加失败', icon: 'none' });
    }
  },

  /**
   * 立即购买
   */
  async onBuyNow() {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success: (res) => {
            if (res.confirm) {
              wx.switchTab({ url: '/pages/my/my' });
            }
          }
        });
        return;
      }

      wx.showLoading({ title: '处理中...' });
      
      // 1. 加入购物车
      await addToCart(this.data.product.id, this.data.quantity);
      
      wx.hideLoading();
      
      // 2. 跳转到购物车页面
      wx.switchTab({ url: '/pages/cart/cart' });
      
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
    }
  },

  /**
   * 跳转到购物车
   */
  onGoToCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  }
});

