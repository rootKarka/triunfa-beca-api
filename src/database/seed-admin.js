/**
 * Crea (o actualiza) el usuario administrador inicial.
 *
 * Uso:
 *   node src/database/seed-admin.js
 *
 * Configurable por variables de entorno:
 *   ADMIN_NOMBRE  (default: "Administrador")
 *   ADMIN_CORREO  (default: "admin@triunfabeca.com")
 *   ADMIN_PASSWORD (default: "triunfa2026" — ¡cámbiala en producción!)
 */
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

const nombre = process.env.ADMIN_NOMBRE || 'Administrador';
const correo = (process.env.ADMIN_CORREO || 'admin@triunfabeca.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'triunfa2026';

async function seed() {
  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    `INSERT INTO usuarios (nombre, correo, password_hash, role, es_activo)
     VALUES ($1, $2, $3, 'admin', true)
     ON CONFLICT (correo)
     DO UPDATE SET password_hash = EXCLUDED.password_hash,
                   nombre = EXCLUDED.nombre,
                   es_activo = true`,
    [nombre, correo, passwordHash],
  );

  console.log(`✅ Usuario admin listo: ${correo}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error creando usuario admin:', err.message);
  process.exit(1);
});
