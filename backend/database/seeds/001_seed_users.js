import { normalizeImageUrl } from '../../src/common/utils/image-assets.js';

export const name = '001_seed_users';

const seedUsers = [
  {
    id: 'u_001',
    openid: null,
    nickname: '校园买手',
    avatar: normalizeImageUrl('/static/local-images/avatars/avatars-dewu-style-14.jpg'),
    phone: '13800000000',
    role: 'user'
  },
  {
    id: 'u_admin_001',
    openid: null,
    nickname: '系统管理员',
    avatar: normalizeImageUrl('/static/local-images/avatars/avatars-dewu-style-04.jpg'),
    phone: '13900000000',
    role: 'admin'
  }
];

export async function seed({ pool }) {
  for (const user of seedUsers) {
    await pool.query(
      `
        INSERT INTO users (id, openid, nickname, avatar, phone, role)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          openid = VALUES(openid),
          nickname = VALUES(nickname),
          avatar = VALUES(avatar),
          phone = VALUES(phone),
          role = VALUES(role)
      `,
      [user.id, user.openid, user.nickname, user.avatar, user.phone, user.role]
    );
  }
}
