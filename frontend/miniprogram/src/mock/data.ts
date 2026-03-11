export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  stock: number;
  sales: number;
  category: string;
  cover: string;
  badges: string[];
  sizes: string[];
  detail: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  phone: string;
  avatar: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
}

export interface AddressItem {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  status: 'pending_payment' | 'pending_shipping' | 'shipped' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
  items: CartItem[];
}

export interface AfterSaleItem {
  id: string;
  orderId: string;
  productTitle: string;
  reason: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
}

export const mockProducts: ProductItem[] = [
  {
    id: 'p_001',
    title: '轻量复古跑鞋',
    subtitle: '透气网面 + 缓震中底',
    price: 499,
    originalPrice: 699,
    stock: 36,
    sales: 2300,
    category: '鞋靴',
    cover: '/static/products/shoe-retro.svg',
    badges: ['热卖', '新品'],
    sizes: ['39', '40', '41', '42', '43'],
    detail: '复古鞋型搭配轻量缓震中底，适合日常通勤与校园穿搭。'
  },
  {
    id: 'p_002',
    title: '极简工装外套',
    subtitle: '机能口袋设计',
    price: 369,
    originalPrice: 529,
    stock: 18,
    sales: 1260,
    category: '服饰',
    cover: '/static/products/jacket-minimal.svg',
    badges: ['人气'],
    sizes: ['M', 'L', 'XL'],
    detail: '适合春秋通勤，兼顾层次感与实穿性，面料轻薄不闷热。'
  },
  {
    id: 'p_003',
    title: '降噪蓝牙耳机',
    subtitle: '42dB 主动降噪',
    price: 899,
    originalPrice: 1099,
    stock: 58,
    sales: 4200,
    category: '数码',
    cover: '/static/products/headphone-pro.svg',
    badges: ['爆款'],
    sizes: ['标准版'],
    detail: '支持快充与双设备连接，适合通勤、学习和跑步使用。'
  }
];

export const mockCategories = ['推荐', '鞋靴', '服饰', '数码'];

export const mockUser: UserProfile = {
  id: 'u_001',
  nickname: '校园买手',
  phone: '13800000000',
  avatar: '/static/avatars/default-avatar.svg'
};

export const mockCart: CartItem[] = [];

export const mockAddresses: AddressItem[] = [
  {
    id: 'addr_001',
    name: '徐超',
    phone: '13800000000',
    region: '上海市 浦东新区',
    detail: '张江高科软件园 8 号楼 1203 室',
    isDefault: true
  },
  {
    id: 'addr_002',
    name: '徐超',
    phone: '13800000000',
    region: '江苏省 南京市 栖霞区',
    detail: '大学城宿舍 2 栋 318',
    isDefault: false
  }
];

export const mockOrders: OrderItem[] = [
  {
    id: 'order_001',
    status: 'pending_shipping',
    amount: 499,
    createdAt: '2026-03-10 10:30',
    items: [
      {
        id: 'cart_seed_001',
        productId: 'p_001',
        quantity: 1,
        size: '42'
      }
    ]
  },
  {
    id: 'order_002',
    status: 'completed',
    amount: 899,
    createdAt: '2026-03-07 17:42',
    items: [
      {
        id: 'cart_seed_002',
        productId: 'p_003',
        quantity: 1,
        size: '标准版'
      }
    ]
  }
];

export const mockAfterSales: AfterSaleItem[] = [
  {
    id: 'after_001',
    orderId: 'order_002',
    productTitle: '降噪蓝牙耳机',
    reason: '外观有轻微划痕',
    status: 'reviewing'
  }
];
