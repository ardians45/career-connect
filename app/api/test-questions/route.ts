import { NextRequest } from 'next/server';
import { db } from '@/db';
import { testQuestion } from '@/db/schema/schema';
import { eq, desc, and } from 'drizzle-orm';
import { z } from 'zod';

// Zod validation schemas
const createTestQuestionSchema = z.object({
  questionText: z.string().min(1),
  category: z.string().min(1).max(1), // RIASEC category (R, I, A, S, E, C)
  order: z.number().int().min(1),
  isActive: z.boolean().optional(),
});

const updateTestQuestionSchema = z.object({
  questionText: z.string().min(1).optional(),
  category: z.string().min(1).max(1).optional(), // RIASEC category (R, I, A, S, E, C)
  order: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    if (id) {
      // Get specific test question by ID
      const result = await db.select().from(testQuestion).where(eq(testQuestion.id, id)).limit(1);
      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Test question not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(result[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (category) {
      // Get test questions by category
      let query = db.select().from(testQuestion);
      
      if (isActive !== null && isActive !== undefined) {
        // If isActive is provided, filter by both category and isActive
        const isActiveBool = isActive === 'true';
        query = query.where(and(
          eq(testQuestion.category, category),
          eq(testQuestion.isActive, isActiveBool)
        ));
      } else {
        // If isActive is not provided, just filter by category
        query = query.where(eq(testQuestion.category, category));
      }
      
      query = query.orderBy(testQuestion.order);
      
      const results = await query;
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (isActive !== null && isActive !== undefined) {
      // Get test questions by active status only
      const isActiveBool = isActive === 'true';
      const results = await db.select()
        .from(testQuestion)
        .where(eq(testQuestion.isActive, isActiveBool))
        .orderBy(testQuestion.order);
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all test questions
      const results = await db.select().from(testQuestion).orderBy(testQuestion.order);
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching test question:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTestQuestionSchema.parse(body);

    // Create new test question
    const [newQuestion] = await db.insert(testQuestion).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: validatedData.isActive ?? true,
    }).returning();

    return new Response(
      JSON.stringify(newQuestion),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating test question:', error);
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
        JSON.stringify({ error: 'Test question ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateTestQuestionSchema.parse(updateData);

    // Update test question
    const [updatedQuestion] = await db.update(testQuestion)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(testQuestion.id, id))
      .returning();

    if (!updatedQuestion) {
      return new Response(
        JSON.stringify({ error: 'Test question not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedQuestion),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating test question:', error);
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
        JSON.stringify({ error: 'Test question ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedQuestions = await db.delete(testQuestion).where(eq(testQuestion.id, id)).returning();

    if (deletedQuestions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Test question not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Test question deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting test question:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}