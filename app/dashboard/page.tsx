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
          // Fetch dashboard data from API (excluding saved recommendations which will come from localStorage)
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
            setTotalAssessments(0);
            setTotalAssessmentsGrowth(0);
            setProfileCompletion(0);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          // Set default values in case of error
          setTestResults([]);
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

  // Load saved recommendations from localStorage to match the recommendations page
  useEffect(() => {
    if (!session) return;
    
    const loadBookmarks = () => {
      try {
        // Load bookmarked major objects from localStorage
        const storedMajorBookmarks = localStorage.getItem('bookmarkedMajors');
        const majorBookmarks = storedMajorBookmarks ? JSON.parse(storedMajorBookmarks) : [];
        
        // Load bookmarked career objects from localStorage
        const storedCareerBookmarks = localStorage.getItem('bookmarkedCareers');
        const careerBookmarks = storedCareerBookmarks ? JSON.parse(storedCareerBookmarks) : [];
        
        // Convert major bookmarks to saved recommendations format
        const majorRecommendations = majorBookmarks.map((major: any) => ({
          id: `major-${major.id}`,
          recommendationType: 'major' as const,
          recommendationId: major.id,
          majorName: major.name,
          majorDescription: major.description,
          savedAt: major.savedAt || new Date().toISOString(),
        }));
        
        // Convert career bookmarks to saved recommendations format
        const careerRecommendations = careerBookmarks.map((career: any) => ({
          id: `career-${career.id}`,
          recommendationType: 'career' as const,
          recommendationId: career.id,
          careerTitle: career.name,
          careerDescription: career.description,
          careerIndustry: career.industry,
          savedAt: career.savedAt || new Date().toISOString(),
        }));
        
        // Combine both into the saved recommendations array
        const allRecommendations = [...majorRecommendations, ...careerRecommendations];
        
        // Sort by savedAt in descending order (newest first)
        allRecommendations.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        
        setSavedRecommendations(allRecommendations);
      } catch (error) {
        console.error('Error loading bookmarks from localStorage:', error);
        setSavedRecommendations([]);
      }
    };

    // Load initial data
    loadBookmarks();
    
    // Set up event listener for storage changes so the dashboard updates when bookmarks change
    const handleStorageChange = () => {
      loadBookmarks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [session]);

  const handleStartTest = () => {
    router.push('/test');
  };

  const handleViewResult = (id: string) => {
    router.push(`/results/${id}`);
  };

  const handleViewRecommendation = (id: string) => {
    // Determine if this is a major or career recommendation based on the savedRecommendations state
    const recommendation = savedRecommendations.find(rec => rec.recommendationId === id);
    
    if (recommendation) {
      if (recommendation.recommendationType === 'major') {
        router.push(`/majors/${id}`);
      } else {
        router.push(`/careers/${id}`);
      }
    } else {
      // Fallback: if we can't determine the type, navigate to the generic recommendation page
      router.push(`/recommendations/${id}`);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Dasbor</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali, {userProfile?.name || session.user?.name}! Lacak perjalanan karir Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleStartTest} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ikuti Tes
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
                  {loading ? 'Menghasilkan...' : 'Unduh Hasil Tes'}
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
            <CardTitle className="text-sm font-medium">Total Penilaian</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground">+{totalAssessmentsGrowth} dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tipe Dominan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentTest?.dominantType || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Hasil terbaru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rekomendasi Tersimpan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">Jalur karir & pendidikan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kelengkapan Profil</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <p className="text-xs text-muted-foreground">Lengkapi profil Anda</p>
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
                  Hasil Tes Terbaru
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push('/test-history')}>
                  Lihat Semua
                </Button>
              </div>
              <CardDescription>
                Penilaian dan hasil RIASEC terbaru Anda
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
                      <h3 className="font-semibold">Penilaian Karir RIASEC</h3>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(test.completedAt).toLocaleDateString()} • Tipe: {[
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
                        Lihat
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
              Profil Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-medium">{userProfile?.name || session.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sekolah</p>
                <p className="font-medium">{userProfile?.school || 'Tidak disebutkan'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas</p>
                <p className="font-medium">{userProfile?.grade || 'Tidak disebutkan'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="font-medium">{userProfile?.phone || 'Tidak disebutkan'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Penilaian Terakhir</p>
                <p className="font-medium">{userProfile?.lastTestDate || 'Tidak pernah'}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Edit Profil
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
              Rekomendasi Tersimpan
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push('/recommendations')}>
              Lihat Semua
            </Button>
          </div>
          <CardDescription>
            Jalur karir dan jurusan yang telah Anda simpan berdasarkan hasil tes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="majors">Jurusan</TabsTrigger>
              <TabsTrigger value="careers">Karir</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Memuat rekomendasi...</p>
                </div>
              ) : savedRecommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Star className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-semibold">Belum ada rekomendasi tersimpan</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simpan jurusan atau karir yang Anda minati dari halaman rekomendasi
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => router.push('/majors')}
                  >
                    Jelajahi Jurusan
                  </Button>
                </div>
              ) : (
                savedRecommendations.map((rec) => {
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
                            {isMajor ? 'Jurusan' : rec.careerIndustry}
                          </p>
                          <p className="text-sm mt-1">{isMajor ? rec.majorDescription : rec.careerDescription}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline">Disimpan {new Date(rec.savedAt).toLocaleDateString()}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecommendation(rec.recommendationId);
                          }}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
            <TabsContent value="majors" className="mt-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Memuat jurusan...</p>
                </div>
              ) : savedRecommendations.filter(rec => rec.recommendationType === 'major').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <GraduationCap className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-semibold">Belum ada jurusan tersimpan</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simpan jurusan yang Anda minati dari halaman jurusan
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => router.push('/majors')}
                  >
                    Jelajahi Jurusan
                  </Button>
                </div>
              ) : (
                savedRecommendations
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
                          <p className="text-sm text-muted-foreground">Jurusan</p>
                          <p className="text-sm mt-1">{rec.majorDescription}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline">Disimpan {new Date(rec.savedAt).toLocaleDateString()}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecommendation(rec.recommendationId);
                          }}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
            <TabsContent value="careers" className="mt-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Memuat karir...</p>
                </div>
              ) : savedRecommendations.filter(rec => rec.recommendationType === 'career').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-semibold">Belum ada karir tersimpan</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simpan karir yang Anda minati dari halaman karir
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => router.push('/careers')}
                  >
                    Jelajahi Karir
                  </Button>
                </div>
              ) : (
                savedRecommendations
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
                        <Badge variant="outline">Disimpan {new Date(rec.savedAt).toLocaleDateString()}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecommendation(rec.recommendationId);
                          }}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;