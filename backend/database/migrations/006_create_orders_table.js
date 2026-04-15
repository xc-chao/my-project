export const name = '006_create_orders_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      status ENUM('pending_payment', 'pending_shipping', 'shipped', 'completed', 'cancelled') NOT NULL,
      amount INT NOT NULL DEFAULT 0,
      address_id VARCHAR(64) NULL,
      remark VARCHAR(255) NOT NULL DEFAULT '',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_orders_user_id (user_id),
      KEY idx_orders_status (status),
      KEY idx_orders_created_at (created_at),
      CONSTRAINT fk_orders_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
      CONSTRAINT fk_orders_address_id
        FOREIGN KEY (address_id) REFERENCES addresses (id)
        ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
