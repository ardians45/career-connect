import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Zod validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  schoolName: z.string().optional(),
  grade: z.number().optional(),
  phone: z.string().optional(),
  role: z.enum(['student', 'teacher']).default('student'),
});

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  schoolName: z.string().optional(),
  grade: z.number().optional(),
  phone: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (id) {
      // Get specific user by ID
      const userData = await db.select().from(user).where(eq(user.id, id)).limit(1);
      if (userData.length === 0) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(userData[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (email) {
      // Get user by email
      const userData = await db.select().from(user).where(eq(user.email, email)).limit(1);
      if (userData.length === 0) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(userData[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all users (pagination for production use)
      const userData = await db.select().from(user);
      return new Response(
        JSON.stringify(userData),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if user already exists with the same email
    const existingUser = await db.select().from(user).where(eq(user.email, validatedData.email));
    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new user
    const [newUser] = await db.insert(user).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return new Response(
      JSON.stringify(newUser),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateUserSchema.parse(updateData);

    // Update user
    const [updatedUser] = await db.update(user)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedUser),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating user:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedUsers = await db.delete(user).where(eq(user.id, id)).returning();

    if (deletedUsers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}