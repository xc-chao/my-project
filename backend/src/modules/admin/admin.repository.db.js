import { query, withTransaction } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

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
    badges: parseJsonArray(row.badges_json),
    sizes: parseJsonArray(row.sizes_json),
    gallery,
    saleStatus: row.sale_status,
    marketing: {
      isNewIn48h: Boolean(row.is_new_in_48h),
      praiseRate: Number(row.praise_rate)
    },
    serviceTags: parseJsonArray(row.service_tags_json),
    shipping: {
      shipWithinHours: Number(row.ship_within_hours)
    }
  };
}

function mapOrderItemRow(row) {
  return {
    id: row.id,
    productId: row.productId,
    quantity: Number(row.quantity),
    size: row.size,
    product: {
      id: row.productId,
      title: row.productTitle,
      cover: row.productCover,
      price: Number(row.productPrice)
    }
  };
}

function getStatusTimelineCopy(status, logistics) {
  return {
    pending_payment: ['支付待确认', '订单重新回到支付确认阶段。'],
    pending_shipping: ['支付已确认', '订单已进入待发货队列，等待仓配处理。'],
    shipped: [
      '订单已发货',
      logistics?.trackingNo
        ? `包裹已发出，${logistics.carrier} ${logistics.trackingNo} 正在运输中。`
        : '包裹已从仓库发出，正在运输途中。'
    ],
    completed: ['订单已完成', '用户已签收，订单流程完成。'],
    cancelled: ['订单已取消', '管理员已将订单调整为取消状态。']
  }[status];
}

function hasNewBadge(badges = []) {
  return badges.some((badge) => /上新|新品|新色/.test(badge));
}

function buildDefaultServiceTags(badges = []) {
  const tags = ['48h 发货', '7 天无理由', 'AI 穿搭建议'];

  if (hasNewBadge(badges)) {
    tags.unshift('48h 上新');
  }

  return Array.from(new Set(tags));
}

function formatTrendLabel(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}/${day}`;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDayKey(dayKey) {
  return new Date(`${dayKey}T00:00:00`);
}

function buildTrendCollection(rows) {
  const endDate = rows.length ? parseDayKey(rows[rows.length - 1].dayKey) : new Date();
  const valueMap = new Map(rows.map((row) => [row.dayKey, Number(row.value)]));
  const full = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (29 - index));
    const dayKey = formatDateKey(date);

    return {
      label: formatTrendLabel(date),
      value: valueMap.get(dayKey) || 0
    };
  });

  return {
    '7d': full.slice(-7),
    '30d': full
  };
}

function buildCategorySalesRanking(products) {
  const categoryMap = new Map();

  products.forEach((item) => {
    const target = categoryMap.get(item.category) || { value: 0, count: 0 };
    target.value += item.sales;
    target.count += 1;
    categoryMap.set(item.category, target);
  });

  return Array.from(categoryMap.entries())
    .map(([label, item]) => ({
      label,
      value: item.value,
      note: `${item.count} 款商品`
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
}

function normalizeAfterSaleReason(reason) {
  if (reason.includes('尺码') || reason.includes('换码')) {
    return '尺码/换码';
  }

  if (reason.includes('划痕') || reason.includes('压痕') || reason.includes('瑕疵')) {
    return '外观瑕疵';
  }

  if (reason.includes('包装')) {
    return '包装破损';
  }

  if (reason.includes('颜色') || reason.includes('色差') || reason.includes('描述')) {
    return '描述差异';
  }

  return '售后咨询';
}

function buildAfterSaleReasonRanking(afterSales) {
  const reasonMap = new Map();

  afterSales.forEach((item) => {
    const key = normalizeAfterSaleReason(item.reason);
    reasonMap.set(key, (reasonMap.get(key) || 0) + 1);
  });

  return Array.from(reasonMap.entries())
    .map(([label, value]) => ({
      label,
      value,
      note: `${value} 条申请`
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
}

async function runQuery(executor, sql, params = []) {
  const [rows] = await executor.query(sql, params);
  return rows;
}

async function getProductRowsByIds(productIds) {
  if (!productIds.length) {
    return [];
  }

  const placeholders = productIds.map(() => '?').join(', ');
  return query(
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
      WHERE id IN (${placeholders})
      ORDER BY created_at DESC, id DESC
    `,
    productIds
  );
}

async function getProductGalleryMap(productIds) {
  if (!productIds.length) {
    return new Map();
  }

  const placeholders = productIds.map(() => '?').join(', ');
  const rows = await query(
    `
      SELECT product_id AS productId, image_url AS imageUrl
      FROM product_galleries
      WHERE product_id IN (${placeholders})
      ORDER BY product_id ASC, sort_no ASC
    `,
    productIds
  );

  const galleryMap = new Map();

  for (const row of rows) {
    const current = galleryMap.get(row.productId) || [];
    current.push(row.imageUrl);
    galleryMap.set(row.productId, current);
  }

  return galleryMap;
}

async function listProductsFromDb() {
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
      ORDER BY created_at DESC, id DESC
    `
  );
  const galleryMap = await getProductGalleryMap(rows.map((row) => row.id));

  return rows.map((row) => mapProductRow(row, galleryMap.get(row.id) || [row.cover]));
}

async function findProductFromDb(id) {
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
  const row = rows[0];

  if (!row) {
    return null;
  }

  const galleryMap = await getProductGalleryMap([id]);
  return mapProductRow(row, galleryMap.get(id) || [row.cover]);
}

async function replaceProductGallery(connection, productId, galleryList) {
  await connection.query('DELETE FROM product_galleries WHERE product_id = ?', [productId]);

  for (const [index, imageUrl] of galleryList.entries()) {
    await connection.query(
      `
        INSERT INTO product_galleries (product_id, image_url, sort_no)
        VALUES (?, ?, ?)
      `,
      [productId, imageUrl, index + 1]
    );
  }
}

async function getOrderRows(orderIds = null) {
  if (orderIds && !orderIds.length) {
    return [];
  }

  if (orderIds) {
    const placeholders = orderIds.map(() => '?').join(', ');
    return query(
      `
        SELECT
          id,
          status,
          amount,
          remark,
          address_id AS addressId,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt
        FROM orders
        WHERE id IN (${placeholders})
        ORDER BY created_at DESC, id DESC
      `,
      orderIds
    );
  }

  return query(
    `
      SELECT
        id,
        status,
        amount,
        remark,
        address_id AS addressId,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt
      FROM orders
      ORDER BY created_at DESC, id DESC
    `
  );
}

async function getOrderItemsMap(orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => '?').join(', ');
  const rows = await query(
    `
      SELECT
        id,
        order_id AS orderId,
        product_id AS productId,
        quantity,
        size,
        product_title AS productTitle,
        product_cover AS productCover,
        product_price AS productPrice
      FROM order_items
      WHERE order_id IN (${placeholders})
      ORDER BY created_at ASC, id ASC
    `,
    orderIds
  );

  const itemsMap = new Map();

  for (const row of rows) {
    const current = itemsMap.get(row.orderId) || [];
    current.push(mapOrderItemRow(row));
    itemsMap.set(row.orderId, current);
  }

  return itemsMap;
}

async function getOrderShipmentsMap(orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => '?').join(', ');
  const rows = await query(
    `
      SELECT
        order_id AS orderId,
        carrier,
        tracking_no AS trackingNo,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') AS updatedAt
      FROM order_shipments
      WHERE order_id IN (${placeholders})
    `,
    orderIds
  );

  return new Map(rows.map((row) => [row.orderId, row]));
}

async function getOrderTimelineMap(orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => '?').join(', ');
  const rows = await query(
    `
      SELECT
        id,
        order_id AS orderId,
        title,
        description AS \`desc\`,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS time
      FROM order_timeline
      WHERE order_id IN (${placeholders})
      ORDER BY created_at ASC, id ASC
    `,
    orderIds
  );

  const timelineMap = new Map();

  for (const row of rows) {
    const current = timelineMap.get(row.orderId) || [];
    current.push({
      id: row.id,
      title: row.title,
      desc: row.desc,
      time: row.time
    });
    timelineMap.set(row.orderId, current);
  }

  return timelineMap;
}

async function hydrateOrders(orderRows, includeDetail = false) {
  const orderIds = orderRows.map((row) => row.id);
  const [itemsMap, shipmentsMap, timelineMap] = await Promise.all([
    getOrderItemsMap(orderIds),
    getOrderShipmentsMap(orderIds),
    includeDetail ? getOrderTimelineMap(orderIds) : Promise.resolve(new Map())
  ]);

  return orderRows.map((row) => ({
    id: row.id,
    status: row.status,
    amount: Number(row.amount),
    createdAt: row.createdAt,
    remark: row.remark || '',
    addressId: row.addressId || '',
    items: itemsMap.get(row.id) || [],
    logistics: shipmentsMap.get(row.id) || null,
    timeline: includeDetail ? timelineMap.get(row.id) || [] : undefined
  }));
}

async function getAfterSaleRows(orderId = '') {
  const rows = await query(
    `
      SELECT
        a.id,
        a.order_id AS orderId,
        a.product_title AS productTitle,
        a.reason,
        a.status,
        u.nickname AS userName,
        DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i') AS createdAt
      FROM after_sales a
      INNER JOIN users u ON u.id = a.user_id
      ${orderId ? 'WHERE a.order_id = ?' : ''}
      ORDER BY a.created_at DESC, a.id DESC
    `,
    orderId ? [orderId] : []
  );

  return rows.map((row) => ({
    id: row.id,
    orderId: row.orderId,
    productTitle: row.productTitle,
    reason: row.reason,
    status: row.status,
    userName: row.userName || '校园用户',
    createdAt: row.createdAt
  }));
}

async function getAfterSaleById(id) {
  const rows = await query(
    `
      SELECT
        a.id,
        a.order_id AS orderId,
        a.product_title AS productTitle,
        a.reason,
        a.status,
        u.nickname AS userName,
        DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i') AS createdAt
      FROM after_sales a
      INNER JOIN users u ON u.id = a.user_id
      WHERE a.id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0]
    ? {
        id: rows[0].id,
        orderId: rows[0].orderId,
        productTitle: rows[0].productTitle,
        reason: rows[0].reason,
        status: rows[0].status,
        userName: rows[0].userName || '校园用户',
        createdAt: rows[0].createdAt
      }
    : null;
}

async function getFeedbackRows() {
  const rows = await query(
    `
      SELECT
        f.id,
        u.nickname AS userName,
        f.product_title AS productTitle,
        f.summary,
        f.status,
        DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i') AS createdAt
      FROM feedbacks f
      INNER JOIN users u ON u.id = f.user_id
      ORDER BY f.created_at DESC, f.id DESC
    `
  );

  return rows.map((row) => ({
    id: row.id,
    userName: row.userName || '校园用户',
    productTitle: row.productTitle,
    summary: row.summary,
    status: row.status,
    createdAt: row.createdAt
  }));
}

async function getFeedbackById(id) {
  const rows = await query(
    `
      SELECT
        f.id,
        u.nickname AS userName,
        f.product_title AS productTitle,
        f.summary,
        f.status,
        DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i') AS createdAt
      FROM feedbacks f
      INNER JOIN users u ON u.id = f.user_id
      WHERE f.id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0]
    ? {
        id: rows[0].id,
        userName: rows[0].userName || '校园用户',
        productTitle: rows[0].productTitle,
        summary: rows[0].summary,
        status: rows[0].status,
        createdAt: rows[0].createdAt
      }
    : null;
}

async function getOrderTrendRows() {
  return query(
    `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dayKey,
        COUNT(*) AS value
      FROM orders
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY dayKey ASC
    `
  );
}

async function getAiTrendRows() {
  return query(
    `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d') AS dayKey,
        COUNT(*) AS value
      FROM ai_call_logs
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY dayKey ASC
    `
  );
}

async function getTodayOrderCount() {
  const rows = await query(
    `
      SELECT COUNT(*) AS total
      FROM orders
      WHERE DATE(created_at) = CURRENT_DATE()
    `
  );

  return Number(rows[0]?.total || 0);
}

async function getTodayAiMonitor() {
  const rows = await query(
    `
      SELECT
        COUNT(*) AS totalCalls,
        SUM(CASE WHEN fallback_used = 1 THEN 1 ELSE 0 END) AS fallbackCount,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successCount,
        AVG(latency_ms) AS avgLatencyMs
      FROM ai_call_logs
      WHERE DATE(created_at) = CURRENT_DATE()
    `
  );
  const row = rows[0] || {};
  const totalCalls = Number(row.totalCalls || 0);
  const successCount = Number(row.successCount || 0);
  const fallbackCount = Number(row.fallbackCount || 0);

  return {
    todayCalls: totalCalls,
    fallbackCount,
    successRate: totalCalls ? Math.round((successCount / totalCalls) * 100) : 0,
    avgLatencyMs: row.avgLatencyMs == null ? 0 : Math.round(Number(row.avgLatencyMs))
  };
}

export const adminRepository = {
  async getOverview() {
    const [products, orderRows, afterSales, orderTrendRows, agentTrendRows, todayOrderCount, monitor] = await Promise.all([
      listProductsFromDb(),
      getOrderRows(),
      getAfterSaleRows(),
      getOrderTrendRows(),
      getAiTrendRows(),
      getTodayOrderCount(),
      getTodayAiMonitor()
    ]);
    const feedbacks = await getFeedbackRows();
    const hotProducts = products
      .slice()
      .sort((left, right) => right.sales - left.sales)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.title,
        sales: item.sales,
        stock: item.stock
      }));
    const lowStockCount = products.filter((item) => item.stock <= 20).length;
    const pendingAfterSalesCount = afterSales.filter((item) =>
      item.status === 'submitted' || item.status === 'reviewing'
    ).length;
    const pendingFeedbackCount = feedbacks.filter((item) => item.status === 'pending').length;
    const pendingOrderCount = orderRows.filter((item) =>
      item.status === 'pending_payment' || item.status === 'pending_shipping'
    ).length;

    return {
      charts: {
        orderTrend: buildTrendCollection(orderTrendRows),
        agentTrend: buildTrendCollection(agentTrendRows)
      },
      rankings: {
        categorySales: buildCategorySalesRanking(products),
        afterSaleReasons: buildAfterSaleReasonRanking(afterSales)
      },
      metrics: [
        {
          label: '日订单',
          value: String(todayOrderCount),
          hint: '基于真实订单数据统计'
        },
        {
          label: '待处理售后',
          value: String(pendingAfterSalesCount),
          hint: '优先跟进异常订单',
          accent: 'danger'
        },
        {
          label: '在售商品',
          value: String(products.length),
          hint: '含球鞋、服饰与配件'
        },
        {
          label: '待看反馈',
          value: String(pendingFeedbackCount),
          hint: '含评价与体验建议'
        }
      ],
      modules: [
        {
          key: 'product',
          title: '商品管理',
          desc: '新增商品、上下架、库存维护、图片与富文本描述。',
          value: `${products.length} 款在列`,
          hint: `${lowStockCount} 款低库存商品待关注`
        },
        {
          key: 'order',
          title: '订单处理',
          desc: '发货审核、订单状态流转、售后审批与日志记录。',
          value: `${orderRows.length} 单在列`,
          hint: `含 ${pendingOrderCount} 单待推进`
        },
        {
          key: 'feedback',
          title: '用户反馈与数据看板',
          desc: '用户反馈查看、热销商品排行、订单趋势与 Agent 调用监控。',
          value: '5 个重点看板',
          hint: `今日 Agent 调用 ${monitor.todayCalls} 次`
        }
      ],
      hotProducts,
      feedbacks,
      monitor
    };
  },
  async listProducts() {
    return listProductsFromDb();
  },
  async getProductDetail(id) {
    return findProductFromDb(id);
  },
  async createProduct(payload) {
    const productId = createId('p');
    const gallery = payload.gallery?.length ? payload.gallery : [payload.cover];
    const badges = payload.badges || [];

    await withTransaction(async (connection) => {
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
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          productId,
          payload.title,
          payload.subtitle,
          payload.price,
          payload.originalPrice,
          payload.stock,
          payload.category,
          payload.cover,
          payload.detail,
          payload.saleStatus,
          JSON.stringify(badges),
          JSON.stringify(payload.sizes),
          JSON.stringify(buildDefaultServiceTags(badges)),
          hasNewBadge(badges) ? 1 : 0,
          95,
          48
        ]
      );

      await replaceProductGallery(connection, productId, gallery);
    });

    return findProductFromDb(productId);
  },
  async listOrders() {
    const orderRows = await getOrderRows();
    return hydrateOrders(orderRows, false);
  },
  async getOrderDetail(id) {
    const orderRows = await getOrderRows([id]);

    if (!orderRows[0]) {
      return null;
    }

    const hydrated = await hydrateOrders(orderRows, true);
    return hydrated[0] || null;
  },
  async listAfterSales(orderId = '') {
    return getAfterSaleRows(orderId);
  },
  async listFeedback() {
    return getFeedbackRows();
  },
  async updateProduct(id, payload) {
    const current = await findProductFromDb(id);

    if (!current) {
      return null;
    }

    const nextBadges = Array.isArray(payload.badges) ? payload.badges : current.badges;
    const nextSizes = Array.isArray(payload.sizes) ? payload.sizes : current.sizes;
    const nextGallery = Array.isArray(payload.gallery)
      ? payload.gallery.length
        ? payload.gallery
        : [payload.cover || current.cover]
      : current.gallery?.length
        ? current.gallery
        : [payload.cover || current.cover];
    const nextCover = payload.cover || current.cover;

    await withTransaction(async (connection) => {
      await connection.query(
        `
          UPDATE products
          SET
            title = ?,
            subtitle = ?,
            price = ?,
            original_price = ?,
            stock = ?,
            category = ?,
            cover = ?,
            detail = ?,
            sale_status = ?,
            badges_json = ?,
            sizes_json = ?,
            service_tags_json = ?,
            is_new_in_48h = ?,
            praise_rate = ?,
            ship_within_hours = ?
          WHERE id = ?
        `,
        [
          payload.title || current.title,
          payload.subtitle || current.subtitle,
          payload.price ?? current.price,
          payload.originalPrice ?? current.originalPrice,
          payload.stock ?? current.stock,
          payload.category || current.category,
          nextCover,
          payload.detail || current.detail,
          payload.saleStatus || current.saleStatus || 'on_sale',
          JSON.stringify(nextBadges),
          JSON.stringify(nextSizes),
          JSON.stringify(current.serviceTags?.length ? current.serviceTags : buildDefaultServiceTags(nextBadges)),
          hasNewBadge(nextBadges) ? 1 : 0,
          current.marketing?.praiseRate || 95,
          current.shipping?.shipWithinHours || 48,
          id
        ]
      );

      if (Array.isArray(payload.gallery) || typeof payload.cover === 'string') {
        await replaceProductGallery(connection, id, nextGallery);
      }
    });

    return findProductFromDb(id);
  },
  async updateOrderStatus(id, status) {
    const target = await this.getOrderDetail(id);

    if (!target) {
      return null;
    }

    await withTransaction(async (connection) => {
      await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

      const statusCopy = getStatusTimelineCopy(status, target.logistics);

      if (statusCopy) {
        await connection.query(
          `
            INSERT INTO order_timeline (id, order_id, title, description)
            VALUES (?, ?, ?, ?)
          `,
          [createId('timeline'), id, statusCopy[0], statusCopy[1]]
        );
      }
    });

    return this.getOrderDetail(id);
  },
  async updateOrderLogistics(id, payload) {
    const target = await this.getOrderDetail(id);

    if (!target) {
      return null;
    }

    await withTransaction(async (connection) => {
      await connection.query(
        `
          INSERT INTO order_shipments (order_id, carrier, tracking_no)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            carrier = VALUES(carrier),
            tracking_no = VALUES(tracking_no),
            updated_at = CURRENT_TIMESTAMP
        `,
        [id, payload.carrier, payload.trackingNo]
      );

      await connection.query(
        `
          INSERT INTO order_timeline (id, order_id, title, description)
          VALUES (?, ?, '物流信息已录入', ?)
        `,
        [createId('timeline'), id, `承运商为 ${payload.carrier}，物流单号 ${payload.trackingNo}。`]
      );
    });

    return this.getOrderDetail(id);
  },
  async updateAfterSaleStatus(id, status) {
    const result = await query('UPDATE after_sales SET status = ? WHERE id = ?', [status, id]);

    if (!result.affectedRows) {
      return null;
    }

    return getAfterSaleById(id);
  },
  async updateFeedbackStatus(id, status) {
    const result = await query('UPDATE feedbacks SET status = ? WHERE id = ?', [status, id]);

    if (!result.affectedRows) {
      return null;
    }

    return getFeedbackById(id);
  }
};
