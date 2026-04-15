export const name = '013_create_chat_messages_table';

export async function up({ pool }) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(64) NOT NULL,
      session_id VARCHAR(64) NOT NULL,
      role ENUM('user', 'assistant') NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_chat_messages_session_id (session_id),
      KEY idx_chat_messages_created_at (created_at),
      CONSTRAINT fk_chat_messages_session_id
        FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
