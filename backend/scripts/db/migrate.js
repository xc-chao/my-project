import { closePool, ensureDatabaseExists, getPool } from '../../src/config/db.js';
import { logStepDone, logStepStart, loadDatabaseModules } from './utils.js';

async function ensureMigrationTable() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_schema_migrations_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function getExecutedMigrationNames() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT name FROM schema_migrations ORDER BY id ASC');
  return new Set(rows.map((item) => item.name));
}

async function markMigrationExecuted(name) {
  const pool = getPool();
  await pool.query('INSERT INTO schema_migrations (name) VALUES (?)', [name]);
}

async function runMigrations() {
  await ensureDatabaseExists();
  await ensureMigrationTable();

  const migrations = await loadDatabaseModules('migrations');
  const executed = await getExecutedMigrationNames();

  for (const migration of migrations) {
    if (!migration.name) {
      throw new Error(`Migration ${migration.fileName} is missing exported name`);
    }

    if (typeof migration.up !== 'function') {
      throw new Error(`Migration ${migration.fileName} is missing exported up()`);
    }

    if (executed.has(migration.name)) {
      continue;
    }

    logStepStart('migrate', migration.name);
    await migration.up({ pool: getPool() });
    await markMigrationExecuted(migration.name);
    logStepDone('migrate', migration.name);
  }
}

runMigrations()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
