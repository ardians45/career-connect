import { NextRequest } from 'next/server';
import { getUserTestResults, getLatestTestResult, getUserSavedRecommendations } from '@/lib/dashboard-actions';
import { getUserProfile } from '@/lib/user-actions';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Start minimal to identify the problem
    const testResults = await getUserTestResults(userId);
    console.log('Test results fetched:', testResults.length);
    
    const latestTestResult = await getLatestTestResult(userId);
    console.log('Latest test result fetched:', latestTestResult?.id);
    
    const savedRecommendations = await getUserSavedRecommendations(userId);
    console.log('Saved recommendations fetched:', savedRecommendations.length);
    
    const userProfile = await getUserProfile(userId);
    console.log('User profile fetched:', userProfile?.name);

    // Calculate assessment growth (simplified)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentAssessments = testResults.filter((result: any) => {
      try {
        const resultDate = new Date(result.completedAt);
        return resultDate >= oneMonthAgo && !isNaN(resultDate.getTime());
      } catch (error) {
        console.error('Error parsing date for assessment:', result.id, error);
        return false;
      }
    });

    const dashboardData = {
      testResults,
      latestTestResult,
      totalAssessments: testResults.length, // Use test results length for consistency
      totalAssessmentsGrowth: recentAssessments.length,
      savedRecommendations,
      userProfile,
    };

    console.log('Dashboard data successfully prepared for user:', userId);
    console.log('Test results count:', testResults.length);
    console.log('Latest test result ID:', latestTestResult?.id);
    console.log('Saved recommendations count:', savedRecommendations.length);
    console.log('Total assessments:', testResults.length);
    console.log('Recent assessments (last month):', recentAssessments.length);

    return new Response(JSON.stringify(dashboardData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch dashboard data', 
      details: (error as Error).message,
      stack: (error as Error).stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}