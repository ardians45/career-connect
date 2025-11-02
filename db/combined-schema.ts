// File ini digunakan khusus untuk drizzle-kit
import * as authSchema from './schema/auth';
import * as mainSchema from './schema/schema';

// Gabungkan semua schema
export const schema = {
  ...authSchema,
  ...mainSchema
};

// Ekspor juga secara individual untuk kompatibilitas
export * from './schema/auth';
export * from './schema/schema';