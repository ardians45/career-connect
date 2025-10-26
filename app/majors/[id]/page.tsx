'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users,
  Star,
  Heart,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';

// Mock data for majors
const mockMajors = [
  {
    id: '1',
    name: 'Teknik Informatika',
    description: 'Mempelajari pengembangan perangkat lunak, sistem informasi, dan teknologi informasi.',
    riasecTypes: 'I, R, E',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 50000000,
    jobOutlook: 'Sangat Baik',
    averageSalary: 8000000,
    popularityScore: 95,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 120,
    requiredSubjects: ['Matematika', 'Fisika', 'Bahasa Inggris'],
    curriculum: [
      'Algoritma dan Struktur Data',
      'Pemrograman Berorientasi Objek',
      'Basis Data',
      'Jaringan Komputer',
      'Sistem Operasi',
      'Kecerdasan Buatan'
    ],
    careerProspects: [
      'Software Engineer',
      'Data Scientist',
      'Cybersecurity Specialist',
      'System Analyst',
      'Web Developer'
    ]
  },
  {
    id: '2',
    name: 'Psikologi',
    description: 'Mempelajari perilaku manusia dan proses mental untuk membantu individu dalam berbagai aspek kehidupan.',
    riasecTypes: 'S, I, A',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 40000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6500000,
    popularityScore: 90,
    institution: 'Universitas Indonesia',
    location: 'Depok',
    admissionQuota: 80,
    requiredSubjects: ['Biologi', 'Bahasa Inggris', 'Psikologi'],
    curriculum: [
      'Psikologi Perkembangan',
      'Psikologi Sosial',
      'Psikologi Klinis',
      'Statistik Psikologi',
      'Metode Penelitian',
      'Neuropsikologi'
    ],
    careerProspects: [
      'Clinical Psychologist',
      'Counseling Psychologist',
      'HR Specialist',
      'Researcher',
      'Educational Psychologist'
    ]
  },
  {
    id: '3',
    name: 'Desain Komunikasi Visual',
    description: 'Menggabungkan seni dan teknologi dalam komunikasi visual untuk menciptakan karya yang menarik dan bermakna.',
    riasecTypes: 'A, S, E',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 45000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5800000,
    popularityScore: 85,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 60,
    requiredSubjects: ['Seni Rupa', 'Desain', 'Matematika'],
    curriculum: [
      'Prinsip Desain',
      'Tipografi',
      'Desain Digital',
      'Fotografi',
      'Web Design',
      'Branding dan Identitas Visual'
    ],
    careerProspects: [
      'Graphic Designer',
      'Art Director',
      'UI/UX Designer',
      'Illustrator',
      'Creative Director'
    ]
  },
  {
    id: '4',
    name: 'Manajemen',
    description: 'Mempelajari perencanaan, pengorganisasian, pengarahan, dan pengawasan sumber daya dalam organisasi.',
    riasecTypes: 'E, C, S',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 42000000,
    jobOutlook: 'Baik',
    averageSalary: 7000000,
    popularityScore: 88,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 100,
    requiredSubjects: ['Matematika', 'Ekonomi', 'Bahasa Inggris'],
    curriculum: [
      'Manajemen Pemasaran',
      'Manajemen Keuangan',
      'Manajemen Operasional',
      'Manajemen Sumber Daya Manusia',
      'Strategi Bisnis',
      'Kewirausahaan'
    ],
    careerProspects: [
      'Business Manager',
      'Marketing Manager',
      'Financial Analyst',
      'Entrepreneur',
      'Business Consultant'
    ]
  },
  {
    id: '5',
    name: 'Biologi',
    description: 'Mempelajari makhluk hidup dan lingkungan mereka, termasuk struktur, fungsi, pertumbuhan, dan evolusi.',
    riasecTypes: 'I, S, R',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 36000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6200000,
    popularityScore: 78,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 70,
    requiredSubjects: ['Biologi', 'Kimia', 'Fisika'],
    curriculum: [
      'Biologi Sel',
      'Genetika',
      'Ekologi',
      'Mikrobiologi',
      'Botani',
      'Zoologi'
    ],
    careerProspects: [
      'Biologist',
      'Research Scientist',
      'Environmental Consultant',
      'Geneticist',
      'Marine Biologist'
    ]
  },
  {
    id: '6',
    name: 'Sastra Inggris',
    description: 'Mempelajari bahasa Inggris, sastra, dan budaya negara berbahasa Inggris secara mendalam.',
    riasecTypes: 'A, I, S',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 35000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5500000,
    popularityScore: 75,
    institution: 'Universitas Padjadjaran',
    location: 'Bandung',
    admissionQuota: 80,
    requiredSubjects: ['Bahasa Inggris', 'Sastra', 'Linguistik'],
    curriculum: [
      'Grammar dan Syntax',
      'Sejarah Sastra Inggris',
      'Sastra Amerika',
      'Linguistik Terapan',
      'Penerjemahan',
      'Studi Budaya'
    ],
    careerProspects: [
      'Translator',
      'English Teacher',
      'Content Writer',
      'Editor',
      'Linguist'
    ]
  },
  {
    id: '7',
    name: 'Arsitektur',
    description: 'Mempelajari perencanaan, desain, dan konstruksi bangunan serta lingkungan binaan.',
    riasecTypes: 'A, R, I',
    degreeLevel: 'S1',
    studyDuration: 5,
    averageTuition: 55000000,
    jobOutlook: 'Baik',
    averageSalary: 7800000,
    popularityScore: 82,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 60,
    requiredSubjects: ['Gambar Teknik', 'Matematika', 'Fisika'],
    curriculum: [
      'Desain Arsitektur',
      'Struktur Bangunan',
      'Arsitektur Lanskap',
      'Sistem Bangunan',
      'Arsitektur Tradisional',
      'Perencanaan Kota'
    ],
    careerProspects: [
      'Architect',
      'Urban Planner',
      'Interior Designer',
      'Landscape Architect',
      'Project Manager'
    ]
  },
  {
    id: '8',
    name: 'Hukum',
    description: 'Mempelajari sistem hukum, undang-undang, dan penerapan hukum dalam masyarakat.',
    riasecTypes: 'C, S, I',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 40000000,
    jobOutlook: 'Baik',
    averageSalary: 6800000,
    popularityScore: 80,
    institution: 'Universitas Indonesia',
    location: 'Depok',
    admissionQuota: 90,
    requiredSubjects: ['Sejarah', 'Sosiologi', 'Bahasa Indonesia'],
    curriculum: [
      'Hukum Perdata',
      'Hukum Pidana',
      'Hukum Tata Negara',
      'Hukum Internasional',
      'Hukum Acara',
      'Filsafat Hukum'
    ],
    careerProspects: [
      'Advocate',
      'Notary',
      'Judge',
      'Prosecutor',
      'Corporate Legal Advisor'
    ]
  },
  {
    id: '9',
    name: 'Kedokteran',
    description: 'Mempelajari ilmu kedokteran dan kesehatan untuk mendiagnosis, mengobati, dan mencegah penyakit serta memelihara kesehatan individu dan masyarakat.',
    riasecTypes: 'I, S, E',
    degreeLevel: 'S1',
    studyDuration: 6,
    averageTuition: 120000000,
    jobOutlook: 'Sangat Baik',
    averageSalary: 15000000,
    popularityScore: 98,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 80,
    requiredSubjects: ['Biologi', 'Kimia', 'Fisika'],
    curriculum: [
      'Anatomi',
      'Fisiologi',
      'Patologi',
      'Farmakologi',
      'Penyakit Dalam',
      'Bedah'
    ],
    careerProspects: [
      'General Practitioner',
      'Medical Specialist',
      'Surgeon',
      'Medical Researcher',
      'Public Health Officer'
    ]
  },
  {
    id: '10',
    name: 'Ekonomi',
    description: 'Mempelajari sistem ekonomi, produksi, distribusi, dan konsumsi barang dan jasa serta perilaku ekonomi individu dan organisasi.',
    riasecTypes: 'C, E, S',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 43000000,
    jobOutlook: 'Baik',
    averageSalary: 7200000,
    popularityScore: 85,
    institution: 'Universitas Indonesia',
    location: 'Depok',
    admissionQuota: 110,
    requiredSubjects: ['Matematika', 'Ekonomi', 'Bahasa Inggris'],
    curriculum: [
      'Pengantar Ekonomi Mikro',
      'Pengantar Ekonomi Makro',
      'Statistika Ekonomi',
      'Ekonomi Pembangunan',
      'Ekonomi Internasional',
      'Ekonomi Moneter'
    ],
    careerProspects: [
      'Economist',
      'Financial Analyst',
      'Economic Consultant',
      'Policy Analyst',
      'Investment Banker'
    ]
  },
  {
    id: '11',
    name: 'Matematika',
    description: 'Mempelajari struktur, ruang, perubahan, dan kuantitas serta aplikasinya dalam berbagai bidang ilmu pengetahuan.',
    riasecTypes: 'I, R, C',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 35000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6500000,
    popularityScore: 72,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 50,
    requiredSubjects: ['Matematika', 'Fisika', 'Kimia'],
    curriculum: [
      'Kalkulus',
      'Aljabar Linear',
      'Statistika',
      'Analisis Real',
      'Metode Numerik',
      'Matematika Diskrit'
    ],
    careerProspects: [
      'Mathematician',
      'Data Analyst',
      'Actuary',
      'Operations Research Analyst',
      'Statistician'
    ]
  },
  {
    id: '12',
    name: 'Ilmu Komunikasi',
    description: 'Mempelajari proses komunikasi dan media dalam masyarakat serta strategi komunikasi efektif dalam berbagai konteks.',
    riasecTypes: 'S, E, A',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 41000000,
    jobOutlook: 'Baik',
    averageSalary: 6500000,
    popularityScore: 85,
    institution: 'Universitas Padjadjaran',
    location: 'Bandung',
    admissionQuota: 100,
    requiredSubjects: ['Sosiologi', 'Bahasa Indonesia', 'Bahasa Inggris'],
    curriculum: [
      'Teori Komunikasi',
      'Jurnalisme',
      'Hubungan Masyarakat',
      'Komunikasi Politik',
      'Media Digital',
      'Komunikasi Antar Budaya'
    ],
    careerProspects: [
      'Journalist',
      'Public Relations Specialist',
      'Communications Manager',
      'Media Planner',
      'Content Creator'
    ]
  },
  {
    id: '13',
    name: 'Teknik Sipil',
    description: 'Mempelajari perencanaan, perancangan, konstruksi, dan pengelolaan infrastruktur seperti jembatan, gedung, dan jalan.',
    riasecTypes: 'R, I, E',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 48000000,
    jobOutlook: 'Baik',
    averageSalary: 7500000,
    popularityScore: 80,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 120,
    requiredSubjects: ['Matematika', 'Fisika', 'Kimia'],
    curriculum: [
      'Mekanika Bahan',
      'Analisis Struktur',
      'Rekayasa Pondasi',
      'Transportasi',
      'Lingkungan',
      'Manajemen Konstruksi'
    ],
    careerProspects: [
      'Civil Engineer',
      'Structural Engineer',
      'Construction Manager',
      'Transportation Engineer',
      'Project Manager'
    ]
  },
  {
    id: '14',
    name: 'Sastra Indonesia',
    description: 'Mempelajari sastra Indonesia, linguistik, dan budaya Indonesia secara mendalam serta penerjemahan teks sastra.',
    riasecTypes: 'A, I, S',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 33000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5200000,
    popularityScore: 70,
    institution: 'Universitas Indonesia',
    location: 'Depok',
    admissionQuota: 60,
    requiredSubjects: ['Bahasa Indonesia', 'Sastra', 'Linguistik'],
    curriculum: [
      'Sejarah Sastra Indonesia',
      'Teori Sastra',
      'Linguistik Umum',
      'Sastra Anak',
      'Penerjemahan Sastra',
      'Sastra Banding'
    ],
    careerProspects: [
      'Writer',
      'Editor',
      'Literary Critic',
      'Teacher',
      'Translator'
    ]
  },
  {
    id: '15',
    name: 'Desain Produk',
    description: 'Mempelajari perancangan dan pengembangan produk yang fungsional, estetis, dan inovatif untuk kebutuhan pengguna.',
    riasecTypes: 'A, R, E',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 46000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6000000,
    popularityScore: 75,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 40,
    requiredSubjects: ['Gambar Teknik', 'Desain', 'Matematika'],
    curriculum: [
      'Prinsip Desain Produk',
      'Ergonomi',
      'Teknik Manufaktur',
      'Desain Interaksi',
      'Material dan Proses',
      'Pemodelan 3D'
    ],
    careerProspects: [
      'Product Designer',
      'Industrial Designer',
      'UX Designer',
      'Design Consultant',
      'Innovation Manager'
    ]
  },
  {
    id: '16',
    name: 'Fisika',
    description: 'Mempelajari prinsip dasar alam semesta termasuk materi, energi, gerak, ruang, dan waktu serta interaksinya.',
    riasecTypes: 'I, R, E',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 37000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6500000,
    popularityScore: 74,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 60,
    requiredSubjects: ['Fisika', 'Matematika', 'Kimia'],
    curriculum: [
      'Mekanika',
      'Elektromagnetisme',
      'Termodinamika',
      'Fisika Modern',
      'Optika',
      'Fisika Komputasi'
    ],
    careerProspects: [
      'Physicist',
      'Research Scientist',
      'Engineer',
      'Data Analyst',
      'Teacher'
    ]
  },
  {
    id: '17',
    name: 'Antropologi',
    description: 'Mempelajari manusia dan budayanya secara komprehensif, termasuk aspek sosial, budaya, dan sejarah.',
    riasecTypes: 'S, I, A',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 34000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5800000,
    popularityScore: 68,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 50,
    requiredSubjects: ['Sosiologi', 'Sejarah', 'Geografi'],
    curriculum: [
      'Antropologi Budaya',
      'Antropologi Sosial',
      'Sejarah Peradaban',
      'Metode Etnografi',
      'Antropologi Politik',
      'Antropologi Ekonomi'
    ],
    careerProspects: [
      'Anthropologist',
      'Researcher',
      'Cultural Consultant',
      'Museum Curator',
      'Social Worker'
    ]
  },
  {
    id: '18',
    name: 'Farmasi',
    description: 'Mempelajari ilmu kesehatan yang berfokus pada pengembangan, produksi, dan distribusi obat serta terapi farmasi.',
    riasecTypes: 'I, C, S',
    degreeLevel: 'S1',
    studyDuration: 5,
    averageTuition: 60000000,
    jobOutlook: 'Baik',
    averageSalary: 7500000,
    popularityScore: 78,
    institution: 'Universitas Airlangga',
    location: 'Surabaya',
    admissionQuota: 70,
    requiredSubjects: ['Kimia', 'Biologi', 'Fisika'],
    curriculum: [
      'Kimia Farmasi',
      'Farmakologi',
      'Farmasi Klinik',
      'Tata Hukum Farmasi',
      'Analisis Farmasi',
      'Farmasi Komunitas'
    ],
    careerProspects: [
      'Pharmacist',
      'Clinical Pharmacist',
      'Research Scientist',
      'Pharmaceutical Sales',
      'Regulatory Affairs Specialist'
    ]
  },
  {
    id: '19',
    name: 'Ilmu Politik',
    description: 'Mempelajari sistem politik, pemerintahan, dan proses politik dalam konteks lokal, nasional, dan internasional.',
    riasecTypes: 'S, E, C',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 38000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6200000,
    popularityScore: 72,
    institution: 'Universitas Indonesia',
    location: 'Depok',
    admissionQuota: 75,
    requiredSubjects: ['Sosiologi', 'Sejarah', 'Ekonomi'],
    curriculum: [
      'Teori Politik',
      'Ilmu Pemerintahan',
      'Hubungan Internasional',
      'Sosiologi Politik',
      'Administrasi Publik',
      'Kebijakan Publik'
    ],
    careerProspects: [
      'Politician',
      'Policy Analyst',
      'Government Officer',
      'Political Consultant',
      'Researcher'
    ]
  },
  {
    id: '20',
    name: 'Seni Rupa',
    description: 'Mempelajari berbagai bentuk ekspresi artistik melalui teknik lukis, patung, grafis, dan media seni lainnya.',
    riasecTypes: 'A, S, I',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 32000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5000000,
    popularityScore: 65,
    institution: 'Institut Kesenian Jakarta',
    location: 'Jakarta',
    admissionQuota: 40,
    requiredSubjects: ['Seni Rupa', 'Sejarah Seni', 'Desain'],
    curriculum: [
      'Teori Seni Rupa',
      'Melukis',
      'Pahat dan Patung',
      'Seni Grafis',
      'Seni Instalasi',
      'Kritik Seni'
    ],
    careerProspects: [
      'Artist',
      'Art Teacher',
      'Gallery Manager',
      'Art Restorer',
      'Art Consultant'
    ]
  },
  {
    id: '21',
    name: 'Teknik Elektro',
    description: 'Mempelajari sistem listrik, elektronika, dan teknologi komunikasi termasuk aplikasinya dalam perangkat modern.',
    riasecTypes: 'R, I, E',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 52000000,
    jobOutlook: 'Sangat Baik',
    averageSalary: 8000000,
    popularityScore: 88,
    institution: 'Institut Teknologi Bandung',
    location: 'Bandung',
    admissionQuota: 100,
    requiredSubjects: ['Matematika', 'Fisika', 'Kimia'],
    curriculum: [
      'Rangkaian Listrik',
      'Elektronika',
      'Sistem Kendali',
      'Teknik Tenaga Listrik',
      'Telekomunikasi',
      'Instrumentasi dan Pengukuran'
    ],
    careerProspects: [
      'Electrical Engineer',
      'Telecommunications Engineer',
      'Control Systems Engineer',
      'Power Systems Engineer',
      'Electronics Engineer'
    ]
  },
  {
    id: '22',
    name: 'Sosiologi',
    description: 'Mempelajari hubungan sosial, struktur masyarakat, dan perubahan sosial dalam konteks kehidupan bermasyarakat.',
    riasecTypes: 'S, I, C',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 35000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5800000,
    popularityScore: 70,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 65,
    requiredSubjects: ['Sosiologi', 'Sosiologi', 'Sejarah'],
    curriculum: [
      'Sosiologi Umum',
      'Metodologi Penelitian',
      'Sosiologi Perubahan Sosial',
      'Sosiologi Pendidikan',
      'Sosiologi Perkotaan',
      'Teori Sosial'
    ],
    careerProspects: [
      'Sociologist',
      'Researcher',
      'Social Worker',
      'Policy Analyst',
      'Human Resource Specialist'
    ]
  },
  {
    id: '23',
    name: 'Kriya Seni',
    description: 'Mempelajari keterampilan tangan dan teknik pembuatan karya seni terapan seperti kerajinan, tekstil, dan keramik.',
    riasecTypes: 'A, R, S',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 30000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 4800000,
    popularityScore: 60,
    institution: 'Institut Seni Indonesia Yogyakarta',
    location: 'Yogyakarta',
    admissionQuota: 35,
    requiredSubjects: ['Seni Rupa', 'Desain', 'Teknik Kerajinan'],
    curriculum: [
      'Teknik Keramik',
      'Teknik Tenun',
      'Teknik Kayu',
      'Desain Kriya',
      'Sejarah Kriya Nusantara',
      'Bahan dan Teknik Kriya'
    ],
    careerProspects: [
      'Craft Artist',
      'Design Consultant',
      'Artisan',
      'Gallery Owner',
      'Cultural Preservationist'
    ]
  },
  {
    id: '24',
    name: 'Kimia',
    description: 'Mempelajari sifat, struktur, dan reaksi zat kimia serta aplikasinya dalam berbagai bidang ilmu dan industri.',
    riasecTypes: 'I, R, C',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 36000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 6300000,
    popularityScore: 73,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 60,
    requiredSubjects: ['Kimia', 'Fisika', 'Matematika'],
    curriculum: [
      'Kimia Organik',
      'Kimia Anorganik',
      'Kimia Fisika',
      'Kimia Analitik',
      'Kimia Terapan',
      'Kimia Industri'
    ],
    careerProspects: [
      'Chemist',
      'Research Scientist',
      'Quality Control Analyst',
      'Pharmaceutical Scientist',
      'Environmental Consultant'
    ]
  },
  {
    id: '25',
    name: 'Ilmu Sejarah',
    description: 'Mempelajari peristiwa dan perkembangan masa lalu manusia serta interpretasi terhadap peristiwa sejarah.',
    riasecTypes: 'I, S, A',
    degreeLevel: 'S1',
    studyDuration: 4,
    averageTuition: 32000000,
    jobOutlook: 'Cukup Baik',
    averageSalary: 5500000,
    popularityScore: 65,
    institution: 'Universitas Gadjah Mada',
    location: 'Yogyakarta',
    admissionQuota: 45,
    requiredSubjects: ['Sejarah', 'Geografi', 'Sosiologi'],
    curriculum: [
      'Metodologi Sejarah',
      'Sejarah Peradaban Dunia',
      'Sejarah Indonesia',
      'Arsipologi',
      'Sejarah Politik',
      'Sejarah Sosial Ekonomi'
    ],
    careerProspects: [
      'Historian',
      'Archivist',
      'Museum Curator',
      'Teacher',
      'Researcher'
    ]
  }
];

interface Major {
  id: string;
  name: string;
  description: string;
  riasecTypes: string;
  degreeLevel: string;
  studyDuration: number;
  averageTuition: number;
  jobOutlook: string;
  averageSalary: number;
  popularityScore: number;
  institution: string;
  location: string;
  admissionQuota: number;
  requiredSubjects: string[];
  curriculum: string[];
  careerProspects: string[];
}

const MajorDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [major, setMajor] = useState<Major | null>(null);
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