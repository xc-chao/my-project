export const name = '003_create_product_galleries_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_galleries (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      product_id VARCHAR(64) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      sort_no INT NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_product_galleries_product_sort (product_id, sort_no),
      KEY idx_product_galleries_product_id (product_id),
      CONSTRAINT fk_product_galleries_product_id
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
