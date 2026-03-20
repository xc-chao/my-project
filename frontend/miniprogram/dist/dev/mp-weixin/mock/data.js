"use strict";
const mock_pageImageMap = require("./page-image-map.js");
const mockProducts = [
  {
    id: "p_001",
    title: "Nike Air Jordan 1 Low",
    subtitle: "黑白低帮",
    price: 1899,
    originalPrice: 2199,
    stock: 36,
    sales: 2300,
    category: "鞋靴",
    cover: mock_pageImageMap.productVisualMap.p_001.cover,
    badges: ["热门上新"],
    sizes: ["39", "40", "41", "42", "43"],
    detail: "经典低帮轮廓，适合通勤与日常穿搭，鞋型利落耐看。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_001.gallery
    ]
  },
  {
    id: "p_002",
    title: "街头宽松卫衣",
    subtitle: "慵懒剪裁",
    price: 399,
    originalPrice: 529,
    stock: 18,
    sales: 1260,
    category: "服饰",
    cover: mock_pageImageMap.productVisualMap.p_002.cover,
    badges: ["本周热门"],
    sizes: ["M", "L", "XL"],
    detail: "落肩版型搭配宽松轮廓，适合日常休闲与轻街头风格。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_002.gallery
    ]
  },
  {
    id: "p_003",
    title: "纯亚麻衬衫",
    subtitle: "轻透蓝调",
    price: 699,
    originalPrice: 899,
    stock: 58,
    sales: 4200,
    category: "服饰",
    cover: mock_pageImageMap.productVisualMap.p_003.cover,
    badges: ["轻透感"],
    sizes: ["M", "L", "XL"],
    detail: "适合春夏穿搭，版型宽松，适合通勤和轻正式场景。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_003.gallery
    ]
  },
  {
    id: "p_004",
    title: "机能飞行夹克",
    subtitle: "轻量棕调",
    price: 899,
    originalPrice: 1099,
    stock: 22,
    sales: 980,
    category: "服饰",
    cover: mock_pageImageMap.productVisualMap.p_004.cover,
    badges: ["新色上架"],
    sizes: ["M", "L", "XL"],
    detail: "简洁机能感外套，日常通勤和层次穿搭都很合适。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_004.gallery
    ]
  },
  {
    id: "p_005",
    title: "修身牛仔长裤",
    subtitle: "浅蓝丹宁",
    price: 459,
    originalPrice: 599,
    stock: 31,
    sales: 1420,
    category: "服饰",
    cover: mock_pageImageMap.productVisualMap.p_005.cover,
    badges: ["穿搭推荐"],
    sizes: ["S", "M", "L"],
    detail: "高频通勤单品，面料挺括，适合日常轻松搭配。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_005.gallery
    ]
  },
  {
    id: "p_006",
    title: "复古跑鞋",
    subtitle: "银灰拼色",
    price: 799,
    originalPrice: 999,
    stock: 29,
    sales: 1880,
    category: "鞋靴",
    cover: mock_pageImageMap.productVisualMap.p_006.cover,
    badges: ["跑鞋精选"],
    sizes: ["40", "41", "42", "43"],
    detail: "轻量鞋底搭配复古鞋面，适合城市通勤和周末出行。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_006.gallery
    ]
  },
  {
    id: "p_007",
    title: "城市机能双肩包",
    subtitle: "黑灰通勤",
    price: 359,
    originalPrice: 459,
    stock: 40,
    sales: 960,
    category: "配件",
    cover: mock_pageImageMap.productVisualMap.p_007.cover,
    badges: ["通勤热卖"],
    sizes: ["标准版"],
    detail: "多隔层结构，容量适中，适合上课、通勤与短途出行。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_007.gallery
    ]
  },
  {
    id: "p_008",
    title: "极简白色板鞋",
    subtitle: "百搭低帮",
    price: 599,
    originalPrice: 729,
    stock: 26,
    sales: 2140,
    category: "鞋靴",
    cover: mock_pageImageMap.productVisualMap.p_008.cover,
    badges: ["百搭首选"],
    sizes: ["39", "40", "41", "42"],
    detail: "干净鞋型适合四季穿搭，搭牛仔裤和阔腿裤都很顺手。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_008.gallery
    ]
  },
  {
    id: "p_009",
    title: "毛呢棒球夹克",
    subtitle: "学院灰调",
    price: 699,
    originalPrice: 859,
    stock: 17,
    sales: 720,
    category: "服饰",
    cover: mock_pageImageMap.productVisualMap.p_009.cover,
    badges: ["换季推荐"],
    sizes: ["M", "L", "XL"],
    detail: "廓形利落，肩线自然，适合秋冬叠穿与校园风搭配。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_009.gallery
    ]
  },
  {
    id: "p_010",
    title: "连帽防风外套",
    subtitle: "轻户外黑",
    price: 539,
    originalPrice: 669,
    stock: 34,
    sales: 1310,
    category: "服饰",
    cover: mock_pageImageMap.productVisualMap.p_010.cover,
    badges: ["轻机能"],
    sizes: ["M", "L", "XL"],
    detail: "防风面料搭配轻量廓形，适合阴雨天气和城市轻户外场景。",
    gallery: [
      ...mock_pageImageMap.productVisualMap.p_010.gallery
    ]
  }
];
const mockCategories = ["推荐", "鞋靴", "服饰", "配件"];
const mockUser = {
  id: "u_001",
  nickname: "校园买手",
  phone: "13800000000",
  avatar: mock_pageImageMap.pageImageMap.profile.avatar
};
const mockCart = [];
const mockAddresses = [
  {
    id: "addr_001",
    name: "徐超",
    phone: "13800000000",
    region: "上海市 浦东新区",
    detail: "张江高科软件园 8 号楼 1203 室",
    isDefault: true
  },
  {
    id: "addr_002",
    name: "徐超",
    phone: "13800000000",
    region: "江苏省 南京市 栖霞区",
    detail: "大学城宿舍 2 栋 318",
    isDefault: false
  }
];
const mockOrders = [
  {
    id: "order_001",
    status: "pending_shipping",
    amount: 499,
    createdAt: "2026-03-10 10:30",
    items: [
      {
        id: "cart_seed_001",
        productId: "p_001",
        quantity: 1,
        size: "42"
      }
    ]
  },
  {
    id: "order_002",
    status: "completed",
    amount: 899,
    createdAt: "2026-03-07 17:42",
    items: [
      {
        id: "cart_seed_002",
        productId: "p_003",
        quantity: 1,
        size: "标准版"
      }
    ]
  }
];
const mockAfterSales = [
  {
    id: "after_001",
    orderId: "order_002",
    productTitle: "纯亚麻衬衫",
    reason: "面料颜色与预期略有差异，想进一步确认换货流程",
    status: "reviewing"
  }
];
exports.mockAddresses = mockAddresses;
exports.mockAfterSales = mockAfterSales;
exports.mockCart = mockCart;
exports.mockCategories = mockCategories;
exports.mockOrders = mockOrders;
exports.mockProducts = mockProducts;
exports.mockUser = mockUser;
