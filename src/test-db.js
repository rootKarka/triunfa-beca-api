import { query } from './config/database.js';

const test = async () => {
  try {
    const res = await query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('Tablas disponibles en la BD:');
    res.rows.forEach(row => console.log(`   - ${row.table_name}`));
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit();
  }
};

test();