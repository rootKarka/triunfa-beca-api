import pg from 'pg';
import env from './env.js';

const { Pool } = pg;

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  if (env.nodeEnv === 'development') {
    console.log('--- Conexión establecida con PostgreSQL ----');
  }
});

pool.on('error', (err) => {
  console.error('---- Error inesperado en el pool de PostgreSQL: ---', err);
  process.exit(-1);
});

/**
 * Ejecuta una query con parámetros
 * @param {string} text - Consulta SQL
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise<import('pg').QueryResult>}
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Obtiene un cliente para transacciones
 * @returns {Promise<import('pg').PoolClient>}
 */
export const getClient = () => pool.connect();

export { pool };