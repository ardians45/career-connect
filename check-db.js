const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5433/postgres'
});

async function checkTables() {
  try {
    const client = await pool.connect();
    
    // Check if tables exist
    const tables = ['user', 'session', 'account', 'verification'];
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`Table "${table}" exists. Row count: ${result.rows[0].count}`);
      } catch (error) {
        console.log(`Table "${table}" does not exist or is inaccessible:`, error.message);
      }
    }
    
    client.release();
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();