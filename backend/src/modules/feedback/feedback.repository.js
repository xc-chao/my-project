import { query } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

export const feedbackRepository = {
  async listByProductId(productId) {
    const rows = await query(
      `
        SELECT
          f.id,
          u.nickname AS userName,
          f.summary,
          DATE_FORMAT(f.created_at, '%Y-%m-%d %H:%i') AS createdAt
        FROM feedbacks f
        INNER JOIN users u ON u.id = f.user_id
        WHERE f.product_id = ?
        ORDER BY f.created_at DESC, f.id DESC
        LIMIT 50
      `,
      [productId]
    );

    return rows.map((row) => ({
      id: row.id,
      userName: row.userName || '用户',
      summary: row.summary,
      createdAt: row.createdAt
    }));
  },

  async create(userId, payload) {
    const id = createId('fb');

    await query(
      `
        INSERT INTO feedbacks (id, user_id, product_id, product_title, summary, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `,
      [
        id,
        userId,
        payload.productId,
        payload.productTitle || null,
        payload.summary
      ]
    );

    return { id };
  }
};
