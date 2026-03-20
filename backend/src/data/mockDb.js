export const mockDb = {
  users: [
    {
      id: 'u_001',
      nickname: '校园买手',
      avatar: '',
      phone: '13800000000',
      role: 'user'
    },
    {
      id: 'u_admin_001',
      nickname: '系统管理员',
      avatar: '',
      phone: '13900000000',
      role: 'admin'
    }
  ],
  products: [
    {
      id: 'p_001',
      title: '轻量复古跑鞋',
      price: 499,
      originalPrice: 699,
      subtitle: '透气网面 + 缓震中底',
      category: '鞋靴',
      stock: 36,
      sales: 2300,
      cover: '/static/products/shoe-retro.svg',
      saleStatus: 'on_sale',
      badges: ['热卖', '新品'],
      sizes: ['39', '40', '41', '42', '43'],
      detail: '适合日常穿搭与轻运动，支持 7 天无理由退货。'
    },
    {
      id: 'p_002',
      title: '极简工装外套',
      price: 369,
      originalPrice: 529,
      subtitle: '机能口袋设计',
      category: '服饰',
      stock: 18,
      sales: 1260,
      cover: '/static/products/jacket-minimal.svg',
      saleStatus: 'off_shelf',
      badges: ['人气'],
      sizes: ['M', 'L', 'XL'],
      detail: '适合春秋通勤，防泼水面料，兼顾轻量与层次。'
    },
    {
      id: 'p_003',
      title: '降噪蓝牙耳机',
      price: 899,
      originalPrice: 1099,
      subtitle: '42dB 主动降噪',
      category: '数码',
      stock: 58,
      sales: 4200,
      cover: '/static/products/headphone-pro.svg',
      saleStatus: 'on_sale',
      badges: ['爆款'],
      sizes: ['标准版'],
      detail: '支持快充与双设备连接，适合通勤和学习场景。'
    }
  ],
  cartItems: [],
  orders: [
    {
      id: 'order_seed_001',
      userId: 'u_001',
      status: 'completed',
      amount: 899,
      addressId: 'addr_001',
      items: [
        {
          id: 'cart_seed_001',
          productId: 'p_003',
          quantity: 1,
          size: '标准版'
        }
      ],
      createdAt: '2026-03-07 17:42'
    }
  ],
  addresses: [
    {
      id: 'addr_001',
      userId: 'u_001',
      name: '徐超',
      phone: '13800000000',
      region: '上海市 浦东新区',
      detail: '张江高科软件园 8 号楼 1203 室',
      isDefault: true
    }
  ],
  afterSales: [
    {
      id: 'after_001',
      userId: 'u_001',
      orderId: 'order_seed_001',
      productTitle: '降噪蓝牙耳机',
      reason: '外观有轻微划痕',
      status: 'reviewing'
    }
  ],
  feedbacks: [
    {
      id: 'feedback_001',
      userName: '周同学',
      productTitle: '轻量复古跑鞋',
      summary: '希望详情页补充脚感说明与尺码建议。',
      status: 'pending',
      createdAt: '2026-03-10 09:20'
    },
    {
      id: 'feedback_002',
      userName: '林同学',
      productTitle: '极简工装外套',
      summary: '搜索筛选建议增加价格区间和 48h 上新选项。',
      status: 'resolved',
      createdAt: '2026-03-09 21:10'
    },
    {
      id: 'feedback_003',
      userName: '陈同学',
      productTitle: '降噪蓝牙耳机',
      summary: '订单物流更新比较及时，售后入口可以再提前。',
      status: 'pending',
      createdAt: '2026-03-09 18:45'
    }
  ],
  adminDashboard: {
    dailyOrders: 128,
    pendingAfterSales: 9,
    pendingFeedbacks: 12,
    agentCalls: 86,
    fallbackCount: 2,
    successRate: 97,
    avgLatencyMs: 820
  },
  chatSessions: []
};
