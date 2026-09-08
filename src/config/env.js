import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: parseInt(process.env.PORT, 10) || 3000,

  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    url: process.env.DATABASE_URL || null,

    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'triunfa_beca',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_dev_only',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS
        .split(',')
        .map(origin => origin.trim())
    : ['http://localhost:5173'],
};

export default env;