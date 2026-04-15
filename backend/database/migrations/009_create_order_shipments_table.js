export const name = '009_create_order_shipments_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_shipments (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id VARCHAR(64) NOT NULL,
      carrier VARCHAR(30) NOT NULL,
      tracking_no VARCHAR(40) NOT NULL,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_order_shipments_order_id (order_id),
      CONSTRAINT fk_order_shipments_order_id
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
