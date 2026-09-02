import app from './app.js';
import env from './config/env.js';
import { pool } from './config/database.js'; // Asegúrate de que tu database.js exporte el pool por defecto

const startServer = async () => {
  try {
    // 1. Verificar conexión a la base de datos antes de levantar el servidor
    const dbCheck = await pool.query('SELECT NOW()');
    console.log(`✅ Base de datos conectada: ${dbCheck.rows[0].now}`);

    // 2. Iniciar servidor
    app.listen(env.port, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║       🎓 TRIUNFA BECA API v1.0              ║
║──────────────────────────────────────────────║
║  Entorno:  ${env.nodeEnv.padEnd(32)}║
║  Puerto:   ${String(env.port).padEnd(32)}║
║  URL:      ${`http://localhost:${env.port}`.padEnd(32)}║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor:', err.message);
    process.exit(1); // Salir con código de error si la BD falla
  }
};

startServer();