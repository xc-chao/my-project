export const name = '014_create_ai_call_logs_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_call_logs (
      id VARCHAR(64) NOT NULL,
      provider VARCHAR(32) NOT NULL,
      model VARCHAR(80) NOT NULL,
      success TINYINT(1) NOT NULL DEFAULT 0,
      fallback_used TINYINT(1) NOT NULL DEFAULT 0,
      latency_ms INT NOT NULL DEFAULT 0,
      error_message VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_ai_call_logs_provider (provider),
      KEY idx_ai_call_logs_created_at (created_at),
      KEY idx_ai_call_logs_success (success),
      KEY idx_ai_call_logs_fallback (fallback_used)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
