"use strict";
function buildSeries(category, prefix, count) {
  return Array.from({ length: count }, (_, index) => {
    return `/static/local-images/${category}/${prefix}-${String(index + 1).padStart(2, "0")}.jpg`;
  });
}
const assetCatalog = {
  hero: {
    store: "/static/local-images/hero/store-banner.jpg",
    featured: buildSeries("hero", "hero-dewu-style", 20)
  },
  lifestyle: {
    denim: "/static/local-images/lifestyle/denim-style.jpg",
    featured: buildSeries("lifestyle", "lifestyle-dewu-style", 20)
  },
  products: {
    shirtBlue: "/static/local-images/products/shirt-blue.jpg",
    featured: buildSeries("products", "products-dewu-style", 20)
  },
  details: {
    featured: buildSeries("details", "details-dewu-style", 20)
  },
  avatars: {
    featured: buildSeries("avatars", "avatars-dewu-style", 20)
  }
};
const pageImageMap = {
  home: {
    carousel: [
      {
        badge: "暖光主推",
        title: "暖调球鞋与新货陈列",
        desc: "暖调球鞋先看本周主推。",
        image: assetCatalog.products.featured[11],
        productId: "p_001"
      },
      {
        badge: "街头层搭",
        title: "卫衣夹克与城市日常",
        desc: "卫衣夹克承接城市日常。",
        image: assetCatalog.products.featured[15],
        productId: "p_002"
      },
      {
        badge: "球鞋主推",
        title: "白底新鞋与细节质感",
        desc: "鞋型配色与细节一屏看清。",
        image: assetCatalog.products.featured[3],
        productId: "p_008"
      },
      {
        badge: "通勤精选",
        title: "外套包袋与日常通勤",
        desc: "外套包袋一屏收进通勤灵感。",
        image: assetCatalog.hero.featured[7],
        productId: "p_007"
      },
      {
        badge: "暖调上新",
        title: "暖光衣架与本周上架",
        desc: "暖光衣架更适合承接上新。",
        image: assetCatalog.hero.featured[8],
        productId: "p_004"
      }
    ]
  },
  search: {
    inspiration: [
      {
        title: "球鞋橱窗",
        desc: "本周热门鞋款",
        image: assetCatalog.hero.featured[15]
      },
      {
        title: "街头穿搭",
        desc: "卫衣与夹克",
        image: assetCatalog.products.featured[15]
      },
      {
        title: "细节质感",
        desc: "近看材质轮廓",
        image: assetCatalog.details.featured[18]
      }
    ]
  },
  cart: {
    banner: assetCatalog.products.featured[11],
    accent: assetCatalog.products.featured[5]
  },
  address: {
    banner: assetCatalog.hero.featured[19],
    accent: assetCatalog.details.featured[10]
  },
  orderList: {
    banner: assetCatalog.hero.featured[18],
    accent: assetCatalog.products.featured[5]
  },
  orderConfirm: {
    banner: assetCatalog.hero.featured[19],
    accent: assetCatalog.details.featured[9]
  },
  afterSale: {
    banner: assetCatalog.products.featured[5],
    accent: assetCatalog.details.featured[10]
  },
  chat: {
    banner: assetCatalog.hero.featured[15],
    accent: assetCatalog.details.featured[8],
    historyThumb: assetCatalog.products.featured[16]
  },
  auth: {
    hero: assetCatalog.hero.store,
    support: [assetCatalog.products.featured[18], assetCatalog.hero.featured[9]],
    trustAvatars: [
      assetCatalog.avatars.featured[0],
      assetCatalog.avatars.featured[3],
      assetCatalog.avatars.featured[13]
    ]
  },
  profile: {
    banner: assetCatalog.hero.featured[13],
    avatar: assetCatalog.avatars.featured[13],
    services: [
      {
        title: "地址管理",
        desc: "维护默认收货地址",
        image: assetCatalog.hero.featured[19]
      },
      {
        title: "历史订单",
        desc: "查看物流与签收进度",
        image: assetCatalog.products.featured[5]
      },
      {
        title: "AI 咨询记录",
        desc: "保留最近会话摘要",
        image: assetCatalog.products.featured[16]
      },
      {
        title: "售后申请",
        desc: "提交问题并跟踪结果",
        image: assetCatalog.details.featured[10]
      }
    ]
  }
};
({
  p_001: {
    cover: assetCatalog.products.featured[12],
    gallery: [
      assetCatalog.details.featured[8],
      assetCatalog.details.featured[9],
      assetCatalog.details.featured[18]
    ]
  },
  p_002: {
    cover: assetCatalog.products.featured[15],
    gallery: [
      assetCatalog.products.featured[15],
      assetCatalog.products.featured[16],
      assetCatalog.lifestyle.featured[19]
    ]
  },
  p_003: {
    gallery: [
      assetCatalog.products.shirtBlue,
      assetCatalog.hero.featured[8],
      assetCatalog.lifestyle.featured[15]
    ]
  },
  p_004: {
    cover: assetCatalog.lifestyle.featured[16],
    gallery: [
      assetCatalog.lifestyle.featured[16],
      assetCatalog.products.featured[17],
      assetCatalog.lifestyle.featured[18]
    ]
  },
  p_005: {
    gallery: [
      assetCatalog.lifestyle.denim,
      assetCatalog.lifestyle.featured[0],
      assetCatalog.lifestyle.featured[18]
    ]
  },
  p_006: {
    cover: assetCatalog.products.featured[8],
    gallery: [
      assetCatalog.details.featured[5],
      assetCatalog.details.featured[11],
      assetCatalog.details.featured[16]
    ]
  },
  p_007: {
    cover: assetCatalog.hero.featured[7],
    gallery: [
      assetCatalog.hero.featured[7],
      assetCatalog.hero.featured[8],
      assetCatalog.lifestyle.featured[4]
    ]
  },
  p_008: {
    cover: assetCatalog.products.featured[9],
    gallery: [
      assetCatalog.details.featured[0],
      assetCatalog.details.featured[10],
      assetCatalog.details.featured[18]
    ]
  },
  p_009: {
    cover: assetCatalog.products.featured[17],
    gallery: [
      assetCatalog.products.featured[17],
      assetCatalog.lifestyle.featured[16],
      assetCatalog.lifestyle.featured[19]
    ]
  },
  p_010: {
    cover: assetCatalog.products.featured[16],
    gallery: [
      assetCatalog.products.featured[16],
      assetCatalog.lifestyle.featured[16],
      assetCatalog.lifestyle.featured[18]
    ]
  }
});
exports.assetCatalog = assetCatalog;
exports.pageImageMap = pageImageMap;
