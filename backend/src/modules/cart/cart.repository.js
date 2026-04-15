import { getPool, query, withTransaction } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

function mapCartRow(row) {
  return {
    id: row.id,
    productId: row.productId,
    quantity: Number(row.quantity),
    size: row.size,
    product: {
      id: row.productId,
      title: row.productTitle,
      subtitle: row.productSubtitle,
      price: Number(row.productPrice),
      cover: row.productCover,
      category: row.productCategory,
      saleStatus: row.productSaleStatus
    }
  };
}

async function runQuery(executor, sql, params = []) {
  const [rows] = await executor.query(sql, params);
  return rows;
}

async function getCartRows(executor, userId) {
  return runQuery(
    executor,
    `
      SELECT
        c.id,
        c.product_id AS productId,
        c.quantity,
        c.size,
        p.title AS productTitle,
        p.subtitle AS productSubtitle,
        p.price AS productPrice,
        p.cover AS productCover,
        p.category AS productCategory,
        p.sale_status AS productSaleStatus
      FROM cart_items c
      INNER JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC, c.created_at DESC
    `,
    [userId]
  );
}

async function getProductById(executor, productId) {
  const rows = await runQuery(
    executor,
    `
      SELECT id, stock
      FROM products
      WHERE id = ?
      LIMIT 1
    `,
    [productId]
  );

  return rows[0] || null;
}

export const cartRepository = {
  async getCart(userId) {
    const rows = await getCartRows(getPool(), userId);
    const list = rows.map(mapCartRow);
    const totalCount = list.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = list.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

    return {
      list,
      totalCount,
      totalAmount
    };
  },
  async addItem(userId, payload) {
    const result = await withTransaction(async (connection) => {
      const product = await getProductById(connection, payload.productId);

      if (!product) {
        return null;
      }

      const existingRows = await runQuery(
        connection,
        `
          SELECT id, quantity
          FROM cart_items
          WHERE user_id = ? AND product_id = ? AND size = ?
          LIMIT 1
        `,
        [userId, payload.productId, payload.size]
      );

      if (existingRows[0]) {
        await connection.query(
          `
            UPDATE cart_items
            SET quantity = quantity + ?
            WHERE id = ?
          `,
          [payload.quantity, existingRows[0].id]
        );
      } else {
        await connection.query(
          `
            INSERT INTO cart_items (id, user_id, product_id, quantity, size, checked)
            VALUES (?, ?, ?, ?, ?, 1)
          `,
          [createId('cart'), userId, payload.productId, payload.quantity, payload.size]
        );
      }

      return true;
    });

    if (!result) {
      return null;
    }

    return this.getCart(userId);
  },
  async updateItem(userId, id, quantity) {
    const updateRows = await query(
      `
        UPDATE cart_items
        SET quantity = ?
        WHERE user_id = ? AND id = ?
      `,
      [quantity, userId, id]
    );

    if (!updateRows.affectedRows) {
      return null;
    }

    return this.getCart(userId);
  },
  async removeItem(userId, id) {
    const deleteRows = await query(
      `
        DELETE FROM cart_items
        WHERE user_id = ? AND id = ?
      `,
      [userId, id]
    );

    if (!deleteRows.affectedRows) {
      return null;
    }

    return this.getCart(userId);
  },
  async getCheckoutItems(userId, executor = getPool()) {
    const rows = await getCartRows(executor, userId);
    return rows.map(mapCartRow);
  },
  async clearCart(userId, executor) {
    await executor.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  }
};
