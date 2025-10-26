'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Briefcase, Bookmark } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

interface Career {
  id: string;
  name: string;
  description: string;
  riasecTypes: string; // e.g. "R, I, A"
  industry: string; // 'IT', 'Kreatif', 'Kesehatan', etc.
}

const CareersPage = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<Career[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [riasecFilter, setRiasecFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedCareers, setBookmarkedCareers] = useState<Set<string>>(new Set());
  const { data: session, status } = useSession(); // Using proper session variable name
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockCareers: Career[] = [
      // IT Careers
      {
        id: '1',
        name: 'Software Engineer',
        description: 'Mengembangkan, menguji, dan memelihara perangkat lunak aplikasi dan sistem komputer.',
        riasecTypes: 'I, R, E',
        industry: 'IT',
      },
      {
        id: '2',
        name: 'UI/UX Designer',
        description: 'Merancang antarmuka pengguna dan pengalaman pengguna yang intuitif dan menarik.',
        riasecTypes: 'A, S, E',
        industry: 'IT',
      },
      {
        id: '3',
        name: 'Data Scientist',
        description: 'Menganalisis dan menginterpretasikan data kompleks untuk membantu organisasi dalam pengambilan keputusan.',
        riasecTypes: 'I, R, C',
        industry: 'IT',
      },
      {
        id: '4',
        name: 'Cybersecurity Analyst',
        description: 'Melindungi sistem dan jaringan organisasi dari ancaman keamanan digital.',
        riasecTypes: 'I, R, C',
        industry: 'IT',
      },
      {
        id: '5',
        name: 'DevOps Engineer',
        description: 'Menggabungkan pengembangan perangkat lunak dan operasi TI untuk meningkatkan efisiensi.',
        riasecTypes: 'R, I, E',
        industry: 'IT',
      },
      {
        id: '6',
        name: 'Product Manager',
        description: 'Mengelola siklus hidup produk dan memastikan pengembangan sesuai kebutuhan pasar.',
        riasecTypes: 'E, S, C',
        industry: 'IT',
      },
      
      // Creative Careers
      {
        id: '7',
        name: 'Graphic Designer',
        description: 'Menciptakan desain visual untuk mencetak dan media digital menggunakan elemen teks, gambar, dan warna.',
        riasecTypes: 'A, S, E',
        industry: 'Kreatif',
      },
      {
        id: '8',
        name: 'Video Editor',
        description: 'Mengedit dan menyusun cuplikan video menjadi narasi yang utuh dan menarik.',
        riasecTypes: 'A, R, S',
        industry: 'Kreatif',
      },
      {
        id: '9',
        name: 'Content Creator',
        description: 'Menciptakan dan menyebarkan konten menarik di berbagai platform media sosial.',
        riasecTypes: 'A, E, S',
        industry: 'Kreatif',
      },
      {
        id: '10',
        name: 'Art Director',
        description: 'Mengarahkan elemen visual dari kampanye pemasaran untuk memastikan konsistensi estetika.',
        riasecTypes: 'A, E, S',
        industry: 'Kreatif',
      },
      {
        id: '11',
        name: 'Photographer',
        description: 'Mengambil dan mengedit foto untuk berbagai keperluan komersial dan artistik.',
        riasecTypes: 'A, R, S',
        industry: 'Kreatif',
      },
      {
        id: '12',
        name: 'Copywriter',
        description: 'Menulis teks promosi dan iklan yang menarik dan persuasif untuk berbagai media.',
        riasecTypes: 'A, I, E',
        industry: 'Kreatif',
      },
      
      // Health Careers
      {
        id: '13',
        name: 'Dokter Umum',
        description: 'Mendiagnosis dan mengobati berbagai kondisi medis serta memberikan layanan kesehatan primer.',
        riasecTypes: 'I, S, E',
        industry: 'Kesehatan',
      },
      {
        id: '14',
        name: 'Perawat',
        description: 'Memberikan perawatan langsung kepada pasien dan membantu dokter dalam proses penyembuhan.',
        riasecTypes: 'S, I, C',
        industry: 'Kesehatan',
      },
      {
        id: '15',
        name: 'Psikolog Klinis',
        description: 'Mendiagnosis dan mengobati masalah kesehatan mental dan emosional melalui terapi.',
        riasecTypes: 'S, I, A',
        industry: 'Kesehatan',
      },
      {
        id: '16',
        name: 'Fisioterapis',
        description: 'Membantu pasien memulihkan fungsi gerak dan mengurangi rasa sakit setelah cedera atau penyakit.',
        riasecTypes: 'S, R, I',
        industry: 'Kesehatan',
      },
      {
        id: '17',
        name: 'Dokter Spesialis',
        description: 'Berfokus pada spesialisasi medis tertentu seperti jantung, otak, kulit, atau anak.',
        riasecTypes: 'I, S, R',
        industry: 'Kesehatan',
      },
      {
        id: '18',
        name: 'Nutrisionis',
        description: 'Memberikan konsultasi nutrisi dan perencanaan makanan untuk meningkatkan kesehatan.',
        riasecTypes: 'I, S, C',
        industry: 'Kesehatan',
      },
      
      // Business Careers
      {
        id: '19',
        name: 'Business Analyst',
        description: 'Menganalisis proses bisnis dan memberikan rekomendasi untuk meningkatkan efisiensi.',
        riasecTypes: 'I, C, E',
        industry: 'Bisnis',
      },
      {
        id: '20',
        name: 'Marketing Manager',
        description: 'Merencanakan dan mengeksekusi strategi pemasaran untuk mempromosikan produk atau layanan.',
        riasecTypes: 'E, A, S',
        industry: 'Bisnis',
      },
      {
        id: '21',
        name: 'Financial Analyst',
        description: 'Menganalisis data keuangan untuk membantu organisasi membuat keputusan investasi.',
        riasecTypes: 'I, C, E',
        industry: 'Bisnis',
      },
      {
        id: '22',
        name: 'Human Resources Manager',
        description: 'Mengelola hubungan karyawan dan kebijakan organisasi terkait sumber daya manusia.',
        riasecTypes: 'S, E, C',
        industry: 'Bisnis',
      },
      {
        id: '23',
        name: 'Project Manager',
        description: 'Merencanakan, mengeksekusi, dan menutup proyek organisasi sesuai jadwal dan anggaran.',
        riasecTypes: 'E, C, S',
        industry: 'Bisnis',
      },
      {
        id: '24',
        name: 'Consultant',
        description: 'Memberikan saran ahli dalam bidang tertentu untuk membantu organisasi meningkatkan kinerja.',
        riasecTypes: 'I, E, S',
        industry: 'Bisnis',
      },
      
      // Education Careers
      {
        id: '25',
        name: 'Teacher',
        description: 'Mengajar dan membimbing siswa dalam berbagai mata pelajaran di tingkat pendidikan.',
        riasecTypes: 'S, I, A',
        industry: 'Pendidikan',
      },
      {
        id: '26',
        name: 'University Professor',
        description: 'Mengajar di perguruan tinggi dan melakukan penelitian dalam bidang keahlian.',
        riasecTypes: 'I, S, A',
        industry: 'Pendidikan',
      },
      {
        id: '27',
        name: 'Curriculum Developer',
        description: 'Merancang dan mengembangkan materi pelajaran serta rencana pembelajaran.',
        riasecTypes: 'I, S, C',
        industry: 'Pendidikan',
      },
      {
        id: '28',
        name: 'Education Administrator',
        description: 'Mengelola operasi sekolah dan kebijakan pendidikan.',
        riasecTypes: 'S, C, E',
        industry: 'Pendidikan',
      },
      {
        id: '29',
        name: 'Corporate Trainer',
        description: 'Melatih karyawan dalam keterampilan dan kompetensi yang diperlukan.',
        riasecTypes: 'S, E, A',
        industry: 'Pendidikan',
      },
      
      // Engineering Careers
      {
        id: '30',
        name: 'Mechanical Engineer',
        description: 'Merancang, menganalisis, dan memanufaktur perangkat mekanik untuk berbagai aplikasi.',
        riasecTypes: 'R, I, E',
        industry: 'Teknik',
      },
      {
        id: '31',
        name: 'Civil Engineer',
        description: 'Merancang dan mengawasi konstruksi infrastruktur seperti jembatan, gedung, dan jalan.',
        riasecTypes: 'R, I, E',
        industry: 'Teknik',
      },
      {
        id: '32',
        name: 'Electrical Engineer',
        description: 'Merancang sistem dan perangkat listrik untuk berbagai aplikasi industri dan rumah tangga.',
        riasecTypes: 'R, I, E',
        industry: 'Teknik',
      },
      {
        id: '33',
        name: 'Chemical Engineer',
        description: 'Menerapkan prinsip kimia dan fisika untuk memproduksi bahan kimia dan produk industri.',
        riasecTypes: 'I, R, C',
        industry: 'Teknik',
      },
      {
        id: '34',
        name: 'Environmental Engineer',
        description: 'Mengembangkan solusi untuk memperbaiki dan melindungi lingkungan.',
        riasecTypes: 'I, S, R',
        industry: 'Teknik',
      },
      
      // Science Careers
      {
        id: '35',
        name: 'Research Scientist',
        description: 'Melakukan eksperimen dan studi untuk memajukan pengetahuan dalam bidang ilmu pengetahuan.',
        riasecTypes: 'I, R, C',
        industry: 'Ilmu Pengetahuan',
      },
      {
        id: '36',
        name: 'Biotechnologist',
        description: 'Menggunakan proses biologis untuk mengembangkan produk dan teknologi inovatif.',
        riasecTypes: 'I, R, S',
        industry: 'Ilmu Pengetahuan',
      },
      {
        id: '37',
        name: 'Microbiologist',
        description: 'Mempelajari mikroorganisme dan perannya dalam kesehatan, lingkungan, dan industri.',
        riasecTypes: 'I, R, S',
        industry: 'Ilmu Pengetahuan',
      },
      {
        id: '38',
        name: 'Marine Biologist',
        description: 'Mempelajari organisme laut dan ekosistem perairan untuk konservasi dan penelitian.',
        riasecTypes: 'I, R, S',
        industry: 'Ilmu Pengetahuan',
      },
      {
        id: '39',
        name: 'Geologist',
        description: 'Mempelajari struktur bumi dan proses geologis untuk berbagai aplikasi industri dan lingkungan.',
        riasecTypes: 'R, I, S',
        industry: 'Ilmu Pengetahuan',
      },
    ];

    setCareers(mockCareers);
    setFilteredCareers(mockCareers);
    setIsLoading(false);
  }, []);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = careers;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(career => 
        career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply industry filter
    if (industryFilter !== 'all') {
      result = result.filter(career => career.industry === industryFilter);
    }

    // Apply RIASEC filter
    if (riasecFilter !== 'all') {
      result = result.filter(career => 
        career.riasecTypes.toLowerCase().includes(riasecFilter.toLowerCase())
      );
    }

    setFilteredCareers(result);
  }, [searchTerm, industryFilter, riasecFilter, careers]);

  // Load bookmarked items from database on initial render
  useEffect(() => {
    const loadBookmarks = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        setLoadingBookmarks(true);
        try {
          // In a real implementation, we'd fetch the user's bookmarks from the database
          // For now, we'll just initialize the set
          setBookmarkedCareers(new Set());
        } catch (error) {
          console.error('Error loading bookmarks:', error);
        } finally {
          setLoadingBookmarks(false);
        }
      } else {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, [status, session]);

  // On initial load, also check for bookmarked items from session storage
  useEffect(() => {
    const loadBookmarksFromStorage = () => {
      try {
        const storedBookmarks = localStorage.getItem('bookmarkedCareers');
        if (storedBookmarks) {
          const parsedBookmarks = JSON.parse(storedBookmarks);
          // Extract just the IDs for the Set since that's what the UI checks
          const bookmarkIds = parsedBookmarks.map((b: any) => b.id);
          setBookmarkedCareers(new Set(bookmarkIds));
        } else {
          setBookmarkedCareers(new Set());
        }
      } catch (error) {
        console.error('Error loading bookmarks from storage:', error);
        setBookmarkedCareers(new Set());
      }
    };

    loadBookmarksFromStorage();
  }, []);

  // Toggle bookmark for a career
  const toggleBookmark = async (career: Career) => {
    // Optimistically update the UI
    setBookmarkedCareers(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(career.id)) {
        newBookmarks.delete(career.id);
        console.log('Removing bookmark for career:', career.id);
      } else {
        newBookmarks.add(career.id);
        console.log('Adding bookmark for career:', career.id);
      }
      return newBookmarks;
    });
    
    try {
      // Get current bookmarks from localStorage
      const currentBookmarks = localStorage.getItem('bookmarkedCareers');
      const currentBookmarkData = currentBookmarks ? JSON.parse(currentBookmarks) : [];
      
      // Create bookmark object with all necessary info for display
      const bookmarkObject = {
        id: career.id,
        name: career.name,
        description: career.description,
        riasecTypes: career.riasecTypes,
        industry: career.industry
      };
      
      // Check if career is currently bookmarked
      const existingIndex = currentBookmarkData.findIndex((b: any) => b.id === career.id);
      let newBookmarkData;
      
      if (existingIndex >= 0) {
        // Remove from bookmarks
        newBookmarkData = currentBookmarkData.filter((b: any) => b.id !== career.id);
      } else {
        // Add to bookmarks
        newBookmarkData = [...currentBookmarkData, bookmarkObject];
      }
      
      // Update localStorage
      localStorage.setItem('bookmarkedCareers', JSON.stringify(newBookmarkData));
      
      // Show success toast
      if (existingIndex < 0) {
        toast.success('Career bookmarked!');
      } else {
        toast.success('Bookmark removed');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Rollback UI if there was an error
      setBookmarkedCareers(prev => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(career.id)) {
          newBookmarks.delete(career.id);
        } else {
          newBookmarks.add(career.id);
        }
        return newBookmarks;
      });
      
      // Show error toast
      toast.error('Failed to update bookmark');
    }
  };

  // Get unique industries and RIASEC types for filter options
  const industries = Array.from(new Set(careers.map(career => career.industry)));
  const riasecTypes = Array.from(
    new Set(careers.flatMap(career => 
      career.riasecTypes.split(',').map(type => type.trim())
    ))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading Careers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eksplorasi Semua Profesi & Karir</h1>
          <p className="text-muted-foreground mt-2">
            Temukan profesi yang sesuai dengan minat dan bakat Anda
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama profesi, deskripsi, atau tipe RIASEC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-10"
            />
          </div>
        </div>
        
        <div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Industri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Industri</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={riasecFilter} onValueChange={setRiasecFilter}>
            <SelectTrigger className="h-10">
              <Briefcase className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter RIASEC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {riasecTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Careers Grid */}
      {filteredCareers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Tidak ditemukan profesi yang sesuai dengan kriteria pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <Card key={career.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{career.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleBookmark(career)}
                    aria-label={bookmarkedCareers.has(career.id) ? "Hapus dari bookmark" : "Tambahkan ke bookmark"}
                  >
                    <Bookmark 
                      className={`h-4 w-4 ${bookmarkedCareers.has(career.id) ? 'fill-current text-primary' : ''}`} 
                    />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{career.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Tipe: {career.riasecTypes}</Badge>
                  <Badge variant="outline">{career.industry}</Badge>
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // In a real app, this would navigate to the specific career page
                      console.log(`View details for ${career.name}`);
                    }}
                  >
                    Lihat Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground py-4">
        Menampilkan {filteredCareers.length} dari {careers.length} profesi
      </div>
    </div>
  );
};

export default CareersPage;