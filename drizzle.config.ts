export default {
  out: './drizzle',
  schema: './db/combined-schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
