'use server';

import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { testResult, savedRecommendation, major, career } from '@/db/schema/schema';
import { user } from '@/db/schema/auth';

// Fungsi untuk mengambil hasil tes terbaru pengguna
export async function getUserTestResults(userId: string) {
  try {
    const results = await db
      .select({
        id: testResult.id,
        userId: testResult.userId,
        realisticScore: testResult.realisticScore,
        investigativeScore: testResult.investigativeScore,
        artisticScore: testResult.artisticScore,
        socialScore: testResult.socialScore,
        enterprisingScore: testResult.enterprisingScore,
        conventionalScore: testResult.conventionalScore,
        dominantType: testResult.dominantType,
        secondaryType: testResult.secondaryType,
        tertiaryType: testResult.tertiaryType,
        completedAt: testResult.completedAt,
        testDuration: testResult.testDuration,
        totalQuestions: testResult.totalQuestions,
      })
      .from(testResult)
      .where(eq(testResult.userId, userId))
      .orderBy(desc(testResult.completedAt));

    return results;
  } catch (error) {
    console.error('Error fetching user test results:', error);
    return [];
  }
}

// Fungsi untuk mengambil hasil tes terbaru pengguna
export async function getLatestTestResult(userId: string) {
  try {
    const result = await db
      .select({
        id: testResult.id,
        userId: testResult.userId,
        realisticScore: testResult.realisticScore,
        investigativeScore: testResult.investigativeScore,
        artisticScore: testResult.artisticScore,
        socialScore: testResult.socialScore,
        enterprisingScore: testResult.enterprisingScore,
        conventionalScore: testResult.conventionalScore,
        dominantType: testResult.dominantType,
        secondaryType: testResult.secondaryType,
        tertiaryType: testResult.tertiaryType,
        completedAt: testResult.completedAt,
        testDuration: testResult.testDuration,
        totalQuestions: testResult.totalQuestions,
      })
      .from(testResult)
      .where(eq(testResult.userId, userId))
      .orderBy(desc(testResult.completedAt))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching latest test result:', error);
    return null;
  }
}

// Fungsi untuk menghitung total tes yang telah diikuti pengguna
export async function getUserTotalAssessments(userId: string) {
  try {
    console.log('Fetching total assessments for user:', userId);
    const result = await db
      .select({ count: db.$count() })
      .from(testResult)
      .where(eq(testResult.userId, userId));
    
    console.log('Total assessments query result:', result);

    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error counting user assessments:', error);
    return 0;
  }
}

// Fungsi untuk mengambil rekomendasi yang disimpan oleh pengguna
export async function getUserSavedRecommendations(userId: string) {
  try {
    console.log('Fetching saved recommendations for user:', userId);
    const recommendations = await db
      .select({
        id: savedRecommendation.id,
        userId: savedRecommendation.userId,
        testResultId: savedRecommendation.testResultId,
        recommendationType: savedRecommendation.recommendationType,
        recommendationId: savedRecommendation.recommendationId,
        notes: savedRecommendation.notes,
        savedAt: savedRecommendation.savedAt,
        majorName: major.name,
        majorDescription: major.description,
        careerTitle: career.title,
        careerDescription: career.description,
        careerIndustry: career.industry,
      })
      .from(savedRecommendation)
      .leftJoin(major, eq(savedRecommendation.recommendationId, major.id))
      .leftJoin(career, eq(savedRecommendation.recommendationId, career.id))
      .where(eq(savedRecommendation.userId, userId))
      .orderBy(desc(savedRecommendation.savedAt));
    
    console.log('Saved recommendations query result count:', recommendations.length);

    return recommendations;
  } catch (error) {
    console.error('Error fetching user saved recommendations:', error);
    return [];
  }
}