import { NextRequest } from 'next/server';
import { db } from '@/db';
import { major } from '@/db/schema/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Zod validation schemas
const createMajorSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  riasecTypes: z.string().min(1),
  degreeLevel: z.string().min(1),
  studyDuration: z.number().optional(),
  averageTuition: z.number().optional(),
  jobOutlook: z.string().optional(),
  averageSalary: z.number().optional(),
  popularityScore: z.number().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

const updateMajorSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  riasecTypes: z.string().min(1).optional(),
  degreeLevel: z.string().min(1).optional(),
  studyDuration: z.number().optional(),
  averageTuition: z.number().optional(),
  jobOutlook: z.string().optional(),
  averageSalary: z.number().optional(),
  popularityScore: z.number().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const riasecType = searchParams.get('riasecType');

    if (id) {
      // Get specific major by ID
      const result = await db.select().from(major).where(eq(major.id, id)).limit(1);
      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Major not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(result[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (riasecType) {
      // Get majors by RIASEC type
      const results = await db.select()
        .from(major)
        .where(major.riasecTypes.like(`%${riasecType}%`))
        .orderBy(desc(major.popularityScore));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all majors
      const results = await db.select().from(major).orderBy(desc(major.popularityScore));
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching major:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMajorSchema.parse(body);

    // Create new major
    const [newMajor] = await db.insert(major).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: validatedData.isActive ?? true,
    }).returning();

    return new Response(
      JSON.stringify(newMajor),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating major:', error);
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
        JSON.stringify({ error: 'Major ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateMajorSchema.parse(updateData);

    // Update major
    const [updatedMajor] = await db.update(major)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(major.id, id))
      .returning();

    if (!updatedMajor) {
      return new Response(
        JSON.stringify({ error: 'Major not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedMajor),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating major:', error);
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
        JSON.stringify({ error: 'Major ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedMajors = await db.delete(major).where(eq(major.id, id)).returning();

    if (deletedMajors.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Major not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Major deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting major:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}