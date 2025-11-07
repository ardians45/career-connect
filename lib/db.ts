import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

// Import all schema files
import * as authSchema from '@/db/schema/auth';
import * as mainSchema from '@/db/schema/schema';

// Combine all schemas
const schema = {
  ...authSchema,
  ...mainSchema
};

// Create a neon client using the serverless driver
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });