// ==========================================
// 首页 - 商品列表页面
// 功能：展示所有商品，分类筛选，加入购物车
// ==========================================

import { getProducts, getCategories, addToCart } from '../../utils/api';

Page({
  // 页面的初始数据
  data: {
    banners: [           // 轮播图列表
      '../../assets/banner1.png',
      '../../assets/banner2.png',
      '../../assets/banner3.png',
      '../../assets/banner4.png',
      '../../assets/banner.png'
    ],
    products: [],        // 商品列表
    categories: [        // 分类列表
      { name: '饮料', icon: '🥤', color: '#1296db' },
      { name: '零食', icon: '🍟', color: '#ff9800' },
      { name: '方便食品', icon: '🍜', color: '#f44336' },
      { name: '日用品', icon: '🧴', color: '#4caf50' }
    ],
    selectedCategory: '', // 当前选中的分类
    searchKeyword: '',    // 搜索关键词
    page: 1,
    hasMore: true
  },

  /**
   * 生命周期函数 - 页面加载时执行
   */
  onLoad() {
    this.fetchProducts();
  },

  /**
   * 页面显示时设置 TabBar 选中状态
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0  // 首页的索引
      });
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      products: [],
      hasMore: true
    });
    this.fetchProducts().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 上拉加载更多（问题2修复）
   */
  onReachBottom() {
    if (!this.data.hasMore) {
      wx.showToast({ title: '没有更多了', icon: 'none' });
      return;
    }

    // 加载下一页
    this.setData({
      page: this.data.page + 1
    });
    this.fetchProducts();
  },

  /**
   * 从后端 API 获取商品列表
   */
  async fetchProducts() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      const res = await getProducts(
        this.data.page,
        20,
        this.data.selectedCategory || undefined,  // 空字符串改为 undefined
        this.data.searchKeyword || undefined      // 搜索关键词
      );
      
      if (res.code === 200) {
        console.log('获取商品成功:', res.data.products.length, '个商品');
        console.log('当前分类:', this.data.selectedCategory || '全部');
        
        this.setData({
          products: this.data.page === 1 ? res.data.products : [...this.data.products, ...res.data.products],
          hasMore: res.data.pagination.page < res.data.pagination.totalPages
        });
      }
      
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.error('获取商品列表失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 分类点击
   */
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category,
      page: 1,         // 重置为第一页
      products: [],    // 清空商品列表
      hasMore: true    // 重置加载更多标志
    });
    this.fetchProducts();
  },

  /**
   * 清除分类筛选
   */
  onClearCategory() {
    this.setData({
      selectedCategory: '',
      page: 1,
      products: [],
      hasMore: true
    });
    this.fetchProducts();
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  /**
   * 搜索确认（按下键盘搜索键）
   */
  onSearchConfirm(e) {
    const keyword = e.detail.value.trim();
    this.setData({
      searchKeyword: keyword,
      selectedCategory: '',  // 清空分类筛选
      page: 1,
      products: [],
      hasMore: true
    });
    this.fetchProducts();
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      page: 1,
      products: [],
      hasMore: true
    });
    this.fetchProducts();
  },

  /**
   * 商品点击，跳转详情
   */
  onProductTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    });
  },

  /**
   * 加入购物车
   */
  async addToCart(e) {
    const item = e.currentTarget.dataset.item;
    
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
      await addToCart(item.id, 1);
      wx.hideLoading();
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
      
      // 更新购物车角标
      getApp().updateCartBadge && getApp().updateCartBadge();
      
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '添加失败',
        icon: 'none'
      });
    }
  }
})

