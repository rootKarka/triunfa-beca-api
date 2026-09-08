import app from './app.js';
import env from './config/env.js';
import { pool } from './config/database.js';

const startServer = async () => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');

    console.log(
      `✅ Base de datos conectada: ${dbCheck.rows[0].now}`
    );

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`
╔══════════════════════════════════════════════╗
║       🎓 TRIUNFA BECA API v1.0              ║
║──────────────────────────────────────────────║
║  Entorno:  ${env.nodeEnv.padEnd(32)}║
║  Puerto:   ${String(env.port).padEnd(32)}║
╚══════════════════════════════════════════════╝
      `);
    });

  } catch (err) {
    console.error(
      '❌ No se pudo iniciar el servidor:',
      err.message
    );

    process.exit(1);
  }
};

startServer();