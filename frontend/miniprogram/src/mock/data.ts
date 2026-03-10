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
    cover: 'https://dummyimage.com/640x640/f3f4f6/111111&text=Sneaker',
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
    cover: 'https://dummyimage.com/640x640/e5e7eb/111111&text=Jacket',
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
    cover: 'https://dummyimage.com/640x640/dbeafe/111111&text=Audio',
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
  avatar: ''
};

export const mockCart: CartItem[] = [];
