export const name = '007_create_order_items_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(64) NOT NULL,
      order_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      size VARCHAR(32) NOT NULL,
      product_title VARCHAR(160) NOT NULL,
      product_cover VARCHAR(500) NOT NULL,
      product_price INT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_order_items_order_id (order_id),
      KEY idx_order_items_product_id (product_id),
      CONSTRAINT fk_order_items_order_id
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
