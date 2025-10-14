import { NextRequest } from 'next/server';
import { db } from '@/db';
import { counselingSession } from '@/db/schema/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Zod validation schemas
const createCounselingSessionSchema = z.object({
  teacherId: z.string(),
  studentId: z.string(),
  testResultId: z.string().optional(),
  sessionDate: z.string().datetime(),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
  followUpDate: z.string().datetime().optional(),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled']).default('scheduled'),
});

const updateCounselingSessionSchema = z.object({
  testResultId: z.string().optional(),
  sessionDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
  followUpDate: z.string().datetime().optional(),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    if (id) {
      // Get specific counseling session by ID
      const result = await db.select().from(counselingSession).where(eq(counselingSession.id, id)).limit(1);
      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Counseling session not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(result[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (teacherId) {
      // Get all counseling sessions for a specific teacher
      const results = await db.select()
        .from(counselingSession)
        .where(eq(counselingSession.teacherId, teacherId))
        .orderBy(desc(counselingSession.sessionDate));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (studentId) {
      // Get all counseling sessions for a specific student
      const results = await db.select()
        .from(counselingSession)
        .where(eq(counselingSession.studentId, studentId))
        .orderBy(desc(counselingSession.sessionDate));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (status) {
      // Get counseling sessions by status
      const results = await db.select()
        .from(counselingSession)
        .where(eq(counselingSession.status, status))
        .orderBy(desc(counselingSession.sessionDate));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all counseling sessions (for admin purposes, add auth checks in production)
      const results = await db.select().from(counselingSession).orderBy(desc(counselingSession.sessionDate));
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching counseling session:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCounselingSessionSchema.parse(body);

    // Check if a session already exists with the same teacher and student at the same time
    const existingSession = await db.select().from(counselingSession)
      .where(
        eq(counselingSession.teacherId, validatedData.teacherId),
        eq(counselingSession.studentId, validatedData.studentId),
        eq(counselingSession.sessionDate, new Date(validatedData.sessionDate))
      ).limit(1);
    
    if (existingSession.length > 0) {
      return new Response(
        JSON.stringify({ error: 'A session is already scheduled for this teacher and student at this time' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new counseling session
    const [newSession] = await db.insert(counselingSession).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      createdAt: new Date(),
      updatedAt: new Date(),
      status: validatedData.status || 'scheduled',
    }).returning();

    return new Response(
      JSON.stringify(newSession),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating counseling session:', error);
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
        JSON.stringify({ error: 'Counseling session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateCounselingSessionSchema.parse(updateData);

    // Update counseling session
    const [updatedSession] = await db.update(counselingSession)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(counselingSession.id, id))
      .returning();

    if (!updatedSession) {
      return new Response(
        JSON.stringify({ error: 'Counseling session not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedSession),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating counseling session:', error);
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
        JSON.stringify({ error: 'Counseling session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedSessions = await db.delete(counselingSession).where(eq(counselingSession.id, id)).returning();

    if (deletedSessions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Counseling session not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Counseling session deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting counseling session:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}