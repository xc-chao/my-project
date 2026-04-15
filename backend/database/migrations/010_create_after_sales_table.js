export const name = '010_create_after_sales_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS after_sales (
      id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      order_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NULL,
      product_title VARCHAR(160) NOT NULL,
      product_cover VARCHAR(500) NULL,
      reason VARCHAR(500) NOT NULL,
      status ENUM('submitted', 'reviewing', 'approved', 'rejected') NOT NULL DEFAULT 'submitted',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_after_sales_user_id (user_id),
      KEY idx_after_sales_order_id (order_id),
      KEY idx_after_sales_status (status),
      CONSTRAINT fk_after_sales_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
      CONSTRAINT fk_after_sales_order_id
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
