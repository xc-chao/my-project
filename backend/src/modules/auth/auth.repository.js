import { normalizeImageUrl } from '../../common/utils/image-assets.js';
import { query } from '../../config/db.js';

const USER_FIELDS = `
  id,
  openid,
  nickname,
  avatar,
  phone,
  role
`;

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    openid: row.openid,
    nickname: row.nickname,
    avatar: normalizeImageUrl(row.avatar),
    phone: row.phone,
    role: row.role
  };
}

export const authRepository = {
  async findDefaultUser() {
    const rows = await query(
      `
        SELECT ${USER_FIELDS}
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
        SELECT ${USER_FIELDS}
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
        SELECT ${USER_FIELDS}
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
        SELECT ${USER_FIELDS}
        FROM users
        WHERE phone = ?
        LIMIT 1
      `,
      [phone]
    );

    return mapUserRow(rows[0]);
  },
  async findByOpenid(openid) {
    const rows = await query(
      `
        SELECT ${USER_FIELDS}
        FROM users
        WHERE openid = ?
        LIMIT 1
      `,
      [openid]
    );

    return mapUserRow(rows[0]);
  },
  async findOrCreateByOpenid({ openid, role = 'user' }) {
    const existing = await this.findByOpenid(openid);

    if (existing) {
      return existing;
    }

    const id = `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const nickname = role === 'admin' ? '系统管理员' : '微信用户';
    const avatar = normalizeImageUrl(
      role === 'admin'
        ? '/static/local-images/avatars/avatars-dewu-style-04.jpg'
        : '/static/local-images/avatars/avatars-dewu-style-14.jpg'
    );
    const phone = `wx_${openid.slice(0, 28)}`;

    await query(
      `
        INSERT INTO users (id, openid, nickname, avatar, phone, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [id, openid, nickname, avatar, phone, role]
    );

    return this.findById(id);
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
        SET openid = ?, nickname = ?, avatar = ?, phone = ?, role = ?
        WHERE id = ?
      `,
      [nextUser.openid || null, nextUser.nickname, nextUser.avatar, nextUser.phone, nextUser.role, id]
    );

    return this.findById(id);
  }
};
