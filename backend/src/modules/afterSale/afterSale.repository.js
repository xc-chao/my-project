import { query } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

function mapAfterSaleRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    orderId: row.orderId,
    productId: row.productId || '',
    productTitle: row.productTitle,
    productCover: row.productCover || '',
    reason: row.reason,
    status: row.status,
    createdAt: row.createdAt
  };
}

export const afterSaleRepository = {
  async listByUserId(userId) {
    const rows = await query(
      `
        SELECT
          id,
          order_id AS orderId,
          product_id AS productId,
          product_title AS productTitle,
          product_cover AS productCover,
          reason,
          status,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt
        FROM after_sales
        WHERE user_id = ?
        ORDER BY created_at DESC, id DESC
      `,
      [userId]
    );

    return rows.map(mapAfterSaleRow);
  },
  async getById(userId, id) {
    const rows = await query(
      `
        SELECT
          id,
          order_id AS orderId,
          product_id AS productId,
          product_title AS productTitle,
          product_cover AS productCover,
          reason,
          status,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS createdAt
        FROM after_sales
        WHERE user_id = ? AND id = ?
        LIMIT 1
      `,
      [userId, id]
    );

    return mapAfterSaleRow(rows[0]);
  },
  async create(userId, payload) {
    const orderRows = await query(
      `
        SELECT id
        FROM orders
        WHERE id = ? AND user_id = ?
        LIMIT 1
      `,
      [payload.orderId, userId]
    );

    if (!orderRows[0]) {
      return null;
    }

    const orderItemRows = await query(
      `
        SELECT
          product_id AS productId,
          product_title AS productTitle,
          product_cover AS productCover
        FROM order_items
        WHERE order_id = ?
        ORDER BY (product_title = ?) DESC, created_at ASC
        LIMIT 1
      `,
      [payload.orderId, payload.productTitle]
    );
    const orderItem = orderItemRows[0] || null;
    const id = createId('after');

    await query(
      `
        INSERT INTO after_sales (
          id,
          user_id,
          order_id,
          product_id,
          product_title,
          product_cover,
          reason,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted')
      `,
      [
        id,
        userId,
        payload.orderId,
        orderItem?.productId || null,
        payload.productTitle || orderItem?.productTitle || '订单商品',
        orderItem?.productCover || null,
        payload.reason
      ]
    );

    return this.getById(userId, id);
  }
};
