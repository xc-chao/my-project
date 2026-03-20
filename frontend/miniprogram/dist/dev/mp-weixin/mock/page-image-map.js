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
    featured: buildSeries("lifestyle", "lifestyle-dewu-style", 20)
  },
  products: {
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
    heroPrimary: assetCatalog.hero.featured[0],
    heroSecondary: assetCatalog.hero.featured[15],
    heroAccent: assetCatalog.lifestyle.featured[4]
  },
  search: {
    inspiration: [
      {
        title: "球鞋橱窗",
        desc: "本周热门鞋款",
        image: assetCatalog.hero.featured[16]
      },
      {
        title: "街头穿搭",
        desc: "卫衣与夹克",
        image: assetCatalog.lifestyle.featured[6]
      },
      {
        title: "细节质感",
        desc: "近看材质轮廓",
        image: assetCatalog.details.featured[8]
      }
    ]
  },
  cart: {
    banner: assetCatalog.hero.featured[17],
    accent: assetCatalog.products.featured[5]
  },
  orderList: {
    banner: assetCatalog.hero.featured[14],
    accent: assetCatalog.lifestyle.featured[8]
  },
  orderConfirm: {
    banner: assetCatalog.hero.featured[19],
    accent: assetCatalog.details.featured[12]
  },
  afterSale: {
    banner: assetCatalog.lifestyle.featured[10],
    accent: assetCatalog.details.featured[6]
  },
  auth: {
    hero: assetCatalog.hero.store,
    support: [assetCatalog.lifestyle.featured[1], assetCatalog.hero.featured[9]],
    trustAvatars: assetCatalog.avatars.featured.slice(1, 4)
  },
  profile: {
    banner: assetCatalog.hero.featured[13],
    avatar: assetCatalog.avatars.featured[0]
  }
};
const productVisualMap = {
  p_001: {
    cover: assetCatalog.products.featured[13],
    gallery: [
      assetCatalog.details.featured[0],
      assetCatalog.details.featured[1],
      assetCatalog.details.featured[2]
    ]
  },
  p_002: {
    cover: assetCatalog.products.featured[15],
    gallery: [
      assetCatalog.details.featured[3],
      assetCatalog.details.featured[4],
      assetCatalog.details.featured[5]
    ]
  },
  p_003: {
    cover: assetCatalog.products.featured[18],
    gallery: [
      assetCatalog.details.featured[6],
      assetCatalog.details.featured[7],
      assetCatalog.details.featured[8]
    ]
  },
  p_004: {
    cover: assetCatalog.products.featured[19],
    gallery: [
      assetCatalog.details.featured[9],
      assetCatalog.details.featured[10],
      assetCatalog.details.featured[11]
    ]
  },
  p_005: {
    cover: assetCatalog.products.featured[17],
    gallery: [
      assetCatalog.details.featured[12],
      assetCatalog.details.featured[13],
      assetCatalog.details.featured[14]
    ]
  },
  p_006: {
    cover: assetCatalog.products.featured[8],
    gallery: [
      assetCatalog.details.featured[15],
      assetCatalog.details.featured[16],
      assetCatalog.details.featured[17]
    ]
  },
  p_007: {
    cover: assetCatalog.products.featured[6],
    gallery: [
      assetCatalog.details.featured[18],
      assetCatalog.details.featured[19],
      assetCatalog.details.featured[0]
    ]
  },
  p_008: {
    cover: assetCatalog.products.featured[10],
    gallery: [
      assetCatalog.details.featured[1],
      assetCatalog.details.featured[5],
      assetCatalog.details.featured[9]
    ]
  },
  p_009: {
    cover: assetCatalog.products.featured[16],
    gallery: [
      assetCatalog.details.featured[2],
      assetCatalog.details.featured[8],
      assetCatalog.details.featured[14]
    ]
  },
  p_010: {
    cover: assetCatalog.products.featured[5],
    gallery: [
      assetCatalog.details.featured[4],
      assetCatalog.details.featured[10],
      assetCatalog.details.featured[16]
    ]
  }
};
exports.pageImageMap = pageImageMap;
exports.productVisualMap = productVisualMap;
