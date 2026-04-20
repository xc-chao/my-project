export const name = '015_allow_nullable_product_in_chat_sessions';

export async function up({ pool }) {
  await pool.query(`ALTER TABLE chat_sessions DROP FOREIGN KEY fk_chat_sessions_product_id`);
  await pool.query(`ALTER TABLE chat_sessions MODIFY product_id VARCHAR(64) NULL`);
  await pool.query(
    `ALTER TABLE chat_sessions ADD CONSTRAINT fk_chat_sessions_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE`
  );
}
