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
    description: 'Mengembangkan, menguji, dan memelihara perangkat lunak aplikasi dan sistem komputer.',
    riasecTypes: 'I, R, E',
    industry: 'IT',
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
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    description: 'Merancang antarmuka pengguna dan pengalaman pengguna yang intuitif dan menarik.',
    riasecTypes: 'A, S, E',
    industry: 'IT',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Visual Design'],
    educationRequirement: 'S1 Desain Komunikasi Visual, Desain Produk, atau Ilmu Komputer',
    salaryRange: { min: 5500000, max: 10000000 },
    jobGrowthRate: 15,
    popularityScore: 92,
    workEnvironment: 'Kantor, Hybrid',
    typicalTasks: [
      'Membuat wireframes dan prototipe',
      'Melakukan penelitian dan pengujian pengguna',
      'Mendesain antarmuka pengguna yang intuitif',
      'Bekerja sama dengan tim pengembang dan produk',
      'Mengelola sistem desain produk'
    ],
    careerPath: [
      'Junior Designer → UI/UX Designer → Senior Designer → Design Lead → Director of Design',
      'UI/UX Designer → Product Designer → Staff Designer → Principal Designer'
    ]
  },
  {
    id: '3',
    title: 'Data Scientist',
    description: 'Menganalisis dan menginterpretasikan data kompleks untuk membantu organisasi dalam pengambilan keputusan.',
    riasecTypes: 'I, R, C',
    industry: 'IT',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistical Analysis', 'Data Visualization'],
    educationRequirement: 'S1/S2 Matematika, Statistika, Ilmu Komputer, atau Teknik',
    salaryRange: { min: 7000000, max: 15000000 },
    jobGrowthRate: 35,
    popularityScore: 95,
    workEnvironment: 'Kantor, Hybrid',
    typicalTasks: [
      'Menganalisis data besar dan kompleks',
      'Membangun model prediktif dan pembelajaran mesin',
      'Menyajikan temuan dan rekomendasi bisnis',
      'Bekerja sama dengan tim teknik dan bisnis',
      'Mengembangkan pipeline data'
    ],
    careerPath: [
      'Junior Data Scientist → Data Scientist → Senior Data Scientist → Lead Data Scientist → Director of Data Science',
      'Data Scientist → Data Science Manager → VP of Data Science'
    ]
  },
  {
    id: '4',
    title: 'Cybersecurity Analyst',
    description: 'Melindungi sistem dan jaringan organisasi dari ancaman keamanan digital.',
    riasecTypes: 'I, R, C',
    industry: 'IT',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Network Security', 'Risk Assessment', 'Incident Response', 'Firewalls', 'SIEM', 'Penetration Testing'],
    educationRequirement: 'S1 Teknik Informatika, Sistem Informasi, atau Keamanan Siber',
    salaryRange: { min: 6500000, max: 13000000 },
    jobGrowthRate: 32,
    popularityScore: 88,
    workEnvironment: 'Kantor',
    typicalTasks: [
      'Menganalisis lalu lintas jaringan untuk ancaman potensial',
      'Menerapkan dan mengelola alat keamanan',
      'Melakukan penilaian risiko dan audit keamanan',
      'Menyusun laporan kejadian keamanan',
      'Melakukan pelatihan kesadaran keamanan'
    ],
    careerPath: [
      'Security Analyst → Senior Security Analyst → Security Engineer → Security Architect → CISO',
      'Security Analyst → Incident Responder → Security Consultant → Manager Keamanan'
    ]
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    description: 'Menggabungkan pengembangan perangkat lunak dan operasi TI untuk meningkatkan efisiensi.',
    riasecTypes: 'R, I, E',
    industry: 'IT',
    experienceLevel: 'Mid Level',
    requiredSkills: ['CI/CD', 'Cloud Platforms', 'Infrastructure as Code', 'Containerization', 'Monitoring', 'Scripting'],
    educationRequirement: 'S1 Teknik Informatika, Sistem Informasi, atau Ilmu Komputer',
    salaryRange: { min: 7500000, max: 14000000 },
    jobGrowthRate: 25,
    popularityScore: 90,
    workEnvironment: 'Kantor, Remote, Hybrid',
    typicalTasks: [
      'Mengelola infrastruktur cloud dan server',
      'Membangun pipeline CI/CD',
      'Mengotomatiskan proses deployment',
      'Memantau dan mengoptimalkan kinerja sistem',
      'Bekerja sama dengan tim pengembang'
    ],
    careerPath: [
      'DevOps Engineer → Senior DevOps Engineer → DevOps Lead → Infrastructure Architect → Director of Infrastructure',
      'DevOps Engineer → Platform Engineer → Site Reliability Engineer → Engineering Manager'
    ]
  },
  {
    id: '6',
    title: 'Product Manager',
    description: 'Mengelola siklus hidup produk dan memastikan pengembangan sesuai kebutuhan pasar.',
    riasecTypes: 'E, S, C',
    industry: 'IT',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Product Strategy', 'Market Analysis', 'User Research', 'Roadmapping', 'Agile Methodology', 'Stakeholder Management'],
    educationRequirement: 'S1 Teknik Informatika, Manajemen, atau Bisnis',
    salaryRange: { min: 8000000, max: 16000000 },
    jobGrowthRate: 11,
    popularityScore: 94,
    workEnvironment: 'Kantor',
    typicalTasks: [
      'Menganalisis kebutuhan pasar dan pengguna',
      'Membuat dan mengelola roadmap produk',
      'Bekerja sama dengan tim pengembang dan desain',
      'Mengevaluasi metrik dan kinerja produk',
      'Mengelola hubungan dengan stakeholder'
    ],
    careerPath: [
      'Associate Product Manager → Product Manager → Senior Product Manager → Group Product Manager → VP of Product',
      'Product Manager → Principal Product Manager → Chief Product Officer'
    ]
  },
  {
    id: '7',
    title: 'Graphic Designer',
    description: 'Menciptakan desain visual untuk mencetak dan media digital menggunakan elemen teks, gambar, dan warna.',
    riasecTypes: 'A, S, E',
    industry: 'Kreatif',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Adobe Creative Suite', 'Typography', 'Layout Design', 'Color Theory', 'Brand Identity', 'Digital Illustration'],
    educationRequirement: 'S1 Desain Komunikasi Visual, Desain Grafis, atau Seni Rupa',
    salaryRange: { min: 4000000, max: 8000000 },
    jobGrowthRate: 3,
    popularityScore: 85,
    workEnvironment: 'Kantor, Studio, Freelance',
    typicalTasks: [
      'Mendesain materi promosi dan kampanye',
      'Membuat identitas visual brand',
      'Mengembangkan layout publikasi',
      'Membuat ilustrasi dan elemen visual',
      'Berkoordinasi dengan klien dan tim kreatif'
    ],
    careerPath: [
      'Junior Designer → Graphic Designer → Senior Designer → Art Director → Creative Director',
      'Graphic Designer → Brand Designer → Creative Lead → Head of Design'
    ]
  },
  {
    id: '8',
    title: 'Video Editor',
    description: 'Mengedit dan menyusun cuplikan video menjadi narasi yang utuh dan menarik.',
    riasecTypes: 'A, R, S',
    industry: 'Kreatif',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Adobe Premiere Pro', 'Final Cut Pro', 'After Effects', 'Color Grading', 'Audio Editing', 'Motion Graphics'],
    educationRequirement: 'S1 Film, Televisi, atau Produksi Digital',
    salaryRange: { min: 4500000, max: 9000000 },
    jobGrowthRate: 18,
    popularityScore: 82,
    workEnvironment: 'Studio, Freelance',
    typicalTasks: [
      'Mengedit video untuk berbagai medium',
      'Menerapkan efek dan warna pada tayangan',
      'Menyinkronkan audio dan video',
      'Menggabungkan berbagai klip menjadi narasi koheren',
      'Berkoordinasi dengan sutradara dan produser'
    ],
    careerPath: [
      'Video Editor → Senior Video Editor → Lead Editor → Post-Production Supervisor → Creative Director',
      'Freelance Editor → Specialized Editor → Editor in Charge → Executive Producer'
    ]
  },
  {
    id: '9',
    title: 'Content Creator',
    description: 'Menciptakan dan menyebarkan konten menarik di berbagai platform media sosial.',
    riasecTypes: 'A, E, S',
    industry: 'Kreatif',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Content Strategy', 'Social Media', 'Photography', 'Video Production', 'Writing', 'SEO'],
    educationRequirement: 'S1 Ilmu Komunikasi, Desain, atau Marketing',
    salaryRange: { min: 3500000, max: 12000000 },
    jobGrowthRate: 24,
    popularityScore: 90,
    workEnvironment: 'Remote, Freelance, Studio',
    typicalTasks: [
      'Menghasilkan ide konten menarik',
      'Membuat dan mengedit konten multimedia',
      'Menganalisis keterlibatan audiens',
      'Berinteraksi dengan pengikut',
      'Membangun dan memelihara personal brand'
    ],
    careerPath: [
      'Content Creator → Social Media Manager → Content Strategist → Brand Manager → Creative Director',
      'Influencer → Creator → Content Producer → Media Personality'
    ]
  },
  {
    id: '10',
    title: 'Art Director',
    description: 'Mengarahkan elemen visual dari kampanye pemasaran untuk memastikan konsistensi estetika.',
    riasecTypes: 'A, E, S',
    industry: 'Kreatif',
    experienceLevel: 'Senior Level',
    requiredSkills: ['Visual Concept Development', 'Team Leadership', 'Brand Consistency', 'Creative Direction', 'Project Management', 'Client Relations'],
    educationRequirement: 'S1 Desain Komunikasi Visual, Desain Grafis, atau Seni Rupa',
    salaryRange: { min: 9000000, max: 18000000 },
    jobGrowthRate: 7,
    popularityScore: 88,
    workEnvironment: 'Kantor, Agency',
    typicalTasks: [
      'Mengembangkan konsep visual untuk kampanye',
      'Mengawasi tim desainer dan kreator',
      'Berkoordinasi dengan klien dan tim akun',
      'Mempertahankan konsistensi brand',
      'Mengambil keputusan kreatif'
    ],
    careerPath: [
      'Art Director → Senior Art Director → Creative Director → Executive Creative Director → Chief Creative Officer',
      'Creative Lead → Group Creative Director → Global Creative Director'
    ]
  },
  {
    id: '11',
    title: 'Photographer',
    description: 'Mengambil dan mengedit foto untuk berbagai keperluan komersial dan artistik.',
    riasecTypes: 'A, R, S',
    industry: 'Kreatif',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Camera Operation', 'Lighting', 'Composition', 'Photo Editing', 'Lightroom', 'Photoshop'],
    educationRequirement: 'S1 Fotografi, Seni Rupa, atau Desain Visual',
    salaryRange: { min: 3000000, max: 10000000 },
    jobGrowthRate: 8,
    popularityScore: 80,
    workEnvironment: 'Studio, Lapangan, Freelance',
    typicalTasks: [
      'Mengambil foto untuk berbagai keperluan',
      'Mengedit dan mengolah foto digital',
      'Berkoordinasi dengan model dan klien',
      'Mengelola peralatan fotografi',
      'Membangun portofolio profesional'
    ],
    careerPath: [
      'Photographer → Senior Photographer → Lead Photographer → Photography Director → Creative Director',
      'Freelance Photographer → Studio Owner → Photo Editor → Visual Director'
    ]
  },
  {
    id: '12',
    title: 'Copywriter',
    description: 'Menulis teks promosi dan iklan yang menarik dan persuasif untuk berbagai media.',
    riasecTypes: 'A, I, E',
    industry: 'Kreatif',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Creative Writing', 'Brand Voice', 'SEO Writing', 'Storytelling', 'Marketing Psychology', 'Content Strategy'],
    educationRequirement: 'S1 Sastra, Ilmu Komunikasi, atau Marketing',
    salaryRange: { min: 4000000, max: 8500000 },
    jobGrowthRate: 5,
    popularityScore: 83,
    workEnvironment: 'Kantor, Freelance',
    typicalTasks: [
      'Menulis copy iklan dan materi promosi',
      'Mengembangkan pesan brand yang konsisten',
      'Membuat konten untuk berbagai platform',
      'Berkoordinasi dengan tim kreatif dan akun',
      'Melakukan riset pasar dan audiens'
    ],
    careerPath: [
      'Copywriter → Senior Copywriter → Creative Writer → Group Copy Chief → Chief Creative Officer',
      'Junior Writer → Copywriter → Lead Writer → Content Director'
    ]
  },
  {
    id: '13',
    title: 'Dokter Umum',
    description: 'Mendiagnosis dan mengobati berbagai kondisi medis serta memberikan layanan kesehatan primer.',
    riasecTypes: 'I, S, E',
    industry: 'Kesehatan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Diagnosis', 'Treatment Planning', 'Patient Care', 'Medical Ethics', 'Clinical Procedures', 'Communication'],
    educationRequirement: 'S1 Kedokteran + Profesi Kedokteran',
    salaryRange: { min: 8000000, max: 15000000 },
    jobGrowthRate: 4,
    popularityScore: 96,
    workEnvironment: 'Rumah Sakit, Puskesmas, Klinik',
    typicalTasks: [
      'Mendiagnosis kondisi kesehatan pasien',
      'Merencanakan dan mengeksekusi pengobatan',
      'Mengelola catatan medis',
      'Mengedukasi pasien tentang kesehatan',
      'Bekerja sama dengan spesialis jika diperlukan'
    ],
    careerPath: [
      'Dokter Umum → Specialist Doctor → Senior Consultant → Department Head → Chief of Medical Staff',
      'General Practitioner → Family Physician → Medical Specialist → Medical Director'
    ]
  },
  {
    id: '14',
    title: 'Perawat',
    description: 'Memberikan perawatan langsung kepada pasien dan membantu dokter dalam proses penyembuhan.',
    riasecTypes: 'S, I, C',
    industry: 'Kesehatan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Patient Care', 'Medication Administration', 'Vital Signs Monitoring', 'Care Planning', 'Communication', 'Emergency Response'],
    educationRequirement: 'D3/S1 Keperawatan',
    salaryRange: { min: 5000000, max: 9000000 },
    jobGrowthRate: 9,
    popularityScore: 92,
    workEnvironment: 'Rumah Sakit, Klinik, Puskesmas',
    typicalTasks: [
      'Memberikan perawatan dan obat pasien',
      'Memantau tanda-tanda vital',
      'Membantu dalam prosedur medis',
      'Mengedukasi pasien dan keluarga',
      'Mencatat perkembangan kondisi pasien'
    ],
    careerPath: [
      'Staff Nurse → Senior Nurse → Charge Nurse → Nurse Manager → Nurse Director',
      'RN → Nurse Specialist → Nurse Practitioner → Clinical Nurse Manager'
    ]
  },
  {
    id: '15',
    title: 'Psikolog Klinis',
    description: 'Mendiagnosis dan mengobati masalah kesehatan mental dan emosional melalui terapi.',
    riasecTypes: 'S, I, A',
    industry: 'Kesehatan',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Psychotherapy', 'Assessment', 'Clinical Interview', 'Diagnosis', 'Treatment Planning', 'Documentation'],
    educationRequirement: 'S1 Psikologi + S2 Psikologi Klinis + STR Psikolog',
    salaryRange: { min: 6000000, max: 12000000 },
    jobGrowthRate: 11,
    popularityScore: 89,
    workEnvironment: 'Klinik, Rumah Sakit, Praktek Pribadi',
    typicalTasks: [
      'Melakukan assessment psikologis',
      'Menyediakan terapi individu dan kelompok',
      'Mendiagnosis kondisi mental',
      'Membuat rencana perawatan',
      'Bekerja sama dengan tim medis lainnya'
    ],
    careerPath: [
      'Clinical Psychologist → Senior Psychologist → Lead Therapist → Clinical Director → Psychology Department Head',
      'Licensed Psychologist → Specialist → Supervisor → Psychology Program Director'
    ]
  },
  {
    id: '16',
    title: 'Fisioterapis',
    description: 'Membantu pasien memulihkan fungsi gerak dan mengurangi rasa sakit setelah cedera atau penyakit.',
    riasecTypes: 'S, R, I',
    industry: 'Kesehatan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Movement Assessment', 'Exercise Therapy', 'Manual Therapy', 'Patient Education', 'Treatment Planning', 'Equipment Operation'],
    educationRequirement: 'S1 Fisioterapi',
    salaryRange: { min: 5500000, max: 10000000 },
    jobGrowthRate: 21,
    popularityScore: 85,
    workEnvironment: 'Rumah Sakit, Klinik Rehabilitasi, Pusat Kebugaran',
    typicalTasks: [
      'Menilai mobilitas dan fungsi gerak pasien',
      'Mengembangkan program latihan rehabilitasi',
      'Melakukan terapi manual',
      'Mengedukasi pasien tentang pencegahan cedera',
      'Menggunakan peralatan terapi fisik'
    ],
    careerPath: [
      'Fisioterapis → Senior Fisioterapis → Specialist Fisioterapis → Clinical Supervisor → Fisioterapi Department Manager',
      'Licensed PT → Specialist PT → Clinical Director → Healthcare Administrator'
    ]
  },
  {
    id: '17',
    title: 'Dokter Spesialis',
    description: 'Berfokus pada spesialisasi medis tertentu seperti jantung, otak, kulit, atau anak.',
    riasecTypes: 'I, S, R',
    industry: 'Kesehatan',
    experienceLevel: 'Senior Level',
    requiredSkills: ['Specialized Medical Knowledge', 'Advanced Procedures', 'Diagnostics', 'Research', 'Patient Care', 'Team Leadership'],
    educationRequirement: 'S1 Kedokteran + Profesi Kedokteran + Spesialisasi',
    salaryRange: { min: 15000000, max: 30000000 },
    jobGrowthRate: 6,
    popularityScore: 97,
    workEnvironment: 'Rumah Sakit, Klinik Spesialis',
    typicalTasks: [
      'Mendiagnosis dan mengobati kondisi spesifik',
      'Melakukan prosedur medis canggih',
      'Melakukan penelitian klinis',
      'Melatih dokter umum dan residen',
      'Berpartisipasi dalam protokol perawatan'
    ],
    careerPath: [
      'Dokter Spesialis → Senior Consultant → Head of Department → Medical Director → Chief Physician',
      'Specialist → Subspecialist → Division Chief → Hospital Chief of Staff'
    ]
  },
  {
    id: '18',
    title: 'Nutrisionis',
    description: 'Memberikan konsultasi nutrisi dan perencanaan makanan untuk meningkatkan kesehatan.',
    riasecTypes: 'I, S, C',
    industry: 'Kesehatan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Nutritional Assessment', 'Meal Planning', 'Dietary Counseling', 'Nutritional Science', 'Patient Education', 'Documentation'],
    educationRequirement: 'S1 Gizi',
    salaryRange: { min: 4500000, max: 9000000 },
    jobGrowthRate: 8,
    popularityScore: 80,
    workEnvironment: 'Rumah Sakit, Klinik, Pusat Kebugaran',
    typicalTasks: [
      'Menilai kebutuhan nutrisi pasien',
      'Mengembangkan program diet',
      'Memberikan konsultasi nutrisi',
      'Mengelola program gizi institusi',
      'Mendidik pasien tentang pola makan sehat'
    ],
    careerPath: [
      'Nutrisionis → Senior Nutrisionis → Clinical Manager → Nutritional Director → Chief of Nutrition Services',
      'Dietitian → Specialist Dietitian → Nutrition Consultant → Health Program Director'
    ]
  },
  {
    id: '19',
    title: 'Business Analyst',
    description: 'Menganalisis proses bisnis dan memberikan rekomendasi untuk meningkatkan efisiensi.',
    riasecTypes: 'I, C, E',
    industry: 'Bisnis',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Data Analysis', 'Process Modeling', 'Requirements Gathering', 'Stakeholder Management', 'Project Management', 'Business Process Improvement'],
    educationRequirement: 'S1 Manajemen, Teknik Industri, Teknik Informatika, atau Ekonomi',
    salaryRange: { min: 6000000, max: 11000000 },
    jobGrowthRate: 14,
    popularityScore: 86,
    workEnvironment: 'Kantor',
    typicalTasks: [
      'Menganalisis kebutuhan bisnis',
      'Mengumpulkan dan mendokumentasikan persyaratan',
      'Membangun model proses bisnis',
      'Bekerja sama dengan tim teknis dan bisnis',
      'Mengevaluasi efektivitas solusi'
    ],
    careerPath: [
      'Business Analyst → Senior Business Analyst → Lead Business Analyst → Product Owner → Director of Business Analysis',
      'BA → Project Manager → Program Manager → Business Director'
    ]
  },
  {
    id: '20',
    title: 'Marketing Manager',
    description: 'Merencanakan dan mengeksekusi strategi pemasaran untuk mempromosikan produk atau layanan.',
    riasecTypes: 'E, A, S',
    industry: 'Bisnis',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Marketing Strategy', 'Campaign Management', 'Market Research', 'Brand Management', 'Digital Marketing', 'Team Leadership'],
    educationRequirement: 'S1 Marketing, Manajemen, atau Ilmu Komunikasi',
    salaryRange: { min: 8000000, max: 15000000 },
    jobGrowthRate: 10,
    popularityScore: 90,
    workEnvironment: 'Kantor',
    typicalTasks: [
      'Mengembangkan strategi pemasaran komprehensif',
      'Mengawasi kampanye pemasaran',
      'Melakukan riset pasar dan analisis kompetitor',
      'Bekerja sama dengan agensi dan vendor',
      'Mengelola anggaran pemasaran'
    ],
    careerPath: [
      'Marketing Specialist → Marketing Manager → Senior Marketing Manager → Marketing Director → Chief Marketing Officer',
      'Marketing Coordinator → Marketing Lead → Marketing Manager → VP of Marketing'
    ]
  },
  {
    id: '21',
    title: 'Financial Analyst',
    description: 'Menganalisis data keuangan untuk membantu organisasi membuat keputusan investasi.',
    riasecTypes: 'I, C, E',
    industry: 'Bisnis',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Financial Modeling', 'Data Analysis', 'Investment Research', 'Risk Assessment', 'Excel', 'Financial Reporting'],
    educationRequirement: 'S1 Akuntansi, Keuangan, Ekonomi, atau Matematika',
    salaryRange: { min: 6500000, max: 12000000 },
    jobGrowthRate: 6,
    popularityScore: 85,
    workEnvironment: 'Kantor',
    typicalTasks: [
      'Menganalisis laporan keuangan',
      'Membangun model keuangan',
      'Menilai peluang investasi',
      'Menyusun laporan analisis',
      'Memberikan rekomendasi investasi'
    ],
    careerPath: [
      'Financial Analyst → Senior Financial Analyst → Finance Manager → Finance Director → Chief Financial Officer',
      'Analyst → Associate → Senior Associate → Vice President → Managing Director'
    ]
  },
  {
    id: '22',
    title: 'Human Resources Manager',
    description: 'Mengelola hubungan karyawan dan kebijakan organisasi terkait sumber daya manusia.',
    riasecTypes: 'S, E, C',
    industry: 'Bisnis',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Employee Relations', 'Recruitment', 'Performance Management', 'HR Policy', 'Training & Development', 'Compliance'],
    educationRequirement: 'S1 Manajemen SDM, Psikologi, atau Ilmu Sosial',
    salaryRange: { min: 7500000, max: 14000000 },
    jobGrowthRate: 7,
    popularityScore: 84,
    workEnvironment: 'Kantor',
    typicalTasks: [
      'Mengelola rekrutmen dan seleksi',
      'Menyusun kebijakan SDM',
      'Menangani hubungan karyawan',
      'Merancang program pelatihan',
      'Menilai kinerja karyawan'
    ],
    careerPath: [
      'HR Specialist → HR Manager → Senior HR Manager → HR Director → Chief Human Resources Officer',
      'HR Generalist → HR Business Partner → HR Manager → VP of Human Resources'
    ]
  },
  {
    id: '23',
    title: 'Project Manager',
    description: 'Merencanakan, mengeksekusi, dan menutup proyek organisasi sesuai jadwal dan anggaran.',
    riasecTypes: 'E, C, S',
    industry: 'Bisnis',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Project Planning', 'Risk Management', 'Team Leadership', 'Budget Management', 'Stakeholder Communication', 'Agile Methodology'],
    educationRequirement: 'S1 Teknik, Manajemen, atau bidang terkait',
    salaryRange: { min: 7500000, max: 15000000 },
    jobGrowthRate: 11,
    popularityScore: 91,
    workEnvironment: 'Kantor, Lapangan',
    typicalTasks: [
      'Mengelola siklus proyek dari awal hingga akhir',
      'Menyusun jadwal dan anggaran',
      'Mengawasi tim proyek',
      'Mengelola risiko dan kendala',
      'Berkoordinasi dengan stakeholder'
    ],
    careerPath: [
      'Project Coordinator → Project Manager → Senior Project Manager → Program Manager → Project Director',
      'Junior PM → PM → Lead PM → Portfolio Manager → VP of Project Management'
    ]
  },
  {
    id: '24',
    title: 'Consultant',
    description: 'Memberikan saran ahli dalam bidang tertentu untuk membantu organisasi meningkatkan kinerja.',
    riasecTypes: 'I, E, S',
    industry: 'Bisnis',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Problem Solving', 'Strategic Thinking', 'Client Management', 'Analytical Skills', 'Communication', 'Industry Expertise'],
    educationRequirement: 'S1 bidang terkait + Pengalaman industri',
    salaryRange: { min: 8500000, max: 20000000 },
    jobGrowthRate: 11,
    popularityScore: 89,
    workEnvironment: 'Kantor konsultan, Klien',
    typicalTasks: [
      'Menganalisis masalah bisnis klien',
      'Mengembangkan rekomendasi strategis',
      'Membantu implementasi solusi',
      'Menyusun laporan dan presentasi',
      'Berkoordinasi dengan tim klien'
    ],
    careerPath: [
      'Junior Consultant → Consultant → Senior Consultant → Manager → Partner',
      'Analyst → Associate → Manager → Principal → Senior Partner'
    ]
  },
  {
    id: '25',
    title: 'Teacher',
    description: 'Mengajar dan membimbing siswa dalam berbagai mata pelajaran di tingkat pendidikan.',
    riasecTypes: 'S, I, A',
    industry: 'Pendidikan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Classroom Management', 'Curriculum Development', 'Educational Technology', 'Assessment', 'Student Engagement', 'Communication'],
    educationRequirement: 'S1 Pendidikan sesuai bidang',
    salaryRange: { min: 3500000, max: 7000000 },
    jobGrowthRate: 4,
    popularityScore: 85,
    workEnvironment: 'Sekolah',
    typicalTasks: [
      'Menyusun dan menyampaikan pelajaran',
      'Menilai kemajuan siswa',
      'Mengelola kelas dan perilaku siswa',
      'Berkoordinasi dengan orang tua dan staf',
      'Mengembangkan materi pembelajaran'
    ],
    careerPath: [
      'Teacher → Senior Teacher → Subject Lead → Principal → Superintendent',
      'Educator → Senior Educator → Academic Coordinator → Education Administrator'
    ]
  },
  {
    id: '26',
    title: 'University Professor',
    description: 'Mengajar di perguruan tinggi dan melakukan penelitian dalam bidang keahlian.',
    riasecTypes: 'I, S, A',
    industry: 'Pendidikan',
    experienceLevel: 'Senior Level',
    requiredSkills: ['Academic Research', 'Teaching', 'Publishing', 'Grant Writing', 'Mentoring', 'Curriculum Design'],
    educationRequirement: 'S3 (PhD) dalam bidang terkait',
    salaryRange: { min: 7000000, max: 15000000 },
    jobGrowthRate: 5,
    popularityScore: 88,
    workEnvironment: 'Universitas',
    typicalTasks: [
      'Mengajar kelas sarjana dan pascasarjana',
      'Melakukan penelitian akademik',
      'Membimbing mahasiswa',
      'Menerbitkan jurnal dan buku',
      'Berpartisipasi dalam komite akademik'
    ],
    careerPath: [
      'Assistant Professor → Associate Professor → Professor → Distinguished Professor → Department Head',
      'Lecturer → Senior Lecturer → Principal Lecturer → Chair Professor'
    ]
  },
  {
    id: '27',
    title: 'Curriculum Developer',
    description: 'Merancang dan mengembangkan materi pelajaran serta rencana pembelajaran.',
    riasecTypes: 'I, S, C',
    industry: 'Pendidikan',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Curriculum Design', 'Instructional Design', 'Educational Standards', 'Assessment Development', 'Research', 'Content Creation'],
    educationRequirement: 'S2 Pendidikan atau bidang terkait',
    salaryRange: { min: 6000000, max: 11000000 },
    jobGrowthRate: 8,
    popularityScore: 80,
    workEnvironment: 'Kantor pendidikan, Lembaga',
    typicalTasks: [
      'Menganalisis kebutuhan pembelajaran',
      'Merancang kurikulum pendidikan',
      'Mengembangkan materi ajar',
      'Menyusun standar pembelajaran',
      'Menilai efektivitas kurikulum'
    ],
    careerPath: [
      'Curriculum Developer → Senior Curriculum Developer → Lead Designer → Academic Director → Chief Academic Officer',
      'Instructional Designer → Curriculum Specialist → Content Manager → Learning Director'
    ]
  },
  {
    id: '28',
    title: 'Education Administrator',
    description: 'Mengelola operasi sekolah dan kebijakan pendidikan.',
    riasecTypes: 'S, C, E',
    industry: 'Pendidikan',
    experienceLevel: 'Senior Level',
    requiredSkills: ['Educational Leadership', 'Policy Development', 'Budget Management', 'Staff Supervision', 'Strategic Planning', 'Stakeholder Relations'],
    educationRequirement: 'S2 Administrasi Pendidikan atau Manajemen Pendidikan',
    salaryRange: { min: 8000000, max: 16000000 },
    jobGrowthRate: 4,
    popularityScore: 83,
    workEnvironment: 'Kantor pendidikan',
    typicalTasks: [
      'Merancang kebijakan pendidikan',
      'Mengawasi operasi institusi',
      'Mengelola staf pendidik',
      'Mengelola anggaran pendidikan',
      'Berkoordinasi dengan pemerintah dan komunitas'
    ],
    careerPath: [
      'Education Administrator → Assistant Principal → Principal → Superintendent → Chief Education Officer',
      'Academic Coordinator → Academic Manager → Deputy Director → Education Director'
    ]
  },
  {
    id: '29',
    title: 'Corporate Trainer',
    description: 'Melatih karyawan dalam keterampilan dan kompetensi yang diperlukan.',
    riasecTypes: 'S, E, A',
    industry: 'Pendidikan',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Training Design', 'Presentation', 'Adult Learning', 'Assessment', 'Coaching', 'Program Development'],
    educationRequirement: 'S1 Psikologi, Manajemen, atau bidang terkait + pengalaman industri',
    salaryRange: { min: 6000000, max: 12000000 },
    jobGrowthRate: 10,
    popularityScore: 78,
    workEnvironment: 'Kantor, Pusat pelatihan',
    typicalTasks: [
      'Menyusun program pelatihan karyawan',
      'Menyampaikan sesi pelatihan',
      'Mengevaluasi efektivitas pelatihan',
      'Mengembangkan materi pelatihan',
      'Berkoordinasi dengan manajer dan staf'
    ],
    careerPath: [
      'Corporate Trainer → Senior Trainer → Training Manager → Learning & Development Director → Chief Learning Officer',
      'Trainer → Lead Trainer → Program Manager → VP of Learning & Development'
    ]
  },
  {
    id: '30',
    title: 'Mechanical Engineer',
    description: 'Merancang, menganalisis, dan memanufaktur perangkat mekanik untuk berbagai aplikasi.',
    riasecTypes: 'R, I, E',
    industry: 'Teknik',
    experienceLevel: 'Entry Level',
    requiredSkills: ['CAD Software', 'Thermodynamics', 'Mechanics', 'Materials Science', 'Manufacturing Processes', 'Problem Solving'],
    educationRequirement: 'S1 Teknik Mesin',
    salaryRange: { min: 7000000, max: 13000000 },
    jobGrowthRate: 2,
    popularityScore: 87,
    workEnvironment: 'Kantor teknik, Pabrik, Lapangan',
    typicalTasks: [
      'Merancang komponen dan sistem mekanik',
      'Melakukan analisis teknis dan simulasi',
      'Mengawasi proses manufaktur',
      'Melakukan pengujian produk',
      'Berkoordinasi dengan tim multidisiplin'
    ],
    careerPath: [
      'Mechanical Engineer → Senior Engineer → Lead Engineer → Engineering Manager → Chief Engineer',
      'Design Engineer → Project Engineer → Senior Engineer → Technical Director'
    ]
  },
  {
    id: '31',
    title: 'Civil Engineer',
    description: 'Merancang dan mengawasi konstruksi infrastruktur seperti jembatan, gedung, dan jalan.',
    riasecTypes: 'R, I, E',
    industry: 'Teknik',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Structural Analysis', 'Project Management', 'CAD Software', 'Surveying', 'Construction Management', 'Regulatory Compliance'],
    educationRequirement: 'S1 Teknik Sipil',
    salaryRange: { min: 6500000, max: 12500000 },
    jobGrowthRate: 5,
    popularityScore: 86,
    workEnvironment: 'Kantor, Lapangan konstruksi',
    typicalTasks: [
      'Merancang struktur dan infrastruktur',
      'Mengawasi proyek konstruksi',
      'Melakukan perhitungan struktural',
      'Memastikan kepatuhan terhadap kode bangunan',
      'Berkoordinasi dengan kontraktor dan staf'
    ],
    careerPath: [
      'Civil Engineer → Senior Engineer → Project Manager → Project Director → Chief Engineer',
      'Structural Engineer → Design Lead → Senior Designer → Vice President of Engineering'
    ]
  },
  {
    id: '32',
    title: 'Electrical Engineer',
    description: 'Merancang sistem dan perangkat listrik untuk berbagai aplikasi industri dan rumah tangga.',
    riasecTypes: 'R, I, E',
    industry: 'Teknik',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Circuit Analysis', 'Power Systems', 'Electronics', 'Control Systems', 'Safety Standards', 'Testing'],
    educationRequirement: 'S1 Teknik Elektro',
    salaryRange: { min: 7000000, max: 13000000 },
    jobGrowthRate: 4,
    popularityScore: 85,
    workEnvironment: 'Kantor teknik, Pusat listrik, Lapangan',
    typicalTasks: [
      'Merancang sistem dan perangkat listrik',
      'Melakukan analisis sirkuit dan daya',
      'Mengembangkan prototipe perangkat',
      'Melakukan pengujian keamanan',
      'Berkoordinasi dengan tim instalasi'
    ],
    careerPath: [
      'Electrical Engineer → Senior Engineer → Design Engineer → Engineering Manager → Chief Engineer',
      'Design Engineer → System Engineer → Lead Engineer → Electrical Director'
    ]
  },
  {
    id: '33',
    title: 'Chemical Engineer',
    description: 'Menerapkan prinsip kimia dan fisika untuk memproduksi bahan kimia dan produk industri.',
    riasecTypes: 'I, R, C',
    industry: 'Teknik',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Process Design', 'Chemical Thermodynamics', 'Reactor Design', 'Safety Protocols', 'Process Control', 'Plant Operations'],
    educationRequirement: 'S1 Teknik Kimia',
    salaryRange: { min: 7500000, max: 14000000 },
    jobGrowthRate: 6,
    popularityScore: 82,
    workEnvironment: 'Pabrik kimia, Laboratorium, Kantor teknik',
    typicalTasks: [
      'Merancang proses produksi kimia',
      'Mengoptimalkan efisiensi dan keamanan',
      'Menangani masalah produksi',
      'Mengembangkan produk baru',
      'Memastikan kepatuhan terhadap regulasi'
    ],
    careerPath: [
      'Chemical Engineer → Senior Engineer → Process Engineer → Engineering Manager → Chief Process Engineer',
      'Design Engineer → Lead Engineer → Technical Manager → VP of Engineering'
    ]
  },
  {
    id: '34',
    title: 'Environmental Engineer',
    description: 'Mengembangkan solusi untuk memperbaiki dan melindungi lingkungan.',
    riasecTypes: 'I, S, R',
    industry: 'Teknik',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Environmental Assessment', 'Water Treatment', 'Air Quality Control', 'Waste Management', 'Regulatory Compliance', 'Sustainability Planning'],
    educationRequirement: 'S1 Teknik Lingkungan atau Teknik Sipil',
    salaryRange: { min: 6500000, max: 12000000 },
    jobGrowthRate: 8,
    popularityScore: 84,
    workEnvironment: 'Kantor, Lapangan, Laboratorium',
    typicalTasks: [
      'Merancang sistem pengolahan limbah',
      'Melakukan penilaian dampak lingkungan',
      'Mengembangkan teknologi ramah lingkungan',
      'Memantau kualitas air dan udara',
      'Berkoordinasi dengan lembaga pengatur'
    ],
    careerPath: [
      'Environmental Engineer → Senior Engineer → Environmental Specialist → Program Manager → Environmental Director',
      'Project Engineer → Senior Specialist → Team Lead → Director of Sustainability'
    ]
  },
  {
    id: '35',
    title: 'Research Scientist',
    description: 'Melakukan eksperimen dan studi untuk memajukan pengetahuan dalam bidang ilmu pengetahuan.',
    riasecTypes: 'I, R, C',
    industry: 'Ilmu Pengetahuan',
    experienceLevel: 'Mid Level',
    requiredSkills: ['Experimental Design', 'Data Analysis', 'Scientific Writing', 'Laboratory Techniques', 'Statistical Analysis', 'Grant Writing'],
    educationRequirement: 'S2/S3 (PhD) di bidang ilmu terkait',
    salaryRange: { min: 7000000, max: 13000000 },
    jobGrowthRate: 5,
    popularityScore: 88,
    workEnvironment: 'Laboratorium, Universitas, Lembaga penelitian',
    typicalTasks: [
      'Merancang dan melaksanakan eksperimen',
      'Menganalisis data penelitian',
      'Menyusun publikasi ilmiah',
      'Mengajukan proposal penelitian',
      'Membimbing peneliti junior'
    ],
    careerPath: [
      'Research Scientist → Senior Scientist → Principal Investigator → Research Director → Chief Scientific Officer',
      'Postdoctoral Researcher → Research Associate → Senior Researcher → Program Leader'
    ]
  },
  {
    id: '36',
    title: 'Biotechnologist',
    description: 'Menggunakan proses biologis untuk mengembangkan produk dan teknologi inovatif.',
    riasecTypes: 'I, R, S',
    industry: 'Ilmu Pengetahuan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Molecular Biology', 'Genetic Engineering', 'Cell Culture', 'Lab Techniques', 'Data Analysis', 'Regulatory Knowledge'],
    educationRequirement: 'S1/S2 Bioteknologi atau Biologi',
    salaryRange: { min: 6000000, max: 11500000 },
    jobGrowthRate: 10,
    popularityScore: 85,
    workEnvironment: 'Laboratorium, Perusahaan bioteknologi, Farmasi',
    typicalTasks: [
      'Mengembangkan produk berbasis biologi',
      'Melakukan eksperimen genetik',
      'Menganalisis data biologis',
      'Mengembangkan protokol penelitian',
      'Bekerja sama dengan tim pengembangan'
    ],
    careerPath: [
      'Biotechnologist → Senior Biotechnologist → Research Lead → Product Development Manager → R&D Director',
      'Research Associate → Senior Scientist → Principal Scientist → VP of Biotechnology'
    ]
  },
  {
    id: '37',
    title: 'Microbiologist',
    description: 'Mempelajari mikroorganisme dan perannya dalam kesehatan, lingkungan, dan industri.',
    riasecTypes: 'I, R, S',
    industry: 'Ilmu Pengetahuan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Microscopy', 'Culturing Techniques', 'Biosafety', 'Laboratory Analysis', 'Data Interpretation', 'Sterile Technique'],
    educationRequirement: 'S1/S2 Mikrobiologi',
    salaryRange: { min: 5500000, max: 10500000 },
    jobGrowthRate: 7,
    popularityScore: 80,
    workEnvironment: 'Laboratorium, Rumah sakit, Industri farmasi',
    typicalTasks: [
      'Mengidentifikasi dan mengkarakterisasi mikroba',
      'Melakukan penelitian infeksi dan penyakit',
      'Menganalisis sampel biologis',
      'Mengembangkan vaksin dan antibiotik',
      'Memastikan keamanan produk'
    ],
    careerPath: [
      'Microbiologist → Senior Microbiologist → Team Lead → Laboratory Manager → Director of Microbiology',
      'Research Associate → Specialist → Senior Scientist → Principal Investigator'
    ]
  },
  {
    id: '38',
    title: 'Marine Biologist',
    description: 'Mempelajari organisme laut dan ekosistem perairan untuk konservasi dan penelitian.',
    riasecTypes: 'I, R, S',
    industry: 'Ilmu Pengetahuan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Field Research', 'Oceanography', 'Data Collection', 'Species Identification', 'Laboratory Analysis', 'Conservation Planning'],
    educationRequirement: 'S1/S2 Biologi Laut atau Biologi',
    salaryRange: { min: 5000000, max: 9500000 },
    jobGrowthRate: 5,
    popularityScore: 78,
    workEnvironment: 'Laboratorium, Lapangan laut, Konservasi',
    typicalTasks: [
      'Melakukan penelitian lapangan di laut',
      'Mengidentifikasi spesies laut',
      'Menganalisis ekosistem laut',
      'Mengembangkan program konservasi',
      'Menyusun laporan ilmiah'
    ],
    careerPath: [
      'Marine Biologist → Senior Marine Biologist → Research Specialist → Marine Program Manager → Chief Marine Scientist',
      'Research Assistant → Field Biologist → Senior Researcher → Marine Conservation Director'
    ]
  },
  {
    id: '39',
    title: 'Geologist',
    description: 'Mempelajari struktur bumi dan proses geologis untuk berbagai aplikasi industri dan lingkungan.',
    riasecTypes: 'R, I, S',
    industry: 'Ilmu Pengetahuan',
    experienceLevel: 'Entry Level',
    requiredSkills: ['Field Mapping', 'Rock Analysis', 'GIS Software', 'Data Interpretation', 'Environmental Assessment', 'Surveying'],
    educationRequirement: 'S1/S2 Geologi atau Ilmu Bumi',
    salaryRange: { min: 6500000, max: 12500000 },
    jobGrowthRate: 6,
    popularityScore: 75,
    workEnvironment: 'Lapangan geologi, Laboratorium, Kantor',
    typicalTasks: [
      'Melakukan survei geologi lapangan',
      'Menganalisis batuan dan struktur geologi',
      'Mengevaluasi sumber daya mineral',
      'Menilai risiko geologi',
      'Menyusun laporan eksplorasi'
    ],
    careerPath: [
      'Geologist → Senior Geologist → Project Geologist → Chief Geologist → Exploration Manager',
      'Field Geologist → Exploration Geologist → Senior Specialist → VP of Exploration'
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