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
  Calendar, 
  TrendingUp, 
  User, 
  BookOpen,
  FileText,
  Plus,
  Clock,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

// Mock data for the dashboard
const mockTestResults = [
  {
    id: '1',
    date: '2024-10-01',
    dominantType: 'R',
    types: 'R-I-A',
    score: 85,
    title: 'RIASEC Career Assessment'
  },
  {
    id: '2',
    date: '2024-09-15',
    dominantType: 'A',
    types: 'A-S-E',
    score: 72,
    title: 'Creative Career Assessment'
  },
  {
    id: '3',
    date: '2024-08-22',
    dominantType: 'S',
    types: 'S-E-C',
    score: 68,
    title: 'Social Career Assessment'
  }
];

const mockRecommendations = [
  {
    id: '1',
    type: 'major',
    title: 'Computer Science',
    institution: 'University of Technology',
    riasecMatch: '85%',
    description: 'Study the fundamentals of programming, algorithms, and software engineering.'
  },
  {
    id: '2',
    type: 'career',
    title: 'Software Developer',
    industry: 'Technology',
    riasecMatch: '90%',
    description: 'Design, develop, and maintain software applications for various platforms.'
  },
  {
    id: '3',
    type: 'major',
    title: 'Graphic Design',
    institution: 'Art Institute',
    riasecMatch: '78%',
    description: 'Learn visual communication, typography, and digital design principles.'
  }
];

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentTest, setRecentTest] = useState<any>(null);

  useEffect(() => {
    // In a real app, fetch user data from the backend
    // Mock user profile
    setUserProfile({
      name: 'John Doe',
      school: 'SMK Negeri 1 Jakarta',
      grade: 11,
      lastTestDate: '2024-10-01',
      dominantType: 'R'
    });
    
    // Mock most recent test
    setRecentTest(mockTestResults[0]);
  }, []);

  const handleStartTest = () => {
    router.push('/test');
  };

  const handleViewResult = (id: string) => {
    router.push(`/results/${id}`);
  };

  const handleViewRecommendation = (id: string) => {
    router.push(`/recommendations/${id}`);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/sign-in');
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
        <Button onClick={handleStartTest} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Assessment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTestResults.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
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
            <div className="text-2xl font-bold">{mockRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">Career & education paths</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
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
                {mockTestResults.map((test) => (
                  <div 
                    key={test.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewResult(test.id)}
                  >
                    <div>
                      <h3 className="font-semibold">{test.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(test.date).toLocaleDateString()} • Type: {test.types}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{test.score}%</Badge>
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
                <p className="text-sm text-muted-foreground">Last Assessment</p>
                <p className="font-medium">{userProfile?.lastTestDate || 'Never'}</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
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
            Career paths and majors you've saved based on your test results
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
              {mockRecommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleViewRecommendation(rec.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${rec.type === 'major' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {rec.type === 'major' ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rec.type === 'major' ? rec.institution : rec.industry}
                      </p>
                      <p className="text-sm mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline">{rec.riasecMatch} match</Badge>
                    <Button variant="outline" size="sm" className="mt-2">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="majors" className="mt-4 space-y-4">
              {mockRecommendations
                .filter(rec => rec.type === 'major')
                .map((rec) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewRecommendation(rec.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.institution}</p>
                        <p className="text-sm mt-1">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline">{rec.riasecMatch} match</Badge>
                      <Button variant="outline" size="sm" className="mt-2">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="careers" className="mt-4 space-y-4">
              {mockRecommendations
                .filter(rec => rec.type === 'career')
                .map((rec) => (
                  <div 
                    key={rec.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewRecommendation(rec.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-800">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.industry}</p>
                        <p className="text-sm mt-1">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline">{rec.riasecMatch} match</Badge>
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