export const name = '001_create_users_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) NOT NULL,
      nickname VARCHAR(100) NOT NULL,
      avatar VARCHAR(500) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_users_phone (phone),
      KEY idx_users_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
