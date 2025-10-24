'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  BarChart3, 
  Eye,
  RotateCcw,
  Star
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface TestResult {
  id: string;
  userId?: string;
  guestSessionId?: string;
  dominantType: string;
  secondaryType?: string;
  tertiaryType?: string;
  realisticScore: number;
  investigativeScore: number;
  artisticScore: number;
  socialScore: number;
  enterprisingScore: number;
  conventionalScore: number;
  completedAt: string;
  testDuration?: number;
  totalQuestions: number;
  rawAnswers?: Record<string, unknown> | null;
}

const TestHistoryPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestHistory = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/test-results?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Sort by most recent first
            const sortedResults = data.sort((a: TestResult, b: TestResult) => 
              new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            );
            setTestResults(sortedResults);
          } else {
            console.error('Failed to fetch test results:', response.status);
          }
        } catch (error) {
          console.error('Error fetching test results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, [session]);

  useEffect(() => {
    if (!session && !isPending) {
      router.push('/sign-in');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleViewResult = (id: string) => {
    router.push(`/results/${id}`);
  };

  const handleTakeNewTest = () => {
    router.push('/test');
  };

  const getDominantTypeLabel = (type: string) => {
    switch (type) {
      case 'R': return 'Realistic';
      case 'I': return 'Investigative';
      case 'A': return 'Artistic';
      case 'S': return 'Social';
      case 'E': return 'Enterprising';
      case 'C': return 'Conventional';
      default: return type;
    }
  };

  const getDominantTypeColor = (type: string) => {
    switch (type) {
      case 'R': return 'bg-red-100 text-red-800';
      case 'I': return 'bg-blue-100 text-blue-800';
      case 'A': return 'bg-purple-100 text-purple-800';
      case 'S': return 'bg-green-100 text-green-800';
      case 'E': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading test history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Tes Minat Bakat</h1>
          <p className="text-muted-foreground">
            Semua hasil tes RIASEC Anda sebelumnya
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Semua Tes ({testResults.length})</h2>
          <p className="text-sm text-muted-foreground">
            Urut berdasarkan tanggal terbaru
          </p>
        </div>
        <Button onClick={handleTakeNewTest} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Ikuti Tes Baru
        </Button>
      </div>

      {testResults.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Belum Ada Hasil Tes</CardTitle>
            <CardDescription>
              Anda belum pernah mengikuti tes RIASEC. Mulai tes untuk melihat riwayat di sini.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleTakeNewTest} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ikuti Tes Pertama Anda
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testResults.map((result) => {
            const maxScore = Math.max(
              result.realisticScore,
              result.investigativeScore,
              result.artisticScore,
              result.socialScore,
              result.enterprisingScore,
              result.conventionalScore
            );
            const dominantTypeLabel = getDominantTypeLabel(result.dominantType);
            const secondaryTypeLabel = result.secondaryType ? getDominantTypeLabel(result.secondaryType) : '';
            const tertiaryTypeLabel = result.tertiaryType ? getDominantTypeLabel(result.tertiaryType) : '';
            
            // Create a string with the top 3 types
            const topTypes = [result.dominantType, result.secondaryType, result.tertiaryType]
              .filter(Boolean)
              .join('-');
              
            const typeLabels = [dominantTypeLabel, secondaryTypeLabel, tertiaryTypeLabel]
              .filter(Boolean)
              .join(', ');

            return (
              <Card 
                key={result.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewResult(result.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Tes RIASEC
                    </CardTitle>
                    <Badge className={getDominantTypeColor(result.dominantType)}>
                      {result.dominantType}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(result.completedAt).toLocaleDateString('id-ID')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {result.testDuration ? `${Math.floor(result.testDuration / 60)} menit` : 'Durasi tidak diketahui'}
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Tipe Dominan:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{result.dominantType} - {dominantTypeLabel}</Badge>
                        {result.secondaryType && (
                          <Badge variant="outline">{result.secondaryType} - {secondaryTypeLabel}</Badge>
                        )}
                        {result.tertiaryType && (
                          <Badge variant="outline">{result.tertiaryType} - {tertiaryTypeLabel}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Skor Tertinggi:</p>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold">{maxScore}</span>
                        <span className="text-xs text-muted-foreground">dari {result.totalQuestions * 5} poin</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleViewResult(result.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestHistoryPage;