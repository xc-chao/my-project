export const name = '008_create_order_timeline_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_timeline (
      id VARCHAR(64) NOT NULL,
      order_id VARCHAR(64) NOT NULL,
      title VARCHAR(80) NOT NULL,
      description VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_order_timeline_order_id (order_id),
      KEY idx_order_timeline_created_at (created_at),
      CONSTRAINT fk_order_timeline_order_id
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
