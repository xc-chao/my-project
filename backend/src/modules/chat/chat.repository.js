import { query, withTransaction } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

function parseJsonArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (!trimmed.startsWith('[')) {
      return [trimmed];
    }
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function mapMessageRow(row) {
  return {
    role: row.role,
    content: row.content
  };
}

function mapSessionRow(row, messages = []) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    productId: row.productId,
    title: row.title,
    productCover: row.productCover || '',
    messages
  };
}

async function runQuery(executor, sql, params = []) {
  const [rows] = await executor.query(sql, params);
  return rows;
}

async function getMessageMap(sessionIds) {
  if (!sessionIds.length) {
    return new Map();
  }

  const placeholders = sessionIds.map(() => '?').join(', ');
  const rows = await query(
    `
      SELECT
        session_id AS sessionId,
        role,
        content
      FROM chat_messages
      WHERE session_id IN (${placeholders})
      ORDER BY created_at ASC, id ASC
    `,
    sessionIds
  );
  const messageMap = new Map();

  for (const row of rows) {
    const current = messageMap.get(row.sessionId) || [];
    current.push(mapMessageRow(row));
    messageMap.set(row.sessionId, current);
  }

  return messageMap;
}

export const chatRepository = {
  async getProductContext(productId) {
    const rows = await query(
      `
        SELECT
          id,
          title,
          subtitle,
          category,
          cover,
          detail,
          price,
          badges_json AS badgesJson,
          sizes_json AS sizesJson,
          service_tags_json AS serviceTagsJson,
          praise_rate AS praiseRate,
          ship_within_hours AS shipWithinHours
        FROM products
        WHERE id = ?
        LIMIT 1
      `,
      [productId]
    );

    if (!rows[0]) {
      return null;
    }

    return {
      id: rows[0].id,
      title: rows[0].title,
      subtitle: rows[0].subtitle,
      category: rows[0].category,
      cover: rows[0].cover,
      detail: rows[0].detail,
      price: Number(rows[0].price),
      badges: parseJsonArray(rows[0].badgesJson),
      sizes: parseJsonArray(rows[0].sizesJson),
      serviceTags: parseJsonArray(rows[0].serviceTagsJson),
      praiseRate: Number(rows[0].praiseRate || 0),
      shipWithinHours: Number(rows[0].shipWithinHours || 0)
    };
  },
  async createSession(userId, product) {
    const sessionId = createId('chat');
    const openingMessage = `你好，这里是 AI 购物助手，我已经拿到 ${product.title} 的上下文，可以直接问我尺码、材质、物流和售后问题。`;

    await withTransaction(async (connection) => {
      await connection.query(
        `
          INSERT INTO chat_sessions (id, user_id, product_id, title, product_cover)
          VALUES (?, ?, ?, ?, ?)
        `,
        [sessionId, userId, product.id, product.title, product.cover]
      );

      await connection.query(
        `
          INSERT INTO chat_messages (id, session_id, role, content)
          VALUES (?, ?, 'assistant', ?)
        `,
        [createId('chat_msg'), sessionId, openingMessage]
      );
    });

    return this.getSessionById(userId, sessionId);
  },
  async getSessionById(userId, sessionId) {
    const rows = await query(
      `
        SELECT
          id,
          product_id AS productId,
          title,
          product_cover AS productCover
        FROM chat_sessions
        WHERE id = ? AND user_id = ?
        LIMIT 1
      `,
      [sessionId, userId]
    );

    if (!rows[0]) {
      return null;
    }

    const messageMap = await getMessageMap([sessionId]);
    return mapSessionRow(rows[0], messageMap.get(sessionId) || []);
  },
  async appendMessage(sessionId, role, content) {
    await query(
      `
        INSERT INTO chat_messages (id, session_id, role, content)
        VALUES (?, ?, ?, ?)
      `,
      [createId('chat_msg'), sessionId, role, content]
    );
    await query('UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [sessionId]);
  },
  async listHistory(userId) {
    const rows = await query(
      `
        SELECT
          id,
          product_id AS productId,
          title,
          product_cover AS productCover
        FROM chat_sessions
        WHERE user_id = ?
        ORDER BY updated_at DESC, created_at DESC
      `,
      [userId]
    );
    const messageMap = await getMessageMap(rows.map((row) => row.id));

    return rows.map((row) => mapSessionRow(row, messageMap.get(row.id) || []));
  }
};
