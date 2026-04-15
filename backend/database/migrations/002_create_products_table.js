export const name = '002_create_products_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(64) NOT NULL,
      title VARCHAR(160) NOT NULL,
      subtitle VARCHAR(160) NOT NULL,
      price INT NOT NULL,
      original_price INT NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      sales INT NOT NULL DEFAULT 0,
      category VARCHAR(50) NOT NULL,
      cover VARCHAR(500) NOT NULL,
      detail TEXT NOT NULL,
      sale_status ENUM('on_sale', 'off_shelf') NOT NULL DEFAULT 'on_sale',
      badges_json JSON NOT NULL,
      sizes_json JSON NOT NULL,
      service_tags_json JSON NOT NULL,
      is_new_in_48h TINYINT(1) NOT NULL DEFAULT 0,
      praise_rate DECIMAL(5,2) NOT NULL DEFAULT 95.00,
      ship_within_hours INT NOT NULL DEFAULT 48,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_products_category (category),
      KEY idx_products_sale_status (sale_status),
      KEY idx_products_sales (sales),
      KEY idx_products_new_in_48h (is_new_in_48h),
      KEY idx_products_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
