require('dotenv').config();
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// Create a simple drizzle instance without schema for testing
const db = drizzle(pool);

// Test querying users table
async function testQuery() {
  try {
    console.log('Testing query to Neon database...');
    
    // Try to count users (should return 0 or more)
    const result = await db.execute('SELECT COUNT(*) FROM "user"');
    
    console.log('Number of users in database:', result.rows[0].count);
    console.log('Query successful!');
    
    // Close the connection
    await pool.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Query failed:', error.message);
    process.exit(1);
  }
}

testQuery();