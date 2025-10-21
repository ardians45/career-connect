'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Star,
  Heart,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

// Define types
interface Career {
  id: string;
  title: string;
  description: string;
  riasecTypes: string;
  industry: string;
  experienceLevel: string;
  requiredSkills: string[];
  educationRequirement: string;
  salaryRange: { min: number; max: number };
  jobGrowthRate: number;
  popularityScore: number;
  workEnvironment: string;
  typicalTasks: string[];
  careerPath: string[];
}

// Mock data for careers
const mockCareers: Career[] = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Merancang, mengembangkan, dan mengelola perangkat lunak untuk berbagai platform. Melibatkan analisis kebutuhan pengguna, desain sistem, pengembangan kode, dan pemeliharaan aplikasi.',
    riasecTypes: 'I-R-A',
    industry: 'Teknologi Informasi',
    experienceLevel: 'Entry Level',
    requiredSkills: ['JavaScript', 'Python', 'Java', 'Algoritma', 'SQL', 'Git'],
    educationRequirement: 'S1 Teknik Informatika, Sistem Informasi, atau Ilmu Komputer',
    salaryRange: { min: 6000000, max: 12000000 },
    jobGrowthRate: 22,
    popularityScore: 98,
    workEnvironment: 'Kantor, Remote, Hybrid',
    typicalTasks: [
      'Mengembangkan aplikasi berbasis web dan mobile',
      'Mengelola basis data dan sistem backend',
      'Melakukan testing dan debugging',
      'Bekerja sama dengan tim pengembangan produk',
      'Mengikuti perkembangan teknologi terbaru'
    ],
    careerPath: [
      'Junior Developer → Developer → Senior Developer → Tech Lead → Engineering Manager',
      'Junior Developer → Developer → Senior Developer → Staff Engineer → Principal Engineer'
    ]
  }
];

const CareerDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [career, setCareer] = useState<Career | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch data from backend
    // For now, find the career by ID
    const foundCareer = mockCareers.find(c => c.id === params.id);
    if (foundCareer) {
      setCareer(foundCareer);
      setLoading(false);
    } else {
      // If not found, redirect to 404 or careers list
      setTimeout(() => {
        router.push('/careers');
      }, 1000);
    }
  }, [params.id, router]);

  const toggleSave = () => {
    if (!session) {
      router.push('/sign-in');
      return;
    }
    
    // In a real app, make API call to save/unsave
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Karir Tidak Ditemukan</CardTitle>
            <CardDescription>
              Karir yang Anda cari tidak ditemukan atau telah dihapus.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/recommendations')}>
              Kembali ke Rekomendasi
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Badge variant="secondary" className="text-lg font-bold mb-2">
                  {career.riasecTypes}
                </Badge>
                <h1 className="text-3xl font-bold">{career.title}</h1>
                <p className="text-green-100 mt-1">{career.industry}</p>
              </div>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={toggleSave}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                {isSaved ? 'Disimpan' : 'Simpan'}
              </Button>
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {career.experienceLevel}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {career.salaryRange.min.toLocaleString('id-ID')} - {career.salaryRange.max.toLocaleString('id-ID')}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {career.jobGrowthRate}% growth
              </Badge>
            </div>
            <CardTitle className="text-2xl">Tentang Pekerjaan Ini</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Deskripsi Pekerjaan</h3>
              <p className="text-muted-foreground">{career.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Keterampilan yang Dibutuhkan</h3>
                <div className="flex flex-wrap gap-2">
                  {career.requiredSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Lingkungan Kerja</h3>
                <p className="text-muted-foreground">{career.workEnvironment}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Tugas Umum</h3>
              <ul className="space-y-2">
                {career.typicalTasks.map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Jenjang Karir</h3>
              <div className="space-y-3">
                {career.careerPath.map((path: string, index: number) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p>{path}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Syarat Pendidikan</h3>
              <p className="text-muted-foreground">{career.educationRequirement}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{career.jobGrowthRate}%</p>
                <p className="text-sm text-muted-foreground">Pertumbuhan Kerja</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">Rp {career.salaryRange.min.toLocaleString('id-ID')}</p>
                <p className="text-sm text-muted-foreground">Gaji Awal</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Star className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{career.popularityScore}%</p>
                <p className="text-sm text-muted-foreground">Kecocokan</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button variant="outline" onClick={() => router.push('/recommendations')}>
              ← Lainnya
            </Button>
            <Button onClick={() => router.push('/counseling')}>
              Konsultasi dengan BK
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CareerDetailPage;