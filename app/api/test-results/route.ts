import { NextRequest } from 'next/server';
import { db } from '@/db';
import { testResult } from '@/db/schema/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Fungsi helper untuk membuat UUID
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback implementation if crypto.randomUUID is not available
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

interface CreateTestResultData {
  dominantType: string;
  secondaryType?: string;
  tertiaryType?: string;
  realisticScore: number;
  investigativeScore: number;
  artisticScore: number;
  socialScore: number;
  enterprisingScore: number;
  conventionalScore: number;
  userId?: string;
  guestSessionId?: string;
  testDuration?: number;
  totalQuestions: number;
  rawAnswers?: Record<string, unknown> | null;
}

// Fungsi validasi manual untuk test result
function validateCreateTestResult(data: CreateTestResultData) {
  // Required fields
  if (data.dominantType === undefined || typeof data.dominantType !== 'string' || data.dominantType.length !== 1) {
    throw new Error('dominantType must be a string of length 1');
  }
  
  if (typeof data.totalQuestions !== 'number' || data.totalQuestions < 1) {
    throw new Error('totalQuestions must be a number greater than 0');
  }
  
  // Score fields validation
  const scoreFields = [
    'realisticScore', 'investigativeScore', 'artisticScore', 
    'socialScore', 'enterprisingScore', 'conventionalScore'
  ];
  
  for (const field of scoreFields) {
    if (typeof data[field as keyof CreateTestResultData] !== 'number' || (data[field as keyof CreateTestResultData] as number) < 0) {
      throw new Error(`${field} must be a number greater than or equal to 0`);
    }
  }
  
  // Optional string fields with max length 1
  const optionalCharFields = ['secondaryType', 'tertiaryType'];
  for (const field of optionalCharFields) {
    if (data[field as keyof CreateTestResultData] !== undefined && (typeof data[field as keyof CreateTestResultData] !== 'string' || (data[field as keyof CreateTestResultData] as string).length > 1)) {
      throw new Error(`${field} must be a string of length 1 or undefined`);
    }
  }
  
  // Optional number fields
  if (data.testDuration !== undefined && typeof data.testDuration !== 'number') {
    throw new Error('testDuration must be a number if provided');
  }
  
  // Optional rawAnswers field
  if (data.rawAnswers !== undefined && typeof data.rawAnswers !== 'object') {
    throw new Error('rawAnswers must be an object if provided');
  }
  
  // Either userId or guestSessionId must be provided
  if (!data.userId && !data.guestSessionId) {
    throw new Error('Either userId or guestSessionId must be provided');
  }
  
  // If userId is provided, it must be a string
  if (data.userId && typeof data.userId !== 'string') {
    throw new Error('userId must be a string if provided');
  }
  
  // If guestSessionId is provided, it must be a string
  if (data.guestSessionId && typeof data.guestSessionId !== 'string') {
    throw new Error('guestSessionId must be a string if provided');
  }
  
  return data;
}

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
    console.log('Received test result data:', body); // Logging untuk debugging
    
    // Validasi data menggunakan fungsi manual
    const validatedData = validateCreateTestResult(body);
    console.log('Validated test result data:', validatedData); // Logging untuk debugging

    console.log('Attempting to insert test result to database with data:', {
      ...validatedData,
      id: generateId(),
      completedAt: new Date(),
    });

    // Create a clean object with only defined values to avoid database issues
    const testResultData = {
      id: generateId(),
      userId: validatedData.userId || null,
      guestSessionId: validatedData.guestSessionId || null,
      realisticScore: validatedData.realisticScore,
      investigativeScore: validatedData.investigativeScore,
      artisticScore: validatedData.artisticScore,
      socialScore: validatedData.socialScore,
      enterprisingScore: validatedData.enterprisingScore,
      conventionalScore: validatedData.conventionalScore,
      dominantType: validatedData.dominantType,
      secondaryType: validatedData.secondaryType || null, // Include the field, setting to null if undefined
      tertiaryType: validatedData.tertiaryType || null,   // Include the field, setting to null if undefined
      completedAt: new Date(),
      testDuration: validatedData.testDuration || null,
      totalQuestions: validatedData.totalQuestions,
      rawAnswers: validatedData.rawAnswers || null,
    };

    // Create new test result
    const insertedResult = await db.insert(testResult).values(testResultData as typeof testResult.$inferInsert).returning();

    console.log('Successfully saved test result:', insertedResult[0]?.id); // Logging untuk debugging
    return new Response(
      JSON.stringify(insertedResult[0]),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Full error object:', error); // Logging tambahan
    if (error instanceof Error && error.message && (error.message.includes('must be a string') || error.message.includes('must be a number'))) {
      console.error('Validation error:', error.message);
      return new Response(
        JSON.stringify({ error: 'Validation error', details: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Error creating test result:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }),
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

    // For PUT method, we'll do minimal validation since it's an update
    // Only verify that required fields for update are correct types if they exist
    if (updateData.dominantType !== undefined && 
        (typeof updateData.dominantType !== 'string' || updateData.dominantType.length !== 1)) {
      return new Response(
        JSON.stringify({ error: 'Validation error', details: 'dominantType must be a string of length 1' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const optionalCharFields = ['secondaryType', 'tertiaryType'];
    for (const field of optionalCharFields) {
      if (updateData[field] !== undefined && 
          (typeof updateData[field] !== 'string' || updateData[field].length > 1)) {
        return new Response(
          JSON.stringify({ error: `Validation error`, details: `${field} must be a string of length 1` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Validate number fields if they exist
    const optionalNumberFields = [
      'realisticScore', 'investigativeScore', 'artisticScore', 
      'socialScore', 'enterprisingScore', 'conventionalScore', 'testDuration', 'totalQuestions'
    ];
    
    for (const field of optionalNumberFields) {
      if (updateData[field] !== undefined && typeof updateData[field] !== 'number') {
        return new Response(
          JSON.stringify({ error: `Validation error`, details: `${field} must be a number` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    const validatedData = updateData;

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
        JSON.stringify({ error: 'Validation error', details: error.issues }),
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