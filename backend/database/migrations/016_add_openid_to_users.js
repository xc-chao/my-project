export const name = '016_add_openid_to_users';

export async function up({ pool }) {
  const [columns] = await pool.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'openid'
  `);

  if (!columns.length) {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN openid VARCHAR(128) NULL DEFAULT NULL AFTER id
    `);
  } else {
    await pool.query(`
      ALTER TABLE users
      MODIFY COLUMN openid VARCHAR(128) NULL DEFAULT NULL
    `);
  }

  await pool.query(`
    ALTER TABLE users
    DROP INDEX uk_users_openid
  `).catch(() => {});

  await pool.query(`
    ALTER TABLE users
    ADD UNIQUE KEY uk_users_openid (openid)
  `).catch(() => {});
}
