import { query } from '../../config/db.js';

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    nickname: row.nickname,
    avatar: row.avatar,
    phone: row.phone,
    role: row.role
  };
}

export const authRepository = {
  async findDefaultUser() {
    const rows = await query(
      `
        SELECT id, nickname, avatar, phone, role
        FROM users
        ORDER BY FIELD(role, 'user', 'admin'), created_at ASC
        LIMIT 1
      `
    );

    return mapUserRow(rows[0]);
  },
  async findByRole(role = 'user') {
    const rows = await query(
      `
        SELECT id, nickname, avatar, phone, role
        FROM users
        WHERE role = ?
        ORDER BY created_at ASC
        LIMIT 1
      `,
      [role]
    );

    if (rows[0]) {
      return mapUserRow(rows[0]);
    }

    return this.findDefaultUser();
  },
  async findById(id) {
    const rows = await query(
      `
        SELECT id, nickname, avatar, phone, role
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    return mapUserRow(rows[0]);
  },
  async findByPhone(phone) {
    const rows = await query(
      `
        SELECT id, nickname, avatar, phone, role
        FROM users
        WHERE phone = ?
        LIMIT 1
      `,
      [phone]
    );

    return mapUserRow(rows[0]);
  },
  async updateById(id, payload) {
    const target = await this.findById(id);

    if (!target) {
      return null;
    }

    const nextUser = {
      ...target,
      ...payload
    };

    await query(
      `
        UPDATE users
        SET nickname = ?, avatar = ?, phone = ?, role = ?
        WHERE id = ?
      `,
      [nextUser.nickname, nextUser.avatar, nextUser.phone, nextUser.role, id]
    );

    return this.findById(id);
  }
};
