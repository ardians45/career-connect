'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Briefcase, 
  Search, 
  Star, 
  Heart, 
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

// Mock data for recommendations
const mockMajors = [
  {
    id: '1',
    name: 'Teknik Informatika',
    description: 'Studi tentang perancangan, pembuatan, dan pengelolaan sistem komputer dan perangkat lunak',
    riasecTypes: 'I-A-R',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 50000000,
    jobOutlook: 'Sangat Baik',
    averageSalary: 8000000,
    popularityScore: 95,
    institution: 'Universitas Indonesia',
    imageUrl: '/placeholder-university.jpg'
  },
  {
    id: '2',
    name: 'Desain Komunikasi Visual',
    description: 'Studi tentang komunikasi visual melalui elemen-elemen seperti tipografi, ilustrasi, dan fotografi',
    riasecTypes: 'A-R-S',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 40000000,
    jobOutlook: 'Baik',
    averageSalary: 6500000,
    popularityScore: 87,
    institution: 'Institut Teknologi Bandung',
    imageUrl: '/placeholder-university.jpg'
  },
  {
    id: '3',
    name: 'Psikologi',
    description: 'Studi tentang perilaku manusia dan proses mental untuk membantu individu dan kelompok',
    riasecTypes: 'S-I-A',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 45000000,
    jobOutlook: 'Baik',
    averageSalary: 7000000,
    popularityScore: 82,
    institution: 'Universitas Gadjah Mada',
    imageUrl: '/placeholder-university.jpg'
  }
];

const mockCareers = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Merancang, mengembangkan, dan mengelola perangkat lunak untuk berbagai platform',
    riasecTypes: 'I-R-A',
    industry: 'Teknologi',
    experienceLevel: 'Entry Level',
    requiredSkills: ['JavaScript', 'Python', 'Algorithms', 'Problem Solving'],
    educationRequirement: 'S1 Teknik Informatika atau Sistem Informasi',
    salaryRange: { min: 6000000, max: 12000000 },
    jobGrowthRate: 22,
    popularityScore: 98,
    imageUrl: '/placeholder-career.jpg'
  },
  {
    id: '2',
    title: 'Graphic Designer',
    description: 'Membuat desain visual untuk berbagai media termasuk cetak, digital, dan multimedia',
    riasecTypes: 'A-S-E',
    industry: 'Kreatif',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Adobe Creative Suite', 'Typography', 'Color Theory', 'Layout Design'],
    educationRequirement: 'S1 Desain Komunikasi Visual atau Desain Grafis',
    salaryRange: { min: 4500000, max: 9000000 },
    jobGrowthRate: 13,
    popularityScore: 85,
    imageUrl: '/placeholder-career.jpg'
  },
  {
    id: '3',
    title: 'Psychologist',
    description: 'Memberikan bantuan dan konseling kepada individu atau kelompok untuk masalah psikologis',
    riasecTypes: 'S-I-A',
    industry: 'Kesehatan',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Clinical Assessment', 'Therapeutic Techniques', 'Research Methods', 'Ethics'],
    educationRequirement: 'S2 Psikologi Klinis',
    salaryRange: { min: 7000000, max: 15000000 },
    jobGrowthRate: 8,
    popularityScore: 78,
    imageUrl: '/placeholder-career.jpg'
  }
];

const RecommendationsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [majors, setMajors] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // In a real app, fetch data from backend
    setMajors(mockMajors);
    setCareers(mockCareers);
    
    // In a real app, fetch user's saved recommendations
    // For now, using mock data
    setSavedRecommendations(['1', '2']);
  }, []);

  const toggleSaveRecommendation = async (id: string, type: 'major' | 'career') => {
    if (!session) {
      // If not logged in, redirect to sign in
      router.push('/sign-in');
      return;
    }

    // In a real app, make API call to save/unsave
    if (savedRecommendations.includes(id)) {
      // Remove from saved
      setSavedRecommendations(prev => prev.filter(item => item !== id));
    } else {
      // Add to saved
      setSavedRecommendations(prev => [...prev, id]);
    }
  };

  const viewDetail = (id: string, type: 'major' | 'career') => {
    router.push(`/${type === 'major' ? 'majors' : 'careers'}/${id}`);
  };

  // Filter recommendations based on search query
  const filteredMajors = majors.filter(major => 
    major.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    major.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    major.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCareers = careers.filter(career => 
    career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Rekomendasi Karir & Jurusan</h1>
          <p className="text-muted-foreground mt-2">
            Rekomendasi berdasarkan hasil tesRIASEC Anda
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari jurusan atau karir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="majors">Jurusan</TabsTrigger>
            <TabsTrigger value="careers">Karir</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Recommendations Content */}
        <TabsContent value="all" className="space-y-6">
          {/* Majors Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Jurusan Kuliah
              </h2>
              <Button variant="outline" onClick={() => setActiveTab('majors')}>
                Lihat Semua
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMajors.slice(0, 3).map((major) => (
                <Card key={major.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2">
                        {major.riasecTypes}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveRecommendation(major.id, 'major')}
                        className="p-2"
                      >
                        <Heart 
                          className={`h-4 w-4 ${savedRecommendations.includes(major.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                        />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{major.name}</CardTitle>
                    <CardDescription>{major.institution}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {major.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {major.studyDuration} Tahun
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {major.averageTuition.toLocaleString('id-ID')}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {major.jobOutlook}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{major.popularityScore}% cocok</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => viewDetail(major.id, 'major')}
                    >
                      Detail
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Careers Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Karir
              </h2>
              <Button variant="outline" onClick={() => setActiveTab('careers')}>
                Lihat Semua
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.slice(0, 3).map((career) => (
                <Card key={career.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2">
                        {career.riasecTypes}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveRecommendation(career.id, 'career')}
                        className="p-2"
                      >
                        <Heart 
                          className={`h-4 w-4 ${savedRecommendations.includes(career.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                        />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{career.title}</CardTitle>
                    <CardDescription>{career.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {career.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {career.salaryRange.min.toLocaleString('id-ID')} - {career.salaryRange.max.toLocaleString('id-ID')}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {career.jobGrowthRate}% growth
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{career.popularityScore}% cocok</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => viewDetail(career.id, 'career')}
                    >
                      Detail
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="majors" className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Semua Jurusan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMajors.map((major) => (
              <Card key={major.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {major.riasecTypes}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveRecommendation(major.id, 'major')}
                      className="p-2"
                    >
                      <Heart 
                        className={`h-4 w-4 ${savedRecommendations.includes(major.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{major.name}</CardTitle>
                  <CardDescription>{major.institution}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {major.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {major.studyDuration} Tahun
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {major.averageTuition.toLocaleString('id-ID')}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {major.jobOutlook}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{major.popularityScore}% cocok</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => viewDetail(major.id, 'major')}
                  >
                    Detail
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Semua Karir
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCareers.map((career) => (
              <Card key={career.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {career.riasecTypes}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveRecommendation(career.id, 'career')}
                      className="p-2"
                    >
                      <Heart 
                        className={`h-4 w-4 ${savedRecommendations.includes(career.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{career.title}</CardTitle>
                  <CardDescription>{career.industry}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {career.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {career.salaryRange.min.toLocaleString('id-ID')} - {career.salaryRange.max.toLocaleString('id-ID')}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {career.jobGrowthRate}% growth
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{career.popularityScore}% cocok</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => viewDetail(career.id, 'career')}
                  >
                    Detail
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default RecommendationsPage;