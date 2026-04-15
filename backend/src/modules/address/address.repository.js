import { getPool, query, withTransaction } from '../../config/db.js';
import { createId } from '../../common/utils/id.js';

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

async function runQuery(executor, sql, params = []) {
  const [rows] = await executor.query(sql, params);
  return rows;
}

async function listByUserIdWithExecutor(executor, userId) {
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
    `,
    [userId]
  );

  return rows.map(mapAddressRow);
}

async function findByIdWithExecutor(executor, userId, id) {
  const rows = await runQuery(
    executor,
    `
      SELECT
        id,
        user_id AS userId,
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

  return rows[0] || null;
}

export const addressRepository = {
  async listByUserId(userId) {
    return listByUserIdWithExecutor(getPool(), userId);
  },
  async findById(userId, id) {
    const row = await findByIdWithExecutor(getPool(), userId, id);
    return mapAddressRow(row);
  },
  async findDefault(userId) {
    const rows = await query(
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
  },
  async create(userId, payload) {
    await withTransaction(async (connection) => {
      const countRows = await runQuery(
        connection,
        `
          SELECT COUNT(*) AS total
          FROM addresses
          WHERE user_id = ?
        `,
        [userId]
      );
      const shouldSetDefault = Boolean(payload.isDefault) || Number(countRows[0]?.total || 0) === 0;

      if (shouldSetDefault) {
        await connection.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
      }

      await connection.query(
        `
          INSERT INTO addresses (id, user_id, name, phone, region, detail, is_default)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          createId('addr'),
          userId,
          payload.name,
          payload.phone,
          payload.region,
          payload.detail,
          shouldSetDefault ? 1 : 0
        ]
      );
    });

    return this.listByUserId(userId);
  },
  async update(userId, id, payload) {
    const target = await this.findById(userId, id);

    if (!target) {
      return null;
    }

    await withTransaction(async (connection) => {
      if (payload.isDefault) {
        await connection.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
      }

      await connection.query(
        `
          UPDATE addresses
          SET
            name = ?,
            phone = ?,
            region = ?,
            detail = ?,
            is_default = ?
          WHERE user_id = ? AND id = ?
        `,
        [
          payload.name,
          payload.phone,
          payload.region,
          payload.detail,
          payload.isDefault ? 1 : 0,
          userId,
          id
        ]
      );
    });

    return this.listByUserId(userId);
  },
  async remove(userId, id) {
    const target = await findByIdWithExecutor(getPool(), userId, id);

    if (!target) {
      return null;
    }

    await withTransaction(async (connection) => {
      await connection.query('DELETE FROM addresses WHERE user_id = ? AND id = ?', [userId, id]);

      if (target.isDefault) {
        const rows = await runQuery(
          connection,
          `
            SELECT id
            FROM addresses
            WHERE user_id = ?
            ORDER BY updated_at DESC, created_at DESC
            LIMIT 1
          `,
          [userId]
        );

        if (rows[0]?.id) {
          await connection.query('UPDATE addresses SET is_default = 1 WHERE id = ?', [rows[0].id]);
        }
      }
    });

    return this.listByUserId(userId);
  }
};
