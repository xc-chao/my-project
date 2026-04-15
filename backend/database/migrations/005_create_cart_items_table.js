export const name = '005_create_cart_items_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      size VARCHAR(32) NOT NULL,
      checked TINYINT(1) NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_cart_items_user_product_size (user_id, product_id, size),
      KEY idx_cart_items_user_id (user_id),
      KEY idx_cart_items_product_id (product_id),
      CONSTRAINT fk_cart_items_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
      CONSTRAINT fk_cart_items_product_id
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
