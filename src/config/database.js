import pg from 'pg';
import env from './env.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.db.url || undefined,

  host: env.db.url ? undefined : env.db.host,
  port: env.db.url ? undefined : env.db.port,
  database: env.db.url ? undefined : env.db.database,
  user: env.db.url ? undefined : env.db.user,
  password: env.db.url ? undefined : env.db.password,

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
  console.error(
    '---- Error inesperado en el pool de PostgreSQL: ---',
    err
  );
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

export { pool };