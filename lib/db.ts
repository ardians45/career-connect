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

// For Neon, we need to handle the connection differently
// Since our test worked with ssl=false, we'll use that approach
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

export const db = drizzle(pool, { schema });