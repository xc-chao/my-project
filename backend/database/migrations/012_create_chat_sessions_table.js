export const name = '012_create_chat_sessions_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      title VARCHAR(160) NOT NULL,
      product_cover VARCHAR(500) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_chat_sessions_user_id (user_id),
      KEY idx_chat_sessions_product_id (product_id),
      KEY idx_chat_sessions_updated_at (updated_at),
      CONSTRAINT fk_chat_sessions_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
      CONSTRAINT fk_chat_sessions_product_id
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
