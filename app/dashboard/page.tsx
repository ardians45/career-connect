'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  GraduationCap, 
  Briefcase, 
  User,
  FileText,
  Plus,
  Clock,
  Star,
  Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDashboardSummary from '@/components/pdf-dashboard-summary';

interface UserProfile {
  name: string;
  school: string | null;
  grade: number | null;
  phone: string | null;
  lastTestDate: string;
  dominantType: string;
}

interface TestResult {
  id: string;
  completedAt: string;
  dominantType: string;
  secondaryType: string;
  tertiaryType: string;
  realisticScore: number;
  investigativeScore: number;
  artisticScore: number;
  socialScore: number;
  enterprisingScore: number;
  conventionalScore: number;
}

interface SavedRecommendation {
  id: string;
  recommendationType: 'major' | 'career';
  recommendationId: string;
  majorName?: string;
  majorDescription?: string;
  careerTitle?: string;
  careerDescription?: string;
  careerIndustry?: string;
  savedAt: string;
}

interface RecentTest {
  id: string;
  date: string;
  dominantType: string;
  types: string;
  score: number;
  title: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [recentTest, setRecentTest] = useState<RecentTest | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([]);
  const [totalAssessments, setTotalAssessments] = useState<number>(0);
  const [totalAssessmentsGrowth, setTotalAssessmentsGrowth] = useState<number>(0);
  const [profileCompletion, setProfileCompletion] = useState<number>(0);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (session && session.user) {
        try {
          // Fetch actual dashboard data from API
          const response = await fetch(`/api/dashboard/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            
            // Set user profile data from API response
            if (data.userProfile) {
              const profile = {
                name: data.userProfile.name || data.userProfile.email?.split('@')[0],
                school: data.userProfile.schoolName || null,
                grade: data.userProfile.grade || null,
                phone: data.userProfile.phone || null,
                lastTestDate: data.userProfile.updatedAt ? new Date(data.userProfile.updatedAt).toLocaleDateString() : 'Never',
                dominantType: 'R'
              };
              
              setUserProfile(profile);
              
              // Calculate profile completion percentage
              const profileFields = [
                data.userProfile.name,
                data.userProfile.schoolName,
                data.userProfile.grade,
                data.userProfile.phone
              ];
              
              const filledFields = profileFields.filter(field => field != null).length;
              const completionPercentage = Math.round((filledFields / profileFields.length) * 100);
              setProfileCompletion(completionPercentage);
            }
            
            setTestResults(data.testResults || []);
            setSavedRecommendations(data.savedRecommendations || []);
            setTotalAssessments(data.totalAssessments || 0);
            setTotalAssessmentsGrowth(data.totalAssessmentsGrowth || 0);
            
            if (data.latestTestResult) {
              // Format the test result to match expected structure
              setRecentTest({
                id: data.latestTestResult.id,
                date: data.latestTestResult.completedAt,
                dominantType: data.latestTestResult.dominantType,
                types: [
                  data.latestTestResult.dominantType,
                  data.latestTestResult.secondaryType,
                  data.latestTestResult.tertiaryType
                ].filter(Boolean).join('-'),
                // Calculate a representative score
                score: Math.max(
                  data.latestTestResult.realisticScore || 0,
                  data.latestTestResult.investigativeScore || 0,
                  data.latestTestResult.artisticScore || 0,
                  data.latestTestResult.socialScore || 0,
                  data.latestTestResult.enterprisingScore || 0,
                  data.latestTestResult.conventionalScore || 0
                ),
                title: 'RIASEC Career Assessment'
              });
            }
          } else {
            console.error('Failed to fetch dashboard data:', response.status, response.statusText);
            // Set default values in case of failure
            setTestResults([]);
            setSavedRecommendations([]);
            setTotalAssessments(0);
            setTotalAssessmentsGrowth(0);
            setProfileCompletion(0);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          // Set default values in case of error
          setTestResults([]);
          setSavedRecommendations([]);
          setTotalAssessments(0);
          setTotalAssessmentsGrowth(0);
          setProfileCompletion(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const handleStartTest = () => {
    router.push('/test');
  };

  const handleViewResult = (id: string) => {
    router.push(`/results/${id}`);
  };

  const handleViewRecommendation = (id: string) => {
    router.push(`/recommendations/${id}`);
  };

  useEffect(() => {
    if (!session && !isPending) {
      router.push('/sign-in');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.name || session.user?.name}! Track your career journey.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleStartTest} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
          {testResults && testResults.length > 0 && (
            <PDFDownloadLink
              document={
                <PdfDashboardSummary 
                  userProfile={{
                    name: userProfile?.name || session.user?.name || 'User',
                    school: userProfile?.school || null,
                    grade: userProfile?.grade || null
                  }}
                  testResults={testResults}
                />
              }
              fileName={`${userProfile?.name || session.user?.name || 'User'}-career-assessment-summary.pdf`}
            >
              {({ loading }) => (
                <Button className="flex items-center gap-2" disabled={loading}>
                  <Download className="h-4 w-4" />
                  {loading ? 'Generating...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground">+{totalAssessmentsGrowth} from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dominant Type</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTest?.dominantType || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Most recent result</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Recommendations</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">Career & education paths</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <p className="text-xs text-muted-foreground">Complete your profile</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Test Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Test Results
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push('/test-history')}>
                  View All
                </Button>
              </div>
              <CardDescription>
                Your latest RIASEC assessments and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.slice(0, 3).map((test) => (
                  <div 
                    key={test.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewResult(test.id)}
                  >
                    <div>
                      <h3 className="font-semibold">RIASEC Career Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(test.completedAt).toLocaleDateString()} • Type: {[
                          test.dominantType,
                          test.secondaryType,
                          test.tertiaryType
                        ].filter(Boolean).join('-')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {Math.max(
                          test.realisticScore,
                          test.investigativeScore,
                          test.artisticScore,
                          test.socialScore,
                          test.enterprisingScore,
                          test.conventionalScore
                        )}%
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile?.name || session.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">School</p>
                <p className="font-medium">{userProfile?.school || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-medium">{userProfile?.grade || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{userProfile?.phone || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Assessment</p>
                <p className="font-medium">{userProfile?.lastTestDate || 'Never'}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <EditProfileModal 
          isOpen={isEditProfileModalOpen} 
          onClose={() => setIsEditProfileModalOpen(false)} 
          userProfile={userProfile}
          userId={session?.user?.id}
        />
      </div>

      {/* Saved Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Saved Recommendations
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push('/recommendations')}>
              View All
            </Button>
          </div>
          <CardDescription>
            Career paths and majors you&#39;ve saved based on your test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="majors">Majors</TabsTrigger>
              <TabsTrigger value="careers">Careers</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {savedRecommendations.map((rec) => {
                const isMajor = rec.recommendationType === 'major';
                return (
                  <div 
                    key={rec.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewRecommendation(rec.recommendationId)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${isMajor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {isMajor ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{isMajor ? rec.majorName : rec.careerTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {isMajor ? 'Major' : rec.careerIndustry}
                        </p>
                        <p className="text-sm mt-1">{isMajor ? rec.majorDescription : rec.careerDescription}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline">Saved {new Date(rec.savedAt).toLocaleDateString()}</Badge>
                      <Button variant="outline" size="sm" className="mt-2">
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="majors" className="mt-4 space-y-4">
              {savedRecommendations
                .filter(rec => rec.recommendationType === 'major')
                .map((rec) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewRecommendation(rec.recommendationId)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{rec.majorName}</h3>
                        <p className="text-sm text-muted-foreground">Major</p>
                        <p className="text-sm mt-1">{rec.majorDescription}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline">Saved {new Date(rec.savedAt).toLocaleDateString()}</Badge>
                      <Button variant="outline" size="sm" className="mt-2">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="careers" className="mt-4 space-y-4">
              {savedRecommendations
                .filter(rec => rec.recommendationType === 'career')
                .map((rec) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewRecommendation(rec.recommendationId)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-800">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{rec.careerTitle}</h3>
                        <p className="text-sm text-muted-foreground">{rec.careerIndustry}</p>
                        <p className="text-sm mt-1">{rec.careerDescription}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline">Saved {new Date(rec.savedAt).toLocaleDateString()}</Badge>
                      <Button variant="outline" size="sm" className="mt-2">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;