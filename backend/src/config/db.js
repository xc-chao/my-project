import mysql from 'mysql2/promise';
import { env } from './env.js';

let pool;

function getDatabaseConfig(includeDatabase = true) {
  return {
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    waitForConnections: true,
    connectionLimit: env.dbConnectionLimit,
    namedPlaceholders: true,
    timezone: 'Z',
    ...(includeDatabase ? { database: env.dbName } : {})
  };
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDatabaseConfig(true));
  }

  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

export async function withTransaction(handler) {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    const result = await handler(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function ensureDatabaseExists() {
  const connection = await mysql.createConnection(getDatabaseConfig(false));

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }
}

export async function pingDatabase() {
  const rows = await query('SELECT 1 AS ok');
  return Array.isArray(rows) && rows[0]?.ok === 1;
}

export async function closePool() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = undefined;
}
