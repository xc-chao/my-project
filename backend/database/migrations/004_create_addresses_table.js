export const name = '004_create_addresses_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      name VARCHAR(50) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      region VARCHAR(120) NOT NULL,
      detail VARCHAR(255) NOT NULL,
      is_default TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_addresses_user_id (user_id),
      KEY idx_addresses_user_default (user_id, is_default),
      CONSTRAINT fk_addresses_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
