export const mockDb = {
  users: [
    {
      id: 'u_001',
      nickname: '校园买手',
      avatar: '',
      phone: '13800000000',
      role: 'user'
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
      cover: 'https://dummyimage.com/640x640/f0f2f5/111111&text=Sneaker',
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
      cover: 'https://dummyimage.com/640x640/e5e7eb/111111&text=Jacket',
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
      cover: 'https://dummyimage.com/640x640/dbeafe/111111&text=Audio',
      badges: ['爆款'],
      sizes: ['标准版'],
      detail: '支持快充与双设备连接，适合通勤和学习场景。'
    }
  ],
  cartItems: [],
  orders: [],
  chatSessions: []
};
