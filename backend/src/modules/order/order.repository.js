import { getPool, query, withTransaction } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';
import { cartRepository } from '../cart/cart.repository.js';
import { normalizeImageUrl } from '../../common/utils/image-assets.js';

function mapAddressRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    region: row.region,
    detail: row.detail,
    isDefault: Boolean(row.isDefault)
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
      cover: normalizeImageUrl(row.productCover),
      price: Number(row.productPrice)
    }
  };
}

function buildSummary(items) {
  const goodsAmount = items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
  const shippingFee = items.length ? 12 : 0;
  const discountAmount = items.length ? 20 : 0;

  return {
    goodsAmount,
    shippingFee,
    discountAmount,
    payableAmount: Math.max(goodsAmount + shippingFee - discountAmount, 0)
  };
}

async function runQuery(executor, sql, params = []) {
  const [rows] = await executor.query(sql, params);
  return rows;
}

async function findAddressById(executor, userId, id) {
  const rows = await runQuery(
    executor,
    `
      SELECT
        id,
        name,
        phone,
        region,
        detail,
        is_default AS isDefault
      FROM addresses
      WHERE user_id = ? AND id = ?
      LIMIT 1
    `,
    [userId, id]
  );

  return mapAddressRow(rows[0]);
}

async function findDefaultAddress(executor, userId) {
  const rows = await runQuery(
    executor,
    `
      SELECT
        id,
        name,
        phone,
        region,
        detail,
        is_default AS isDefault
      FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, updated_at DESC, created_at DESC
      LIMIT 1
    `,
    [userId]
  );

  return mapAddressRow(rows[0]);
}

async function getOrderItemsMap(executor, orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => '?').join(', ');
  const rows = await runQuery(
    executor,
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

  const orderItemsMap = new Map();

  for (const row of rows) {
    const current = orderItemsMap.get(row.orderId) || [];
    current.push(mapOrderItemRow(row));
    orderItemsMap.set(row.orderId, current);
  }

  return orderItemsMap;
}

async function getOrderShipmentsMap(executor, orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => '?').join(', ');
  const rows = await runQuery(
    executor,
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

async function getOrderTimelineMap(executor, orderIds) {
  if (!orderIds.length) {
    return new Map();
  }

  const placeholders = orderIds.map(() => '?').join(', ');
  const rows = await runQuery(
    executor,
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

async function getAddressMap(executor, addressIds) {
  const validIds = addressIds.filter(Boolean);

  if (!validIds.length) {
    return new Map();
  }

  const placeholders = validIds.map(() => '?').join(', ');
  const rows = await runQuery(
    executor,
    `
      SELECT
        id,
        name,
        phone,
        region,
        detail,
        is_default AS isDefault
      FROM addresses
      WHERE id IN (${placeholders})
    `,
    validIds
  );

  return new Map(rows.map((row) => [row.id, mapAddressRow(row)]));
}

export const orderRepository = {
  async getPreview(userId) {
    const executor = getPool();
    const [address, items] = await Promise.all([
      findDefaultAddress(executor, userId),
      cartRepository.getCheckoutItems(userId, executor)
    ]);

    return {
      address,
      items,
      summary: buildSummary(items)
    };
  },
  async createOrder(userId, payload = {}) {
    const preview = await this.getPreview(userId);
    const selectedAddress = payload.addressId
      ? await findAddressById(getPool(), userId, payload.addressId)
      : preview.address;
    const orderId = createId('order');

    await withTransaction(async (connection) => {
      await connection.query(
        `
          INSERT INTO orders (id, user_id, status, amount, address_id, remark)
          VALUES (?, ?, 'pending_payment', ?, ?, ?)
        `,
        [orderId, userId, preview.summary.payableAmount, selectedAddress?.id || null, payload.remark || '']
      );

      for (const item of preview.items) {
        await connection.query(
          `
            INSERT INTO order_items (
              id,
              order_id,
              product_id,
              quantity,
              size,
              product_title,
              product_cover,
              product_price
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            createId('order_item'),
            orderId,
            item.productId,
            item.quantity,
            item.size,
            item.product?.title || '订单商品',
            item.product?.cover || '',
            item.product?.price || 0
          ]
        );
      }

      await connection.query(
        `
          INSERT INTO order_timeline (id, order_id, title, description)
          VALUES (?, ?, '订单创建', '用户提交订单，等待支付确认。')
        `,
        [createId('timeline'), orderId]
      );

      await cartRepository.clearCart(userId, connection);
    });

    return this.getOrderDetail(orderId, userId);
  },
  async listOrders(userId) {
    const orderRows = await query(
      `
        SELECT
          id,
          status,
          amount,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC, id DESC
      `,
      [userId]
    );
    const itemsMap = await getOrderItemsMap(getPool(), orderRows.map((row) => row.id));

    return orderRows.map((row) => ({
      id: row.id,
      status: row.status,
      amount: Number(row.amount),
      createdAt: row.createdAt,
      items: itemsMap.get(row.id) || []
    }));
  },
  async getOrderDetail(id, userId) {
    const orderRows = await query(
      `
        SELECT
          id,
          status,
          amount,
          address_id AS addressId,
          remark,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt
        FROM orders
        WHERE id = ? AND user_id = ?
        LIMIT 1
      `,
      [id, userId]
    );
    const order = orderRows[0];

    if (!order) {
      return null;
    }

    const executor = getPool();
    const [itemsMap, shipmentsMap, timelineMap, addressMap] = await Promise.all([
      getOrderItemsMap(executor, [id]),
      getOrderShipmentsMap(executor, [id]),
      getOrderTimelineMap(executor, [id]),
      getAddressMap(executor, [order.addressId])
    ]);

    return {
      id: order.id,
      status: order.status,
      amount: Number(order.amount),
      addressId: order.addressId || '',
      remark: order.remark || '',
      createdAt: order.createdAt,
      address: addressMap.get(order.addressId) || null,
      items: itemsMap.get(id) || [],
      logistics: shipmentsMap.get(id) || null,
      timeline: timelineMap.get(id) || []
    };
  }
};
