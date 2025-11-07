"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-serverless';
import { user } from "@/db/schema/auth";

// Import the schema
import * as schema from '@/db/combined-schema';

export async function getData() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });
    
    // Example: Get all users
    const data = await db.select().from(schema.user).limit(10);
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Additional server actions for common operations
export async function getUserByEmail(email: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });
    
    const user = await db.select().from(schema.user).where(
      schema.user.email.eq(email)
    ).limit(1);
    
    return user[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
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
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });
    
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
  }
}