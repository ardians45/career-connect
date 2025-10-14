import { NextRequest } from 'next/server';
import { db } from '@/db';
import { testResult } from '@/db/schema/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { z } from 'zod';

// Zod validation schemas
const createTestResultSchema = z.object({
  userId: z.string().optional(), // Allow guest users
  guestSessionId: z.string().optional(),
  realisticScore: z.number().min(0),
  investigativeScore: z.number().min(0),
  artisticScore: z.number().min(0),
  socialScore: z.number().min(0),
  enterprisingScore: z.number().min(0),
  conventionalScore: z.number().min(0),
  dominantType: z.string().min(1).max(1),
  secondaryType: z.string().optional().max(1),
  tertiaryType: z.string().optional().max(1),
  testDuration: z.number().optional(),
  totalQuestions: z.number().min(1),
  rawAnswers: z.record(z.any()).optional(), // For guest users
});

const updateTestResultSchema = z.object({
  realisticScore: z.number().min(0).optional(),
  investigativeScore: z.number().min(0).optional(),
  artisticScore: z.number().min(0).optional(),
  socialScore: z.number().min(0).optional(),
  enterprisingScore: z.number().min(0).optional(),
  conventionalScore: z.number().min(0).optional(),
  dominantType: z.string().min(1).max(1).optional(),
  secondaryType: z.string().max(1).optional(),
  tertiaryType: z.string().max(1).optional(),
  testDuration: z.number().optional(),
  totalQuestions: z.number().min(1).optional(),
  rawAnswers: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const guestSessionId = searchParams.get('guestSessionId');

    if (id) {
      // Get specific test result by ID
      const result = await db.select().from(testResult).where(eq(testResult.id, id)).limit(1);
      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Test result not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(result[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (userId) {
      // Get all test results for a specific user
      const results = await db.select()
        .from(testResult)
        .where(eq(testResult.userId, userId))
        .orderBy(desc(testResult.completedAt));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (guestSessionId) {
      // Get all test results for a specific guest session
      const results = await db.select()
        .from(testResult)
        .where(eq(testResult.guestSessionId, guestSessionId))
        .orderBy(desc(testResult.completedAt));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all test results (for admin purposes, add auth checks in production)
      const results = await db.select().from(testResult).orderBy(desc(testResult.completedAt));
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching test result:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTestResultSchema.parse(body);

    // Ensure either userId or guestSessionId is provided
    if (!validatedData.userId && !validatedData.guestSessionId) {
      return new Response(
        JSON.stringify({ error: 'Either userId or guestSessionId must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new test result
    const [newResult] = await db.insert(testResult).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      completedAt: new Date(),
    }).returning();

    return new Response(
      JSON.stringify(newResult),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating test result:', error);
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
        JSON.stringify({ error: 'Test result ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateTestResultSchema.parse(updateData);

    // Update test result
    const [updatedResult] = await db.update(testResult)
      .set(validatedData)
      .where(eq(testResult.id, id))
      .returning();

    if (!updatedResult) {
      return new Response(
        JSON.stringify({ error: 'Test result not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedResult),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating test result:', error);
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
        JSON.stringify({ error: 'Test result ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedResults = await db.delete(testResult).where(eq(testResult.id, id)).returning();

    if (deletedResults.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Test result not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Test result deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting test result:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}