'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, GraduationCap } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

interface Major {
  id: string;
  name: string;
  description: string;
  riasecTypes: string; // e.g. "R, I, A"
  category: string; // 'Saintek', 'Soshum', etc.
  degreeLevel: string; // 'S1', 'S2', etc.
}

const MajorsPage = () => {
  const { data: session } = useSession();
  const [majors, setMajors] = useState<Major[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riasecFilter, setRiasecFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockMajors: Major[] = [
      // Existing majors
      {
        id: '1',
        name: 'Teknik Informatika',
        description: 'Mempelajari pengembangan perangkat lunak, sistem informasi, dan teknologi informasi.',
        riasecTypes: 'I, R, E',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '2',
        name: 'Psikologi',
        description: 'Mempelajari perilaku manusia dan proses mental untuk membantu individu dalam berbagai aspek kehidupan.',
        riasecTypes: 'S, I, A',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '3',
        name: 'Desain Komunikasi Visual',
        description: 'Menggabungkan seni dan teknologi dalam komunikasi visual untuk menciptakan karya yang menarik dan bermakna.',
        riasecTypes: 'A, S, E',
        category: 'Seni',
        degreeLevel: 'S1',
      },
      {
        id: '4',
        name: 'Manajemen',
        description: 'Mempelajari perencanaan, pengorganisasian, pengarahan, dan pengawasan sumber daya dalam organisasi.',
        riasecTypes: 'E, C, S',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '5',
        name: 'Biologi',
        description: 'Mempelajari makhluk hidup dan lingkungan mereka, termasuk struktur, fungsi, pertumbuhan, dan evolusi.',
        riasecTypes: 'I, S, R',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '6',
        name: 'Sastra Inggris',
        description: 'Mempelajari bahasa Inggris, sastra, dan budaya negara berbahasa Inggris secara mendalam.',
        riasecTypes: 'A, I, S',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '7',
        name: 'Arsitektur',
        description: 'Mempelajari perencanaan, desain, dan konstruksi bangunan serta lingkungan binaan.',
        riasecTypes: 'A, R, I',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '8',
        name: 'Hukum',
        description: 'Mempelajari sistem hukum, undang-undang, dan penerapan hukum dalam masyarakat.',
        riasecTypes: 'C, S, I',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      // Added majors
      {
        id: '9',
        name: 'Kedokteran',
        description: 'Mempelajari ilmu kedokteran dan kesehatan untuk mendiagnosis, mengobati, dan mencegah penyakit serta memelihara kesehatan individu dan masyarakat.',
        riasecTypes: 'I, S, E',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '10',
        name: 'Ekonomi',
        description: 'Mempelajari sistem ekonomi, produksi, distribusi, dan konsumsi barang dan jasa serta perilaku ekonomi individu dan organisasi.',
        riasecTypes: 'C, E, S',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '11',
        name: 'Matematika',
        description: 'Mempelajari struktur, ruang, perubahan, dan kuantitas serta aplikasinya dalam berbagai bidang ilmu pengetahuan.',
        riasecTypes: 'I, R, C',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '12',
        name: 'Ilmu Komunikasi',
        description: 'Mempelajari proses komunikasi dan media dalam masyarakat serta strategi komunikasi efektif dalam berbagai konteks.',
        riasecTypes: 'S, E, A',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '13',
        name: 'Teknik Sipil',
        description: 'Mempelajari perencanaan, perancangan, konstruksi, dan pengelolaan infrastruktur seperti jembatan, gedung, dan jalan.',
        riasecTypes: 'R, I, E',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '14',
        name: 'Sastra Indonesia',
        description: 'Mempelajari sastra Indonesia, linguistik, dan budaya Indonesia secara mendalam serta penerjemahan teks sastra.',
        riasecTypes: 'A, I, S',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '15',
        name: 'Desain Produk',
        description: 'Mempelajari perancangan dan pengembangan produk yang fungsional, estetis, dan inovatif untuk kebutuhan pengguna.',
        riasecTypes: 'A, R, E',
        category: 'Seni',
        degreeLevel: 'S1',
      },
      {
        id: '16',
        name: 'Fisika',
        description: 'Mempelajari prinsip dasar alam semesta termasuk materi, energi, gerak, ruang, dan waktu serta interaksinya.',
        riasecTypes: 'I, R, E',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '17',
        name: 'Antropologi',
        description: 'Mempelajari manusia dan budayanya secara komprehensif, termasuk aspek sosial, budaya, dan sejarah.',
        riasecTypes: 'S, I, A',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '18',
        name: 'Farmasi',
        description: 'Mempelajari ilmu kesehatan yang berfokus pada pengembangan, produksi, dan distribusi obat serta terapi farmasi.',
        riasecTypes: 'I, C, S',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '19',
        name: 'Ilmu Politik',
        description: 'Mempelajari sistem politik, pemerintahan, dan proses politik dalam konteks lokal, nasional, dan internasional.',
        riasecTypes: 'S, E, C',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '20',
        name: 'Seni Rupa',
        description: 'Mempelajari berbagai bentuk ekspresi artistik melalui teknik lukis, patung, grafis, dan media seni lainnya.',
        riasecTypes: 'A, S, I',
        category: 'Seni',
        degreeLevel: 'S1',
      },
      {
        id: '21',
        name: 'Teknik Elektro',
        description: 'Mempelajari sistem listrik, elektronika, dan teknologi komunikasi termasuk aplikasinya dalam perangkat modern.',
        riasecTypes: 'R, I, E',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '22',
        name: 'Sosiologi',
        description: 'Mempelajari hubungan sosial, struktur masyarakat, dan perubahan sosial dalam konteks kehidupan bermasyarakat.',
        riasecTypes: 'S, I, C',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
      {
        id: '23',
        name: 'Kriya Seni',
        description: 'Mempelajari keterampilan tangan dan teknik pembuatan karya seni terapan seperti kerajinan, tekstil, dan keramik.',
        riasecTypes: 'A, R, S',
        category: 'Seni',
        degreeLevel: 'S1',
      },
      {
        id: '24',
        name: 'Kimia',
        description: 'Mempelajari sifat, struktur, dan reaksi zat kimia serta aplikasinya dalam berbagai bidang ilmu dan industri.',
        riasecTypes: 'I, R, C',
        category: 'Saintek',
        degreeLevel: 'S1',
      },
      {
        id: '25',
        name: 'Ilmu Sejarah',
        description: 'Mempelajari peristiwa dan perkembangan masa lalu manusia serta interpretasi terhadap peristiwa sejarah.',
        riasecTypes: 'I, S, A',
        category: 'Soshum',
        degreeLevel: 'S1',
      },
    ];

    setMajors(mockMajors);
    setFilteredMajors(mockMajors);
    setIsLoading(false);
  }, []);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = majors;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(major => 
        major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        major.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(major => major.category === categoryFilter);
    }

    // Apply RIASEC filter
    if (riasecFilter !== 'all') {
      result = result.filter(major => 
        major.riasecTypes.toLowerCase().includes(riasecFilter.toLowerCase())
      );
    }

    setFilteredMajors(result);
  }, [searchTerm, categoryFilter, riasecFilter, majors]);

  // Get unique categories and RIASEC types for filter options
  const categories = Array.from(new Set(majors.map(major => major.category)));
  const riasecTypes = Array.from(
    new Set(majors.flatMap(major => 
      major.riasecTypes.split(',').map(type => type.trim())
    ))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading Majors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eksplorasi Semua Jurusan Kuliah</h1>
          <p className="text-muted-foreground mt-2">
            Temukan jurusan kuliah yang sesuai dengan minat dan bakat Anda
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama jurusan, deskripsi, atau tipe RIASEC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-10"
            />
          </div>
        </div>
        
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={riasecFilter} onValueChange={setRiasecFilter}>
            <SelectTrigger className="h-10">
              <GraduationCap className="h-4 w-4 mr-2" />
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

      {/* Majors Grid */}
      {filteredMajors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Tidak ditemukan jurusan yang sesuai dengan kriteria pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMajors.map((major) => (
            <Card key={major.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{major.name}</span>
                  <Badge variant="secondary">{major.degreeLevel}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{major.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Tipe: {major.riasecTypes}</Badge>
                  <Badge variant="outline">{major.category}</Badge>
                </div>
                <div className="mt-auto">
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground py-4">
        Menampilkan {filteredMajors.length} dari {majors.length} jurusan
      </div>
    </div>
  );
};

export default MajorsPage;