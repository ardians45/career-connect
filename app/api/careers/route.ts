import { NextRequest } from 'next/server';
import { db } from '@/db';
import { career } from '@/db/schema/schema';
import { eq, desc, ilike } from 'drizzle-orm';
import { z } from 'zod';

// Zod validation schemas
const createCareerSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  riasecTypes: z.string().min(1),
  industry: z.string().optional(),
  experienceLevel: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  educationRequirement: z.string().optional(),
  salaryRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  jobGrowthRate: z.number().optional(),
  popularityScore: z.number().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

const updateCareerSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  riasecTypes: z.string().min(1).optional(),
  industry: z.string().optional(),
  experienceLevel: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  educationRequirement: z.string().optional(),
  salaryRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  jobGrowthRate: z.number().optional(),
  popularityScore: z.number().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const riasecType = searchParams.get('riasecType');
    const industry = searchParams.get('industry');

    if (id) {
      // Get specific career by ID
      const result = await db.select().from(career).where(eq(career.id, id)).limit(1);
      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Career not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(result[0]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (riasecType) {
      // Get careers by RIASEC type
      const results = await db.select()
        .from(career)
        .where(ilike(career.riasecTypes, `%${riasecType}%`))
        .orderBy(desc(career.popularityScore));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (industry) {
      // Get careers by industry
      const results = await db.select()
        .from(career)
        .where(eq(career.industry, industry))
        .orderBy(desc(career.popularityScore));
        
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all careers
      const results = await db.select().from(career).orderBy(desc(career.popularityScore));
      return new Response(
        JSON.stringify(results),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching career:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCareerSchema.parse(body);

    // Create new career
    const [newCareer] = await db.insert(career).values({
      ...validatedData,
      id: crypto.randomUUID(), // Generate UUID
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: validatedData.isActive ?? true,
    }).returning();

    return new Response(
      JSON.stringify(newCareer),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating career:', error);
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
        JSON.stringify({ error: 'Career ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validatedData = updateCareerSchema.parse(updateData);

    // Update career
    const [updatedCareer] = await db.update(career)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(career.id, id))
      .returning();

    if (!updatedCareer) {
      return new Response(
        JSON.stringify({ error: 'Career not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedCareer),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error updating career:', error);
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
        JSON.stringify({ error: 'Career ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deletedCareers = await db.delete(career).where(eq(career.id, id)).returning();

    if (deletedCareers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Career not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Career deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting career:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}