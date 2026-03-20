import { assetCatalog, pageImageMap, productVisualMap } from './page-image-map';

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
  gallery?: string[];
  saleStatus?: 'on_sale' | 'off_shelf';
}

export const imageCatalog = assetCatalog;

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  nickname: string;
  phone: string;
  avatar: string;
  role: UserRole;
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

export interface AdminFeedbackItem {
  id: string;
  userName: string;
  productTitle: string;
  summary: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface AdminOverview {
  metrics: Array<{
    label: string;
    value: string;
    hint: string;
    accent?: 'default' | 'danger';
  }>;
  modules: Array<{
    key: 'product' | 'order' | 'feedback';
    title: string;
    desc: string;
    value: string;
    hint: string;
  }>;
  hotProducts: Array<{
    id: string;
    title: string;
    sales: number;
    stock: number;
  }>;
  feedbacks: AdminFeedbackItem[];
  monitor: {
    todayCalls: number;
    fallbackCount: number;
    successRate: number;
    avgLatencyMs: number;
  };
}

const baseMockProducts: ProductItem[] = [
  {
    id: 'p_001',
    title: 'Nike Air Jordan 1 Low',
    subtitle: '黑白低帮',
    price: 1899,
    originalPrice: 2199,
    stock: 36,
    sales: 2300,
    category: '鞋靴',
    cover: productVisualMap.p_001.cover,
    badges: ['热门上新'],
    sizes: ['39', '40', '41', '42', '43'],
    detail: '经典低帮轮廓，适合通勤与日常穿搭，鞋型利落耐看。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_001.gallery
    ]
  },
  {
    id: 'p_002',
    title: '街头宽松卫衣',
    subtitle: '慵懒剪裁',
    price: 399,
    originalPrice: 529,
    stock: 18,
    sales: 1260,
    category: '服饰',
    cover: productVisualMap.p_002.cover,
    badges: ['本周热门'],
    sizes: ['M', 'L', 'XL'],
    detail: '落肩版型搭配宽松轮廓，适合日常休闲与轻街头风格。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_002.gallery
    ]
  },
  {
    id: 'p_003',
    title: '纯亚麻衬衫',
    subtitle: '轻透蓝调',
    price: 699,
    originalPrice: 899,
    stock: 58,
    sales: 4200,
    category: '服饰',
    cover: productVisualMap.p_003.cover,
    badges: ['轻透感'],
    sizes: ['M', 'L', 'XL'],
    detail: '适合春夏穿搭，版型宽松，适合通勤和轻正式场景。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_003.gallery
    ]
  },
  {
    id: 'p_004',
    title: '机能飞行夹克',
    subtitle: '轻量棕调',
    price: 899,
    originalPrice: 1099,
    stock: 22,
    sales: 980,
    category: '服饰',
    cover: productVisualMap.p_004.cover,
    badges: ['新色上架'],
    sizes: ['M', 'L', 'XL'],
    detail: '简洁机能感外套，日常通勤和层次穿搭都很合适。',
    saleStatus: 'off_shelf',
    gallery: [
      ...productVisualMap.p_004.gallery
    ]
  },
  {
    id: 'p_005',
    title: '修身牛仔长裤',
    subtitle: '浅蓝丹宁',
    price: 459,
    originalPrice: 599,
    stock: 31,
    sales: 1420,
    category: '服饰',
    cover: productVisualMap.p_005.cover,
    badges: ['穿搭推荐'],
    sizes: ['S', 'M', 'L'],
    detail: '高频通勤单品，面料挺括，适合日常轻松搭配。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_005.gallery
    ]
  },
  {
    id: 'p_006',
    title: '复古跑鞋',
    subtitle: '银灰拼色',
    price: 799,
    originalPrice: 999,
    stock: 29,
    sales: 1880,
    category: '鞋靴',
    cover: productVisualMap.p_006.cover,
    badges: ['跑鞋精选'],
    sizes: ['40', '41', '42', '43'],
    detail: '轻量鞋底搭配复古鞋面，适合城市通勤和周末出行。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_006.gallery
    ]
  },
  {
    id: 'p_007',
    title: '城市机能双肩包',
    subtitle: '黑灰通勤',
    price: 359,
    originalPrice: 459,
    stock: 40,
    sales: 960,
    category: '配件',
    cover: productVisualMap.p_007.cover,
    badges: ['通勤热卖'],
    sizes: ['标准版'],
    detail: '多隔层结构，容量适中，适合上课、通勤与短途出行。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_007.gallery
    ]
  },
  {
    id: 'p_008',
    title: '极简白色板鞋',
    subtitle: '百搭低帮',
    price: 599,
    originalPrice: 729,
    stock: 26,
    sales: 2140,
    category: '鞋靴',
    cover: productVisualMap.p_008.cover,
    badges: ['百搭首选'],
    sizes: ['39', '40', '41', '42'],
    detail: '干净鞋型适合四季穿搭，搭牛仔裤和阔腿裤都很顺手。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_008.gallery
    ]
  },
  {
    id: 'p_009',
    title: '毛呢棒球夹克',
    subtitle: '学院灰调',
    price: 699,
    originalPrice: 859,
    stock: 17,
    sales: 720,
    category: '服饰',
    cover: productVisualMap.p_009.cover,
    badges: ['换季推荐'],
    sizes: ['M', 'L', 'XL'],
    detail: '廓形利落，肩线自然，适合秋冬叠穿与校园风搭配。',
    saleStatus: 'off_shelf',
    gallery: [
      ...productVisualMap.p_009.gallery
    ]
  },
  {
    id: 'p_010',
    title: '连帽防风外套',
    subtitle: '轻户外黑',
    price: 539,
    originalPrice: 669,
    stock: 34,
    sales: 1310,
    category: '服饰',
    cover: productVisualMap.p_010.cover,
    badges: ['轻机能'],
    sizes: ['M', 'L', 'XL'],
    detail: '防风面料搭配轻量廓形，适合阴雨天气和城市轻户外场景。',
    saleStatus: 'on_sale',
    gallery: [
      ...productVisualMap.p_010.gallery
    ]
  }
];

const toneWords = ['暖沙', '奶油白', '焦糖', '燕麦', '赤陶', '米杏', '琥珀', '暖灰', '落日橙', '浅卡其'];
const subtitleWords = ['暖调主推', '通勤精选', '轻机能感', '本周上新', '街头百搭', '秋冬推荐', '校园热卖', '层次穿搭'];
const categorySequence: Array<'鞋靴' | '服饰' | '配件'> = ['鞋靴', '服饰', '服饰', '鞋靴', '配件'];
const itemWords = {
  鞋靴: ['复古跑鞋', '低帮板鞋', '拼色训练鞋', '德训休闲鞋', '高帮球鞋'],
  服饰: ['连帽卫衣', '飞行夹克', '直筒长裤', '针织开衫', '羊羔绒外套'],
  配件: ['校园双肩包', '斜挎小包', '棒球帽', '托特包', '旅行收纳袋']
} as const;

const generatedCoverPool = [
  imageCatalog.products.featured[0],
  imageCatalog.products.featured[1],
  imageCatalog.products.featured[2],
  imageCatalog.products.featured[3],
  imageCatalog.products.featured[4],
  imageCatalog.products.featured[5],
  imageCatalog.products.featured[6],
  imageCatalog.products.featured[7],
  imageCatalog.products.featured[8],
  imageCatalog.products.featured[9],
  imageCatalog.products.featured[10],
  imageCatalog.products.featured[11],
  imageCatalog.products.featured[12],
  imageCatalog.products.featured[13],
  imageCatalog.products.featured[14],
  imageCatalog.products.featured[15],
  imageCatalog.products.featured[16],
  imageCatalog.products.featured[17],
  imageCatalog.products.featured[18],
  imageCatalog.products.featured[19],
  imageCatalog.lifestyle.denim,
  imageCatalog.products.shirtBlue,
  imageCatalog.products.jacketBrown,
  imageCatalog.products.shoeBlack
];

function buildGeneratedGallery(category: '鞋靴' | '服饰' | '配件', index: number) {
  if (category === '鞋靴') {
    return [
      imageCatalog.details.featured[index % imageCatalog.details.featured.length],
      imageCatalog.details.featured[(index + 4) % imageCatalog.details.featured.length],
      imageCatalog.details.featured[(index + 8) % imageCatalog.details.featured.length]
    ];
  }

  if (category === '配件') {
    return [
      imageCatalog.hero.featured[index % imageCatalog.hero.featured.length],
      generatedCoverPool[(index + 3) % generatedCoverPool.length],
      imageCatalog.lifestyle.featured[(index + 5) % imageCatalog.lifestyle.featured.length]
    ];
  }

  return [
    generatedCoverPool[index % generatedCoverPool.length],
    imageCatalog.lifestyle.featured[(index + 2) % imageCatalog.lifestyle.featured.length],
    imageCatalog.hero.featured[(index + 6) % imageCatalog.hero.featured.length]
  ];
}

const generatedProducts: ProductItem[] = Array.from({ length: 40 }, (_, index) => {
  const category = categorySequence[index % categorySequence.length];
  const kinds = itemWords[category];
  const title = `${toneWords[index % toneWords.length]}${kinds[Math.floor(index / 2) % kinds.length]}`;
  const priceBase = category === '鞋靴' ? 559 : category === '配件' ? 189 : 299;
  const price = priceBase + (index % 6) * (category === '鞋靴' ? 90 : 40);
  const subtitle = subtitleWords[index % subtitleWords.length];
  const cover = generatedCoverPool[index % generatedCoverPool.length];

  return {
    id: `p_${String(index + 11).padStart(3, '0')}`,
    title,
    subtitle,
    price,
    originalPrice: price + (category === '鞋靴' ? 180 : 90),
    stock: 18 + (index % 9) * 4,
    sales: 560 + index * 73,
    category,
    cover,
    badges: [subtitleWords[index % subtitleWords.length]],
    sizes: category === '鞋靴' ? ['39', '40', '41', '42', '43'] : category === '配件' ? ['标准版'] : ['M', 'L', 'XL'],
    detail: `${title}主打${subtitle}路线，适合校园通勤、周末出街和日常搭配。`,
    saleStatus: index % 9 === 0 ? 'off_shelf' : 'on_sale',
    gallery: buildGeneratedGallery(category, index)
  };
});

export const mockProducts: ProductItem[] = [...baseMockProducts, ...generatedProducts];

export const mockCategories = ['推荐', '鞋靴', '服饰', '配件'];

export const mockUser: UserProfile = {
  id: 'u_001',
  nickname: '校园买手',
  phone: '13800000000',
  avatar: pageImageMap.profile.avatar,
  role: 'user'
};

export const mockAdminUser: UserProfile = {
  id: 'u_admin_001',
  nickname: '系统管理员',
  phone: '13900000000',
  avatar: pageImageMap.profile.avatar,
  role: 'admin'
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
    productTitle: '纯亚麻衬衫',
    reason: '面料颜色与预期略有差异，想进一步确认换货流程',
    status: 'reviewing'
  }
];

export const mockAdminOverview: AdminOverview = {
  metrics: [
    {
      label: '日订单',
      value: '128',
      hint: '较昨日 +12%'
    },
    {
      label: '待处理售后',
      value: '9',
      hint: '优先跟进异常订单',
      accent: 'danger'
    },
    {
      label: '在售商品',
      value: `${mockProducts.length}`,
      hint: '含球鞋、服饰与配件'
    },
    {
      label: '待看反馈',
      value: '12',
      hint: '含评价与体验建议'
    }
  ],
  modules: [
    {
      key: 'product',
      title: '商品管理',
      desc: '新增商品、上下架、库存维护、图片与富文本描述。',
      value: `${mockProducts.length} 款在列`,
      hint: '6 款低库存商品待关注'
    },
    {
      key: 'order',
      title: '订单处理',
      desc: '发货审核、订单状态流转、售后审批与日志记录。',
      value: '18 单待流转',
      hint: '含 9 条售后待处理'
    },
    {
      key: 'feedback',
      title: '用户反馈与数据看板',
      desc: '用户反馈查看、热销商品排行、订单趋势与 Agent 调用监控。',
      value: '3 个重点看板',
      hint: '今日 Agent 调用 86 次'
    }
  ],
  hotProducts: mockProducts
    .slice()
    .sort((left, right) => right.sales - left.sales)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      sales: item.sales,
      stock: item.stock
    })),
  feedbacks: [
    {
      id: 'feedback_001',
      userName: '周同学',
      productTitle: 'Nike Air Jordan 1 Low',
      summary: '希望详情页补充脚感与尺码建议，对比图再清晰一些。',
      status: 'pending',
      createdAt: '2026-03-10 09:20'
    },
    {
      id: 'feedback_002',
      userName: '林同学',
      productTitle: '街头宽松卫衣',
      summary: '搜索页筛选项建议增加价格区间与 48h 上新切换。',
      status: 'resolved',
      createdAt: '2026-03-09 21:10'
    },
    {
      id: 'feedback_003',
      userName: '陈同学',
      productTitle: '复古跑鞋',
      summary: '下单后物流节点展示清晰，售后入口位置可以再提前一些。',
      status: 'pending',
      createdAt: '2026-03-09 18:45'
    }
  ],
  monitor: {
    todayCalls: 86,
    fallbackCount: 2,
    successRate: 97,
    avgLatencyMs: 820
  }
};
