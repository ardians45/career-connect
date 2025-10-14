'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users,
  Star,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

// Mock data for majors
const mockMajors = [
  {
    id: '1',
    name: 'Teknik Informatika',
    description: 'Studi tentang perancangan, pembuatan, dan pengelolaan sistem komputer dan perangkat lunak. Kurikulum mencakup pemrograman, basis data, jaringan komputer, dan keamanan informasi.',
    riasecTypes: 'I-A-R',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 50000000,
    jobOutlook: 'Sangat Baik',
    averageSalary: 8000000,
    popularityScore: 95,
    institution: 'Universitas Indonesia',
    location: 'Depok',
    admissionQuota: 120,
    requiredSubjects: ['Matematika', 'Fisika', 'Bahasa Inggris'],
    curriculum: [
      'Algoritma dan Struktur Data',
      'Pemrograman Berorientasi Objek',
      'Basis Data',
      'Jaringan Komputer',
      'Sistem Operasi',
      'Keamanan Informasi'
    ],
    careerProspects: [
      'Software Engineer',
      'Data Scientist',
      'Cybersecurity Specialist',
      'System Analyst',
      'Web Developer'
    ]
  }
];

const MajorDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [major, setMajor] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch data from backend
    // For now, find the major by ID
    const foundMajor = mockMajors.find(m => m.id === params.id);
    if (foundMajor) {
      setMajor(foundMajor);
      setLoading(false);
    } else {
      // If not found, redirect to 404 or majors list
      setTimeout(() => {
        router.push('/majors');
      }, 1000);
    }
  }, [params.id]);

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

  if (!major) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Program Studi Tidak Ditemukan</CardTitle>
            <CardDescription>
              Program studi yang Anda cari tidak ditemukan atau telah dihapus.
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Badge variant="secondary" className="text-lg font-bold mb-2">
                  {major.riasecTypes}
                </Badge>
                <h1 className="text-3xl font-bold">{major.name}</h1>
                <p className="text-blue-100 mt-1">{major.institution} • {major.location}</p>
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
                <GraduationCap className="h-3 w-3" />
                {major.degreeLevel}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {major.studyDuration} Tahun
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {major.averageTuition.toLocaleString('id-ID')}/tahun
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Kuota: {major.admissionQuota}
              </Badge>
            </div>
            <CardTitle className="text-2xl">Tentang Program Studi</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
              <p className="text-muted-foreground">{major.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Mata Kuliah Utama</h3>
                <ul className="space-y-2">
                  {major.curriculum.slice(0, 6).map((subject: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Prospek Karir</h3>
                <ul className="space-y-2">
                  {major.careerProspects.slice(0, 5).map((career: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Mata Pelajaran yang Dibutuhkan</h3>
              <div className="flex flex-wrap gap-2">
                {major.requiredSubjects.map((subject: string, index: number) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{major.jobOutlook}</p>
                <p className="text-sm text-muted-foreground">Prospek Kerja</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">Rp {major.averageSalary.toLocaleString('id-ID')}</p>
                <p className="text-sm text-muted-foreground">Gaji Rata-rata</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Star className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{major.popularityScore}%</p>
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

export default MajorDetailPage;