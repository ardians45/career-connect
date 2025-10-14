import { NextRequest } from 'next/server';
import { db } from '@/db';
import { savedRecommendation } from '@/db/schema/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Zod validation schemas
const createRecommendationSchema = z.object({
  userId: z.string(),
  testResultId: z.string().optional(),
  recommendationType: z.enum(['major', 'career']),
  recommendationId: z.string(),
  notes: z.string().optional(),
});

const updateRecommendationSchema = z.object({
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const recommendationType = searchParams.get('recommendationType');

    if (id) {
      // Get specific saved recommendation by ID
      const result = await db.select().from(savedRecommendation).where(eq(savedRecommendation.id, id)).limit(1);
      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Saved recommendation not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(result[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (userId) {
      // Get all saved recommendations for a specific user
      const results = await db.select()
        .from(savedRecommendation)
        .where(eq(savedRecommendation.userId, userId))
        .orderBy(desc(savedRecommendation.savedAt));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (recommendationType) {
      // Get saved recommendations by type
      const results = await db.select()
        .from(savedRecommendation)
        .where(eq(savedRecommendation.recommendationType, recommendationType))
        .orderBy(desc(savedRecommendation.savedAt));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all saved recommendations (for admin purposes, add auth checks in production)
      const results = await db.select().from(savedRecommendation).orderBy(desc(savedRecommendation.savedAt));
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching saved recommendation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRecommendationSchema.parse(body);

    // Check if this recommendation is already saved by this user
    const existingRecommendation = await db.select().from(savedRecommendation)
      .where(
        eq(savedRecommendation.userId, validatedData.userId),
        eq(savedRecommendation.recommendationType, validatedData.recommendationType),
        eq(savedRecommendation.recommendationId, validatedData.recommendationId)
      ).limit(1);
    
    if (existingRecommendation.length > 0) {
      return new Response(
        JSON.stringify({ error: 'This recommendation is already saved' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new saved recommendation
    const [newRecommendation] = await db.insert(savedRecommendation).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      savedAt: new Date(),
    }).returning();

    return new Response(
      JSON.stringify(newRecommendation),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating saved recommendation:', error);
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
        JSON.stringify({ error: 'Saved recommendation ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateRecommendationSchema.parse(updateData);

    // Update saved recommendation
    const [updatedRecommendation] = await db.update(savedRecommendation)
      .set(validatedData)
      .where(eq(savedRecommendation.id, id))
      .returning();

    if (!updatedRecommendation) {
      return new Response(
        JSON.stringify({ error: 'Saved recommendation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedRecommendation),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating saved recommendation:', error);
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
        JSON.stringify({ error: 'Saved recommendation ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedRecommendations = await db.delete(savedRecommendation).where(eq(savedRecommendation.id, id)).returning();

    if (deletedRecommendations.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Saved recommendation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Saved recommendation deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting saved recommendation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}