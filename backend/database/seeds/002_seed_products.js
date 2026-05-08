import { normalizeImageUrl } from '../../src/common/utils/image-assets.js';

export const name = '002_seed_products';

function pad(num) {
  return String(num).padStart(2, '0');
}

function buildPool(folder, prefix, count) {
  return Array.from({ length: count }, (_, index) =>
    normalizeImageUrl(`/static/local-images/${folder}/${prefix}-${pad(index + 1)}.jpg`)
  );
}

const coverPool = buildPool('products', 'products-dewu-style', 20);
const detailPool = buildPool('details', 'details-dewu-style', 20);
const heroPool = buildPool('hero', 'hero-dewu-style', 10);
const lifestylePool = buildPool('lifestyle', 'lifestyle-dewu-style', 20);

const baseProducts = [
  {
    id: 'p_001',
    title: 'Nike Air Jordan 1 Low',
    subtitle: '黑白低帮',
    price: 1899,
    originalPrice: 2199,
    stock: 36,
    sales: 2300,
    category: '鞋靴',
    cover: coverPool[12],
    badges: ['热门上新'],
    sizes: ['39', '40', '41', '42', '43'],
    detail: '经典低帮轮廓，适合通勤与日常穿搭，鞋型利落耐看。',
    saleStatus: 'on_sale',
    gallery: [detailPool[8], detailPool[9], detailPool[18]],
    isNewIn48h: true,
    praiseRate: 96,
    shipWithinHours: 24
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
    cover: coverPool[15],
    badges: ['本周热门'],
    sizes: ['M', 'L', 'XL'],
    detail: '落肩版型搭配宽松轮廓，适合日常休闲与轻街头风格。',
    saleStatus: 'on_sale',
    gallery: [coverPool[15], coverPool[16], lifestylePool[19]],
    praiseRate: 95
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
    cover: coverPool[2],
    badges: ['轻透感'],
    sizes: ['M', 'L', 'XL'],
    detail: '适合春夏穿搭，版型宽松，适合通勤和轻正式场景。',
    saleStatus: 'on_sale',
    gallery: [coverPool[2], heroPool[8], lifestylePool[15]],
    praiseRate: 97
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
    cover: lifestylePool[16],
    badges: ['新色上架'],
    sizes: ['M', 'L', 'XL'],
    detail: '简洁机能感外套，日常通勤和层次穿搭都很合适。',
    saleStatus: 'off_shelf',
    gallery: [lifestylePool[16], coverPool[17], lifestylePool[18]],
    isNewIn48h: true,
    praiseRate: 94
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
    cover: lifestylePool[5],
    badges: ['穿搭推荐'],
    sizes: ['S', 'M', 'L'],
    detail: '高频通勤单品，面料挺括，适合日常轻松搭配。',
    saleStatus: 'on_sale',
    gallery: [lifestylePool[5], lifestylePool[0], lifestylePool[18]],
    praiseRate: 95
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
    cover: coverPool[8],
    badges: ['跑鞋精选'],
    sizes: ['40', '41', '42', '43'],
    detail: '轻量鞋底搭配复古鞋面，适合城市通勤和周末出行。',
    saleStatus: 'on_sale',
    gallery: [detailPool[5], detailPool[11], detailPool[16]],
    praiseRate: 96
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
    cover: heroPool[7],
    badges: ['通勤热卖'],
    sizes: ['标准版'],
    detail: '多隔层结构，容量适中，适合上课、通勤与短途出行。',
    saleStatus: 'on_sale',
    gallery: [heroPool[7], heroPool[8], lifestylePool[4]],
    praiseRate: 94
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
    cover: coverPool[9],
    badges: ['百搭首选'],
    sizes: ['39', '40', '41', '42'],
    detail: '干净鞋型适合四季穿搭，搭牛仔裤和阔腿裤都很顺手。',
    saleStatus: 'on_sale',
    gallery: [detailPool[0], detailPool[10], detailPool[18]],
    praiseRate: 97
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
    cover: coverPool[17],
    badges: ['换季推荐'],
    sizes: ['M', 'L', 'XL'],
    detail: '廓形利落，肩线自然，适合秋冬叠穿与校园风搭配。',
    saleStatus: 'off_shelf',
    gallery: [coverPool[17], lifestylePool[16], lifestylePool[19]],
    praiseRate: 93
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
    cover: coverPool[16],
    badges: ['轻机能'],
    sizes: ['M', 'L', 'XL'],
    detail: '防风面料搭配轻量廓形，适合阴雨天气和城市轻户外场景。',
    saleStatus: 'on_sale',
    gallery: [coverPool[16], lifestylePool[16], lifestylePool[18]],
    praiseRate: 95
  }
];

const toneWords = ['暖沙', '奶油白', '焦糖', '燕麦', '赤陶', '米杏', '琥珀', '暖灰', '落日橙', '浅卡其'];
const subtitleWords = ['暖调主推', '通勤精选', '轻机能感', '本周上新', '街头百搭', '秋冬推荐', '校园热卖', '层次穿搭'];
const categorySequence = ['鞋靴', '服饰', '服饰', '鞋靴', '配件'];
const itemWords = {
  鞋靴: ['复古跑鞋', '低帮板鞋', '拼色训练鞋', '德训休闲鞋', '高帮球鞋'],
  服饰: ['连帽卫衣', '飞行夹克', '直筒长裤', '针织开衫', '羊羔绒外套'],
  配件: ['校园双肩包', '斜挎小包', '棒球帽', '托特包', '旅行收纳袋']
};

function getSizes(category) {
  if (category === '鞋靴') {
    return ['39', '40', '41', '42', '43'];
  }

  if (category === '配件') {
    return ['标准版'];
  }

  return ['M', 'L', 'XL'];
}

function buildServiceTags({ shipWithinHours, isNewIn48h, praiseRate }) {
  const tags = [`${shipWithinHours}h 发货`, 'AI 穿搭建议', '7 天无理由'];

  if (isNewIn48h) {
    tags.push('48h 上新');
  }

  if (praiseRate >= 95) {
    tags.push(`${Math.round(praiseRate)}% 买手好评`);
  }

  return tags;
}

function normalizeProduct(rawProduct) {
  const isNewIn48h = rawProduct.isNewIn48h ?? rawProduct.badges.some((badge) => /上新|新色/.test(badge));
  const praiseRate = rawProduct.praiseRate ?? 95;
  const shipWithinHours = rawProduct.shipWithinHours ?? (isNewIn48h ? 24 : 48);
  const gallery = rawProduct.gallery?.length ? rawProduct.gallery : [rawProduct.cover];

  return {
    ...rawProduct,
    isNewIn48h,
    praiseRate,
    shipWithinHours,
    serviceTags: rawProduct.serviceTags || buildServiceTags({ shipWithinHours, isNewIn48h, praiseRate }),
    gallery
  };
}

const generatedProducts = Array.from({ length: 40 }, (_, offset) => {
  const index = offset + 11;
  const category = categorySequence[offset % categorySequence.length];
  const tone = toneWords[offset % toneWords.length];
  const itemList = itemWords[category];
  const item = itemList[offset % itemList.length];
  const subtitle = subtitleWords[offset % subtitleWords.length];
  const isNewIn48h = offset % 4 === 0;
  const praiseRate = 93 + (offset % 6);
  const shipWithinHours = isNewIn48h ? 24 : 48;
  const badges = [subtitle];

  if (isNewIn48h) {
    badges.unshift('热门上新');
  } else if (praiseRate >= 95) {
    badges.unshift('本周热门');
  }

  return {
    id: `p_${String(index).padStart(3, '0')}`,
    title: `${tone}${item}`,
    subtitle,
    price: 329 + offset * 22,
    originalPrice: 459 + offset * 24,
    stock: 14 + (offset % 8) * 4,
    sales: 620 + offset * 85,
    category,
    cover: coverPool[offset % coverPool.length],
    badges,
    sizes: getSizes(category),
    detail: `${tone}${item}延续街头与通勤的平衡感，适合校园、地铁通勤与周末外出穿搭。`,
    saleStatus: offset % 7 === 0 ? 'off_shelf' : 'on_sale',
    gallery: [
      coverPool[offset % coverPool.length],
      detailPool[offset % detailPool.length],
      lifestylePool[(offset + 3) % lifestylePool.length]
    ],
    isNewIn48h,
    praiseRate,
    shipWithinHours
  };
}).map(normalizeProduct);

const products = [...baseProducts.map(normalizeProduct), ...generatedProducts];

export async function seed({ pool }) {
  const productIds = products.map((product) => product.id);
  const deletePlaceholders = productIds.map(() => '?').join(', ');

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const product of products) {
      await connection.query(
        `
          INSERT INTO products (
            id,
            title,
            subtitle,
            price,
            original_price,
            stock,
            sales,
            category,
            cover,
            detail,
            sale_status,
            badges_json,
            sizes_json,
            service_tags_json,
            is_new_in_48h,
            praise_rate,
            ship_within_hours
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            price = VALUES(price),
            original_price = VALUES(original_price),
            stock = VALUES(stock),
            sales = VALUES(sales),
            category = VALUES(category),
            cover = VALUES(cover),
            detail = VALUES(detail),
            sale_status = VALUES(sale_status),
            badges_json = VALUES(badges_json),
            sizes_json = VALUES(sizes_json),
            service_tags_json = VALUES(service_tags_json),
            is_new_in_48h = VALUES(is_new_in_48h),
            praise_rate = VALUES(praise_rate),
            ship_within_hours = VALUES(ship_within_hours)
        `,
        [
          product.id,
          product.title,
          product.subtitle,
          product.price,
          product.originalPrice,
          product.stock,
          product.sales,
          product.category,
          product.cover,
          product.detail,
          product.saleStatus,
          JSON.stringify(product.badges),
          JSON.stringify(product.sizes),
          JSON.stringify(product.serviceTags),
          product.isNewIn48h ? 1 : 0,
          product.praiseRate,
          product.shipWithinHours
        ]
      );
    }

    if (productIds.length) {
      await connection.query(`DELETE FROM product_galleries WHERE product_id IN (${deletePlaceholders})`, productIds);
    }

    for (const product of products) {
      for (const [galleryIndex, imageUrl] of product.gallery.entries()) {
        await connection.query(
          `
            INSERT INTO product_galleries (product_id, image_url, sort_no)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
              image_url = VALUES(image_url)
          `,
          [product.id, imageUrl, galleryIndex + 1]
        );
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
