export const name = '011_create_feedbacks_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NULL,
      product_title VARCHAR(160) NOT NULL,
      summary VARCHAR(500) NOT NULL,
      status ENUM('pending', 'resolved') NOT NULL DEFAULT 'pending',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_feedbacks_user_id (user_id),
      KEY idx_feedbacks_status (status),
      KEY idx_feedbacks_created_at (created_at),
      CONSTRAINT fk_feedbacks_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
