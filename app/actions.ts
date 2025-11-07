"use server";

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Import the schema
import * as schema from '@/db/combined-schema';

// Create a connection pool for server actions
const createDbPool = (connectionString: string) => {
  return new Pool({
    connectionString: connectionString,
  });
};

export async function getData() {
  let pool;
  try {
    pool = createDbPool(process.env.DATABASE_URL!);
    const db = drizzle(pool, { schema });
    
    // Example: Get all users
    const data = await db.select().from(schema.user).limit(10);
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    // Always close the pool to free resources
    if (pool) {
      await pool.end();
    }
  }
}

// Additional server actions for common operations
export async function getUserByEmail(email: string) {
  let pool;
  try {
    pool = createDbPool(process.env.DATABASE_URL!);
    const db = drizzle(pool, { schema });
    
    const users = await db.select().from(schema.user).where(
      schema.user.email.eq(email)
    ).limit(1);
    
    return users[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

export async function createUser(userData: {
  email: string;
  name: string;
  password?: string;
  image?: string;
  schoolName?: string;
  grade?: number;
  phone?: string;
}) {
  let pool;
  try {
    pool = createDbPool(process.env.DATABASE_URL!);
    const db = drizzle(pool, { schema });
    
    const [newUser] = await db.insert(schema.user).values({
      email: userData.email,
      name: userData.name,
      image: userData.image,
      schoolName: userData.schoolName,
      grade: userData.grade,
      phone: userData.phone,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}