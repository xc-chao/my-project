import { query } from '../../config/db.js';

function parseJsonArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function mapProductRow(row, gallery = []) {
  if (!row) {
    return null;
  }

  const praiseRate = row.praise_rate == null ? null : Number(row.praise_rate);
  const shipWithinHours = row.ship_within_hours == null ? null : Number(row.ship_within_hours);

  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    stock: Number(row.stock),
    sales: Number(row.sales),
    category: row.category,
    cover: row.cover,
    detail: row.detail,
    saleStatus: row.sale_status,
    badges: parseJsonArray(row.badges_json),
    sizes: parseJsonArray(row.sizes_json),
    gallery,
    marketing: {
      isNewIn48h: Boolean(row.is_new_in_48h),
      praiseRate
    },
    serviceTags: parseJsonArray(row.service_tags_json),
    shipping: {
      shipWithinHours
    }
  };
}

function normalizeProductQuery(queryPayload = {}) {
  const page = Math.max(Number(queryPayload.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(queryPayload.pageSize || 100), 1), 100);

  return {
    keyword: String(queryPayload.keyword || '')
      .trim()
      .toLowerCase(),
    sort: String(queryPayload.sort || 'comprehensive'),
    scene: String(queryPayload.scene || ''),
    category: String(queryPayload.category || '').trim(),
    onSaleOnly:
      queryPayload.onSaleOnly === '1' || queryPayload.onSaleOnly === 'true' || queryPayload.onSaleOnly === true,
    page,
    pageSize,
    offset: (page - 1) * pageSize
  };
}

function buildWhereClause(queryPayload) {
  const clauses = [];
  const params = [];

  if (queryPayload.keyword) {
    const likeValue = `%${queryPayload.keyword}%`;
    clauses.push('(LOWER(title) LIKE ? OR LOWER(subtitle) LIKE ? OR LOWER(category) LIKE ?)');
    params.push(likeValue, likeValue, likeValue);
  }

  if (queryPayload.scene === 'newIn48h') {
    clauses.push('is_new_in_48h = 1');
  }

  if (queryPayload.scene === 'buyerFavorite') {
    clauses.push('(praise_rate >= 95 OR sales >= 1500)');
  }

  if (queryPayload.category) {
    clauses.push('category = ?');
    params.push(queryPayload.category);
  }

  if (queryPayload.onSaleOnly) {
    clauses.push("sale_status = 'on_sale'");
  }

  return {
    whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
}

function buildOrderByClause(sort) {
  if (sort === 'priceAsc') {
    return 'ORDER BY price ASC, sales DESC';
  }

  if (sort === 'priceDesc') {
    return 'ORDER BY price DESC, sales DESC';
  }

  if (sort === 'hot') {
    return 'ORDER BY sales DESC, praise_rate DESC';
  }

  return 'ORDER BY sales DESC, created_at DESC';
}

async function fetchGalleryMap(productIds) {
  if (!productIds.length) {
    return new Map();
  }

  const placeholders = productIds.map(() => '?').join(', ');
  const rows = await query(
    `
      SELECT product_id, image_url
      FROM product_galleries
      WHERE product_id IN (${placeholders})
      ORDER BY product_id ASC, sort_no ASC
    `,
    productIds
  );

  const galleryMap = new Map();

  for (const row of rows) {
    const current = galleryMap.get(row.product_id) || [];
    current.push(row.image_url);
    galleryMap.set(row.product_id, current);
  }

  return galleryMap;
}

async function queryProducts(queryPayload = {}) {
  const normalizedQuery = normalizeProductQuery(queryPayload);
  const { whereSql, params } = buildWhereClause(normalizedQuery);
  const orderBySql = buildOrderByClause(normalizedQuery.sort);
  const rows = await query(
    `
      SELECT
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
      FROM products
      ${whereSql}
      ${orderBySql}
      LIMIT ?
      OFFSET ?
    `,
    [...params, normalizedQuery.pageSize, normalizedQuery.offset]
  );
  const totalRows = await query(
    `
      SELECT COUNT(*) AS total
      FROM products
      ${whereSql}
    `,
    params
  );
  const galleryMap = await fetchGalleryMap(rows.map((row) => row.id));

  return {
    list: rows.map((row) => mapProductRow(row, galleryMap.get(row.id) || [row.cover])),
    total: Number(totalRows[0]?.total || 0),
    page: normalizedQuery.page,
    pageSize: normalizedQuery.pageSize
  };
}

export const productRepository = {
  async findAll(queryPayload = {}) {
    return queryProducts(queryPayload);
  },
  async search(keyword = '', queryPayload = {}) {
    return queryProducts({
      ...queryPayload,
      keyword
    });
  },
  async findById(id) {
    const rows = await query(
      `
        SELECT
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
        FROM products
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    if (!rows[0]) {
      return null;
    }

    const galleryMap = await fetchGalleryMap([id]);
    return mapProductRow(rows[0], galleryMap.get(id) || [rows[0].cover]);
  },
  async listCategories() {
    const rows = await query(
      `
        SELECT DISTINCT category
        FROM products
        ORDER BY category ASC
      `
    );

    return rows.map((row) => row.category);
  }
};
