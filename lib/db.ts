import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Import all schema files
import * as authSchema from '@/db/schema/auth';
import * as mainSchema from '@/db/schema/schema';

// Combine all schemas
const schema = {
  ...authSchema,
  ...mainSchema
};

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });