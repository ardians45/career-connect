'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  GraduationCap, 
  Briefcase, 
  Star, 
  Share2, 
  Download,
  Clock,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

// RIASEC descriptions
const riasecDescriptions: Record<string, { name: string, description: string, careers: string[] }> = {
  'R': {
    name: 'Realistic (M)', 
    description: 'Orang dengan tipe Realistic menyukai kegiatan yang bersifat fisik, memanipulasi benda, mesin, alat dan hewan. Mereka cenderung praktis, stabil, dan mandiri.',
    careers: ['Teknik Mesin', 'Otomotif', 'Pertanian', 'Konstruksi', 'Perbengkelan']
  },
  'I': {
    name: 'Investigative (I)', 
    description: 'Orang dengan tipe Investigative suka dengan kegiatan yang bersifat penelitian, eksplorasi, dan analisis. Mereka cenderung intelektual, logis, dan kritis.',
    careers: ['Peneliti', 'Dokter', 'Ilmuwan', 'Analisis Data', 'Farmasi']
  },
  'A': {
    name: 'Artistic (A)', 
    description: 'Orang dengan tipe Artistic menyukai kegiatan yang bersifat kreatif, imajinatif, dan ekspresif. Mereka cenderung inovatif, emosional, dan tidak konvensional.',
    careers: ['Desainer Grafis', 'Seniman', 'Fotografer', 'Arsitek', 'Penulis']
  },
  'S': {
    name: 'Social (S)', 
    description: 'Orang dengan tipe Social menyukai kegiatan yang bersifat membantu, melatih, dan memberi informasi kepada orang lain. Mereka cenderung sosial, kooperatif, dan mudah beradaptasi.',
    careers: ['Guru', 'Psikolog', 'Perawat', 'Pekerja Sosial', 'Konselor']
  },
  'E': {
    name: 'Enterprising (E)', 
    description: 'Orang dengan tipe Enterprising menyukai kegiatan yang bersifat kepemimpinan, pengaruh, dan kemampuan untuk mempengaruhi orang lain. Mereka cenderung ambisius, percaya diri, dan dominan.',
    careers: ['Wirausaha', 'Marketing', 'Manajer', 'Politisi', 'Penjual']
  },
  'C': {
    name: 'Conventional (C)', 
    description: 'Orang dengan tipe Conventional menyukai kegiatan yang bersifat data, angka, dan informasi terstruktur. Mereka cenderung teliti, stabil, dan taat aturan.',
    careers: ['Akuntan', 'Administrasi', 'Bankir', 'Sekretaris', 'Pengacara']
  }
};

const ResultsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      // Get result ID from the URL path
      const pathParts = window.location.pathname.split('/');
      const resultId = pathParts[pathParts.length - 1] || '';
      
      // Check if we're looking at a specific result (dynamic route)
      if (resultId && resultId !== 'results' && resultId !== '' && resultId.length > 1 && window.location.pathname !== '/results') {
        // Fetch from backend
        fetchResultFromBackend(resultId);
      } 
      // Check if we have a result in sessionStorage (for temporary results at /results)
      else if (window.location.pathname === '/results') {
        const tempResult = sessionStorage.getItem('tempResult');
        if (tempResult) {
          try {
            const parsedData = JSON.parse(tempResult);
            setResult(parsedData);
            setLoading(false);
          } catch (error) {
            console.error('Error parsing temporary result data:', error);
            setLoading(false);
          }
        } else {
          // No temporary result found
          setLoading(false);
        }
      }
      else {
        setLoading(false);
      }
    };

    loadResult();
  }, []);

  const saveResultToBackend = async (resultData: any) => {
    // In a real app, save result to backend
    try {
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          realisticScore: resultData.scores.R,
          investigativeScore: resultData.scores.I,
          artisticScore: resultData.scores.A,
          socialScore: resultData.scores.S,
          enterprisingScore: resultData.scores.E,
          conventionalScore: resultData.scores.C,
          dominantType: resultData.dominantType,
          secondaryType: resultData.secondaryType,
          tertiaryType: resultData.tertiaryType,
          testDuration: resultData.testDuration,
          totalQuestions: resultData.totalQuestions,
          rawAnswers: resultData.rawAnswers,
        }),
      });

      if (response.ok) {
        const savedResult = await response.json();
        // Update the URL to reflect the saved result ID
        window.history.replaceState({}, '', `/results/${savedResult.id}`);
      }
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const fetchResultFromBackend = async (resultId: string) => {
    if (!resultId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/test-results?id=${resultId}`);
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Failed to fetch result:', response.status);
        // Handle case where result is not found
        setResult(null);
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!session) {
      // For guests, show a message to register
      if (confirm('Anda harus mendaftar untuk menyimpan hasil tes ini. Ingin mendaftar sekarang?')) {
        router.push('/sign-up');
      }
      return;
    }

    // Check if this is a temporary result that needs to be saved
    if (window.location.pathname === '/results/temp' && result) {
      try {
        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            realisticScore: result.scores.R,
            investigativeScore: result.scores.I,
            artisticScore: result.scores.A,
            socialScore: result.scores.S,
            enterprisingScore: result.scores.E,
            conventionalScore: result.scores.C,
            dominantType: result.dominantType,
            secondaryType: result.secondaryType,
            tertiaryType: result.tertiaryType,
            testDuration: result.testDuration,
            totalQuestions: result.totalQuestions,
            rawAnswers: result.rawAnswers,
          }),
        });

        if (response.ok) {
          const savedResult = await response.json();
          alert('Hasil tes berhasil disimpan!');
          // Update the URL to reflect the saved result ID, but in Next.js App Router,
          // we should navigate to the new route
          router.push(`/results/${savedResult.id}`);
        } else {
          alert('Terjadi kesalahan saat menyimpan hasil tes');
        }
      } catch (error) {
        console.error('Error saving result:', error);
        alert('Terjadi kesalahan saat menyimpan hasil tes');
      }
    } else {
      alert('Hasil tes berhasil disimpan!');
      router.push('/dashboard');
    }
  };

  const handleShare = () => {
    // In a real app, implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Hasil Tes Minat Bakat CareerConnect',
        text: `Saya menyelesaikan tes RIASEC di CareerConnect! Tipe utama saya adalah ${riasecDescriptions[result?.dominantType]?.name}.`
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard!');
    }
  };

  const handleNewTest = () => {
    router.push('/test');
  };

  const handleViewRecommendations = () => {
    router.push('/recommendations');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Memproses hasil tes Anda...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Hasil Tidak Ditemukan</CardTitle>
            <CardDescription>
              Tes yang Anda cari tidak ditemukan atau telah kadaluarsa.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/test')}>
              Ikuti Tes Baru
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Calculate total score for percentage calculations
  // If result.scores exists (temp result), use it, otherwise construct from individual fields
  const totalScore = result.scores 
    ? Object.values(result.scores).reduce((sum, score) => sum + (score as number), 0)
    : (result.realisticScore || 0) + 
      (result.investigativeScore || 0) + 
      (result.artisticScore || 0) + 
      (result.socialScore || 0) + 
      (result.enterprisingScore || 0) + 
      (result.conventionalScore || 0);

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Hasil Tes Minat Bakat</h1>
          <p className="text-muted-foreground mt-2">
            Berdasarkan metode RIASEC (Holland Code)
          </p>
        </div>

        {/* Dominant Types Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tipe Kepribadian Anda
            </CardTitle>
            <CardDescription>
              Tiga tipe RIASEC teratas berdasarkan jawaban Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dominant Type */}
              <div className="border rounded-lg p-4 bg-primary/5">
                <div className="text-center">
                  <Badge className="text-lg font-bold mb-2" variant="secondary">
                    {riasecDescriptions[result.dominantType]?.name.split(' ')[0]}
                  </Badge>
                  <h3 className="font-bold text-lg mb-1">Tipe Utama</h3>
                  <p className="text-sm text-muted-foreground">
                    {riasecDescriptions[result.dominantType]?.name}
                  </p>
                </div>
              </div>

              {/* Secondary Type */}
              <div className="border rounded-lg p-4 bg-secondary/5">
                <div className="text-center">
                  <Badge className="text-lg font-bold mb-2" variant="outline">
                    {riasecDescriptions[result.secondaryType]?.name.split(' ')[0]}
                  </Badge>
                  <h3 className="font-bold text-lg mb-1">Tipe Kedua</h3>
                  <p className="text-sm text-muted-foreground">
                    {riasecDescriptions[result.secondaryType]?.name}
                  </p>
                </div>
              </div>

              {/* Tertiary Type */}
              <div className="border rounded-lg p-4 bg-accent">
                <div className="text-center">
                  <Badge className="text-lg font-bold mb-2" variant="outline">
                    {riasecDescriptions[result.tertiaryType]?.name.split(' ')[0]}
                  </Badge>
                  <h3 className="font-bold text-lg mb-1">Tipe Ketiga</h3>
                  <p className="text-sm text-muted-foreground">
                    {riasecDescriptions[result.tertiaryType]?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Dominant Type Description */}
            <div className="mt-6 p-4 border rounded-lg bg-muted">
              <h3 className="font-bold text-lg mb-2">Deskripsi Tipe Utama: {riasecDescriptions[result.dominantType]?.name}</h3>
              <p className="text-muted-foreground">
                {riasecDescriptions[result.dominantType]?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scores Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Skor Detail Per Kategori
            </CardTitle>
            <CardDescription>
              Perbandingan skor untuk setiap kategori RIASEC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.scores ? (
                // If result.scores exists (temp result)
                Object.entries(result.scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{riasecDescriptions[category]?.name}</span>
                      <span className="font-bold">{score}</span>
                    </div>
                    <Progress 
                      value={(score as number) / Math.max(...Object.values(result.scores as Record<string, number>)) * 100} 
                      className="h-3"
                    />
                  </div>
                ))
              ) : (
                // If using individual fields from database
                ['R', 'I', 'A', 'S', 'E', 'C'].map(category => {
                  const score = result[`${category.toLowerCase()}Score`];
                  const maxScore = Math.max(
                    result.realisticScore || 0,
                    result.investigativeScore || 0,
                    result.artisticScore || 0,
                    result.socialScore || 0,
                    result.enterprisingScore || 0,
                    result.conventionalScore || 0
                  );
                  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{riasecDescriptions[category]?.name}</span>
                        <span className="font-bold">{score}</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-3"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Career Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Rekomendasi Karir
            </CardTitle>
            <CardDescription>
              Karir yang cocok berdasarkan tipe RIASEC utama Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riasecDescriptions[result.dominantType]?.careers.map((career, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/careers/${career.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{career}</h3>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Rekomendasi Jurusan
            </CardTitle>
            <CardDescription>
              Jurusan pendidikan yang cocok dengan tipe RIASEC Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Berdasarkan tipe RIASEC utama Anda ({riasecDescriptions[result.dominantType]?.name}), berikut adalah beberapa jurusan yang mungkin cocok:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded">
                <Star className="h-4 w-4 text-primary" />
                <span>Teknik {result.dominantType === 'R' ? 'Mesin' : result.dominantType === 'I' ? 'Informatika' : 'Industri'}</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded">
                <Star className="h-4 w-4 text-primary" />
                <span>{result.dominantType === 'A' ? 'Desain Komunikasi Visual' : result.dominantType === 'S' ? 'Pendidikan' : 'Manajemen'}</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded">
                <Star className="h-4 w-4 text-primary" />
                <span>{result.dominantType === 'E' ? 'Bisnis' : result.dominantType === 'C' ? 'Akuntansi' : 'Psikologi'}</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded">
                <Star className="h-4 w-4 text-primary" />
                <span>{result.dominantType === 'I' ? 'Fisika' : 'Teknologi Informasi'}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleSaveResult} className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Simpan Hasil
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Bagikan
          </Button>
          <Button variant="outline" onClick={handleNewTest} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Tes Lagi
          </Button>
          <Button onClick={handleViewRecommendations} className="flex items-center gap-2">
            Lihat Semua Rekomendasi
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Test Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Diselesaikan pada {new Date(result.completedAt).toLocaleString('id-ID')}</p>
          <p>Waktu pengerjaan: {Math.floor(result.testDuration / 60)} menit {result.testDuration % 60} detik</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;