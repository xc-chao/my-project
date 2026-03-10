// ==========================================
// 购物车页面（v2.0 - 对接后端 API）
// 功能：展示购物车商品，调整数量，提交订单
// ==========================================

import { getCart, updateCartItem, deleteCartItem, selectAllCart, createOrder } from '../../utils/api';

Page({
  // 页面数据
  data: {
    cartItems: [],    // 购物车商品列表
    total: {},        // 统计信息
    allSelected: false, // 是否全选
    isLoggedIn: false  // 是否已登录
  },

  /**
   * 生命周期函数 - 页面显示时执行
   */
  onShow() {
    // 设置 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1,  // 购物车的索引
        cartCount: getApp().globalData.cartCount || 0
      });
    }
    
    this.loadCart();
  },

  /**
   * 跳转登录
   */
  onGoLogin() {
    wx.switchTab({ url: '/pages/profile/profile' });
  },

  /**
   * 去逛逛（跳转首页）
   */
  onGoShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  /**
   * 从后端加载购物车数据
   */
  async loadCart() {
    try {
      // 检查登录
      const token = wx.getStorageSync('token');
      if (!token) {
        this.setData({
          isLoggedIn: false,
          cartItems: [],
          total: { selectedCount: 0, totalAmount: 0, totalQuantity: 0 }
        });
        return;
      }

      this.setData({ isLoggedIn: true });

      const res = await getCart();
      if (res.code === 200) {
        console.log('📊 购物车数据:', {
          商品数量: res.data.items.length,
          总价: res.data.total.totalAmount,
          选中数量: res.data.total.selectedCount
        });
        
        this.setData({
          cartItems: res.data.items || [],
          total: res.data.total || { selectedCount: 0, totalAmount: 0, totalQuantity: 0 },
          allSelected: res.data.items?.every(item => item.selected) || false
        });
        
        console.log('📦 页面数据已更新:', {
          cartItems长度: this.data.cartItems.length,
          total: this.data.total
        });
      }
    } catch (err) {
      console.error('加载购物车失败:', err);
      if (err.message && err.message.includes('未提供认证令牌')) {
        // 未登录，显示空购物车
        this.setData({
          isLoggedIn: false,
          cartItems: [],
          total: { selectedCount: 0, totalAmount: 0, totalQuantity: 0 }
        });
      }
    }
  },

  /**
   * van-stepper 数量改变（Vant 组件事件）
   */
  async onStepperChange(e) {
    const { id } = e.currentTarget.dataset;
    const newQuantity = e.detail;  // Vant stepper 返回的新数量
    
    try {
      await updateCartItem(id, { quantity: newQuantity });
      await this.loadCart();
      
      // 更新购物车角标
      getApp().updateCartBadge && getApp().updateCartBadge();
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
      // 失败时恢复原数量
      await this.loadCart();
    }
  },

  /**
   * 左滑删除（Vant swipe-cell）
   */
  async onDeleteSwipe(e) {
    const { id } = e.currentTarget.dataset;
    
    try {
      await deleteCartItem(id);
      await this.loadCart();
      
      // 更新购物车角标
      getApp().updateCartBadge && getApp().updateCartBadge();
      
      wx.showToast({ title: '删除成功', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: err.message || '删除失败', icon: 'none' });
    }
  },

  /**
   * 增加商品数量（原生方法，保留作为备用）
   */
  async plus(e) {
    const { id, quantity } = e.currentTarget.dataset;
    try {
      await updateCartItem(id, { quantity: quantity + 1 });
      await this.loadCart();
      
      // 更新购物车角标
      getApp().updateCartBadge && getApp().updateCartBadge();
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
    }
  },

  /**
   * 减少商品数量
   */
  async minus(e) {
    const { id, quantity } = e.currentTarget.dataset;
    
    if (quantity <= 1) {
      // 数量为 1，删除商品
      wx.showModal({
        title: '提示',
        content: '确定要删除这个商品吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteCartItem(id);
              await this.loadCart();
              
              // 更新购物车角标
              getApp().updateCartBadge && getApp().updateCartBadge();
              
              wx.showToast({ title: '删除成功' });
            } catch (err) {
              wx.showToast({ title: '删除失败', icon: 'none' });
            }
          }
        }
      });
    } else {
      // 减少数量
      try {
        await updateCartItem(id, { quantity: quantity - 1 });
        await this.loadCart();
        
        // 更新购物车角标
        getApp().updateCartBadge && getApp().updateCartBadge();
      } catch (err) {
        wx.showToast({ title: err.message || '操作失败', icon: 'none' });
      }
    }
  },

  /**
   * 切换选中状态
   */
  async onToggleSelect(e) {
    const { id, selected } = e.currentTarget.dataset;
    try {
      await updateCartItem(id, { selected: !selected });
      await this.loadCart();
      // 选中状态改变不影响角标数量，所以不需要更新
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  /**
   * 全选/取消全选
   */
  async onSelectAll() {
    try {
      await selectAllCart(!this.data.allSelected);
      await this.loadCart();
      // 全选状态改变不影响角标数量，所以不需要更新
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {},

  /**
   * 点击商品跳转详情页
   */
  onProductTap(e) {
    const { productId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`
    });
  },

  /**
   * 删除选中的商品
   */
  async onDeleteSelected() {
    const selectedItems = this.data.cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请先选择商品', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedItems.length} 个商品吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });
            
            // 批量删除
            const ids = selectedItems.map(item => item.id);
            const { deleteCartItem } = require('../../utils/api');
            
            // 逐个删除（或使用批量删除接口）
            for (const id of ids) {
              await deleteCartItem(id);
            }
            
            await this.loadCart();
            getApp().updateCartBadge && getApp().updateCartBadge();
            
            wx.hideLoading();
            wx.showToast({ title: '删除成功', icon: 'success' });
          } catch (err) {
            wx.hideLoading();
            wx.showToast({ title: err.message || '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  /**
   * 清空购物车
   */
  async onClearCart() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({ title: '购物车已经是空的', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      confirmColor: '#ee0a24',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '清空中...' });
            
            const { clearCart } = require('../../utils/api');
            await clearCart();
            
            await this.loadCart();
            getApp().updateCartBadge && getApp().updateCartBadge();
            
            wx.hideLoading();
            wx.showToast({ title: '购物车已清空', icon: 'success' });
          } catch (err) {
            wx.hideLoading();
            wx.showToast({ title: err.message || '清空失败', icon: 'none' });
          }
        }
      }
    });
  },

  /**
   * 去结算（创建订单）
   */
  async onCheckout() {
    // 检查是否已登录
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/profile/profile' });
          }
        }
      });
      return;
    }

    // 检查是否选中商品
    if (this.data.total.selectedCount === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '提交订单...' });
      
      // 调用创建订单接口
      const res = await createOrder();

      wx.hideLoading();
      
      if (res.code === 200) {
        wx.showToast({ title: '订单创建成功' });
        
        // 更新购物车角标（订单创建后购物车已清空）
        getApp().updateCartBadge && getApp().updateCartBadge();
        
        // 跳转到订单详情页（带支付标识）
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/order/detail?id=${res.data.id}&needPay=true`
          });
        }, 1500);
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '提交失败', icon: 'none' });
    }
  }
})
