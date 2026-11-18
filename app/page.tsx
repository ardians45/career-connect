'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButtons } from '@/components/auth-buttons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Download,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<'matrix' | 'majors' | 'careers'>('matrix');

  const handleStart = () => {
    if (session?.user && isPending === false) {
      router.push('/dashboard');
    } else {
      router.push('/test');
    }
  };

  const riasecDimensions = [
    {
      code: 'R',
      name: 'Realistic',
      label: 'Praktikal & Mekanikal',
      desc: 'Menyukai aktivitas fisik, pengoperasian alat kerja, perakitan perangkat, dan pemecahan masalah konkret.',
      smkMajor: 'Teknik Komputer Jaringan, Mesin, Otomotif, Listrik',
      careers: ['Network Engineer', 'Hardware Specialist', 'Teknisi Otomasi'],
      accent: 'border-amber-500/40 text-amber-500 bg-amber-500/10',
    },
    {
      code: 'I',
      name: 'Investigative',
      label: 'Analitis & Riset',
      desc: 'Tertarik pada penyelidikan logika, pemodelan data, pemecahan masalah kompleks, dan pemrograman sistem.',
      smkMajor: 'Rekayasa Perangkat Lunak, Sistem Informasi, Kimia Industri',
      careers: ['Software Engineer', 'Data Analyst', 'Cybersecurity Specialist'],
      accent: 'border-blue-500/40 text-blue-500 bg-blue-500/10',
    },
    {
      code: 'A',
      name: 'Artistic',
      label: 'Kreatif & Desain',
      desc: 'Menyukai ekspresi visual, konsep estetika, perancangan tata muka grafis, dan kreasi konten multimedia.',
      smkMajor: 'DKV, Multimedia, Animasi, Desain Komunikasi Visual',
      careers: ['UI/UX Designer', 'Motion Designer', 'Art Director'],
      accent: 'border-rose-500/40 text-rose-500 bg-rose-500/10',
    },
    {
      code: 'S',
      name: 'Social',
      label: 'Edukasi & Pendampingan',
      desc: 'Fokus pada interaksi antarpribadi, kolaborasi tim, pengajaran, komunikasi komunitas, dan pelayanan publik.',
      smkMajor: 'Layanan Kesehatan, Perhotelan, Tata Boga, Administrasi',
      careers: ['HR Coordinator', 'Konselor Karir', 'Community Specialist'],
      accent: 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10',
    },
    {
      code: 'E',
      name: 'Enterprising',
      label: 'Kepemimpinan & Bisnis',
      desc: 'Mengarahkan tim, merancang inisiatif pemasaran, negosiasi kemitraan, dan pengembangan produk usaha.',
      smkMajor: 'Bisnis Daring & Pemasaran, Manajemen Logistik, Perdagangan',
      careers: ['Product Manager', 'Digital Marketer', 'Business Developer'],
      accent: 'border-purple-500/40 text-purple-500 bg-purple-500/10',
    },
    {
      code: 'C',
      name: 'Conventional',
      label: 'Struktur & Pengorganisasian',
      desc: 'Unggul dalam keteraturan operasional, pencatatan berkas, kepatuhan alur kerja, dan verifikasi data.',
      smkMajor: 'Akuntansi & Keuangan Lembaga, Otomatisasi Perkantoran',
      careers: ['Database Administrator', 'Analis Keuangan', 'Compliance Staff'],
      accent: 'border-cyan-500/40 text-cyan-500 bg-cyan-500/10',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Isi Asesmen 10 Menit',
      desc: 'Jawab 30 pernyataan situasional yang mencerminkan ketertarikan alamiah Anda dalam bekerja dan belajar. Tanpa batasan benar atau salah.',
    },
    {
      number: '02',
      title: 'Pemrosesan Algoritma Holland',
      desc: 'Sistem membedah preferensi Anda ke dalam 3 kombinasi kode RIASEC dominan dengan persentase kecocokan minat terukur.',
    },
    {
      number: '03',
      title: 'Dapatkan Matriks Rekomendasi',
      desc: 'Akses daftar jurusan kuliah terakreditasi, proyeksi penghasilan industri, serta opsi konsultasi bersama guru BK sekolah.',
    },
  ];

  const faqs = [
    {
      q: 'Apakah asesmen CareerConnect dipungut biaya?',
      a: 'Layanan CareerConnect sepenuhnya gratis untuk seluruh siswa SMK di Indonesia. Anda dapat mengikuti tes, melihat hasil, dan mengeksplorasi database jurusan tanpa biaya langganan.',
    },
    {
      q: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan asesmen?',
      a: 'Rata-rata siswa membutuhkan waktu 8 hingga 12 menit. Pertanyaan disusun dalam format ringkas agar dapat diselesaikan secara nyaman tanpa tekanan waktu.',
    },
    {
      q: 'Apakah saya wajib membuat akun untuk mencoba asesmen?',
      a: 'Tidak wajib. Anda dapat langsung memilih opsi "Coba Mode Tamu" untuk melihat gambaran tes. Namun, disarankan mendaftar akun agar riwayat hasil dan bookmark jurusan tersimpan permanen.',
    },
    {
      q: 'Bagaimana CareerConnect memetakan jurusan SMK ke jenjang kuliah?',
      a: 'Sistem mengombinasikan model psikometri RIASEC dengan pemetaan kurikulum kejuruan nasional (SMK) ke rumpun program studi perguruan tinggi (D4/S1) untuk memastikan kesinambungan keahlian.',
    },
    {
      q: 'Apakah hasil asesmen bisa dibagikan ke Guru BK atau Orang Tua?',
      a: 'Ya. Laporan asesmen menyediakan ringkasan profil yang dapat diunduh dalam format PDF atau dibagikan melalui tautan resmi untuk bahan diskusi pemilihan jalur SNBP, SNBT, atau kerja.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* ---------------- Navigation ---------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
              <Image
                src="/logo-cc.png"
                alt="CareerConnect Logo"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">
              Career<span className="text-primary font-bold">Connect</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#riasec" className="hover:text-foreground transition-colors">
              Dimensi RIASEC
            </a>
            <a href="#fitur" className="hover:text-foreground transition-colors">
              Fitur Platform
            </a>
            <a href="#cara-kerja" className="hover:text-foreground transition-colors">
              Cara Kerja
            </a>
            <a href="#bukti" className="hover:text-foreground transition-colors">
              Bukti Hasil
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="hidden sm:block">
              <AuthButtons />
            </div>
            <Button
              size="sm"
              className="rounded-full px-4 text-xs sm:text-sm font-medium shadow-sm"
              onClick={handleStart}
            >
              {isPending === false && session?.user ? 'Ke Dashboard' : 'Mulai Tes'}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ---------------- Hero Section ---------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/40 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Headline Block */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Standar Psikometri RIASEC Indonesia untuk SMK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12] mb-6">
              Tentukan Jurusan Kuliah dan Arah Karir Berdasarkan Minat Nyata.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Asesmen psikometri berbasis 6 dimensi RIASEC yang memetakan keahlian siswa vokasi
              ke 48 program studi perguruan tinggi dan 120 profil karir industri.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 py-6 text-sm font-semibold shadow-sm"
                onClick={handleStart}
              >
                {isPending === false && session?.user ? 'Buka Dashboard Anda' : 'Mulai Asesmen RIASEC'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-7 py-6 text-sm font-medium border-border hover:bg-muted/60"
                onClick={() => router.push('/test?guest=true')}
              >
                Coba Mode Tamu (Tanpa Akun)
              </Button>
            </div>

            {/* Proof Metric Line */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                3.200+ Asesmen Siswa
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                48 Program Studi Kuliah
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                100% Bebas Biaya
              </span>
            </div>
          </div>

          {/* ---------------- The Product UI Window Frame ---------------- */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
            {/* Window Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-muted-foreground ml-2 hidden sm:inline">
                  careerconnect.id/assessment/result-preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px] font-mono py-0 h-5 bg-background">
                  Status: Terverifikasi RIASEC
                </Badge>
              </div>
            </div>

            {/* Tab Navigation Inside Window */}
            <div className="flex border-b border-border/60 bg-muted/20 px-4 pt-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'matrix'
                    ? 'border-primary text-foreground bg-card'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                1. Matriks Skor RIASEC
              </button>
              <button
                onClick={() => setActiveTab('majors')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'majors'
                    ? 'border-primary text-foreground bg-card'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                2. Rekomendasi Jurusan Kuliah
              </button>
              <button
                onClick={() => setActiveTab('careers')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'careers'
                    ? 'border-primary text-foreground bg-card'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                3. Prospek Karir & Gaji
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-7 min-h-[380px] bg-card">
              {activeTab === 'matrix' && (
                <div className="space-y-6">
                  {/* Candidate Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Profil Siswa Teruji</p>
                      <h4 className="font-semibold text-base text-foreground">
                        Rian Pratama · Kelas XII Rekayasa Perangkat Lunak
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Kode Dominan:</span>
                      <span className="px-2.5 py-1 rounded bg-primary/10 text-primary font-mono font-bold text-sm">
                        IRC
                      </span>
                    </div>
                  </div>

                  {/* Score Bars */}
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Investigative (Analitis & Riset)
                        </span>
                        <span className="font-mono font-semibold">88%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: '88%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Realistic (Praktikal & Teknis)
                        </span>
                        <span className="font-mono font-semibold">74%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '74%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-500" />
                          Conventional (Terstruktur & Detail)
                        </span>
                        <span className="font-mono font-semibold">64%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: '64%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5 text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          Enterprising (Bisnis & Kepemimpinan)
                        </span>
                        <span className="font-mono font-semibold">42%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-purple-500/70 rounded-full" style={{ width: '42%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Kesimpulan Psikometri: </span>
                    Siswa memiliki minat investigatif tinggi yang didukung orientasi kerja teknis nyata. Sangat direkomendasikan memilih program studi teknik komputasi, pengembangan perangkat lunak, atau arsitektur jaringan.
                  </div>
                </div>
              )}

              {activeTab === 'majors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs text-muted-foreground">Top 3 Program Studi Berdasarkan Skor IRC</p>
                    <span className="text-xs font-mono text-primary">Kesesuaian &gt; 85%</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-sm text-foreground">S1 Rekayasa Perangkat Lunak / Teknik Informatika</h5>
                            <Badge variant="secondary" className="text-[10px] py-0">Akreditasi Unggul</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Fokus pada rekayasa sistem, algoritma data, arsitektur backend, dan komputasi awan.
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs shrink-0">
                          96% Match
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                        <span>Jalur: SNBP / SNBT / Mandiri</span>
                        <span>Rekomendasi Vokasi SMK: RPL, TKJ</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-sm text-foreground">S1 Sistem Informasi</h5>
                            <Badge variant="secondary" className="text-[10px] py-0">Akreditasi A</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Menghubungkan proses bisnis modern dengan implementasi teknologi informasi dan manajemen basis data.
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs shrink-0">
                          91% Match
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                        <span>Jalur: SNBP / SNBT / Mandiri</span>
                        <span>Rekomendasi Vokasi SMK: RPL, Akuntansi</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-sm text-foreground">D4 Teknologi Rekayasa Perangkat Lunak (Vokasi)</h5>
                            <Badge variant="secondary" className="text-[10px] py-0">Terapan Industri</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pendidikan vokasi terapan 70% praktik industri untuk kesiapan kerja langsung di sektor teknologi.
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs shrink-0">
                          88% Match
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                        <span>Jalur: SNBP Vokasi / Seleksi Mandiri</span>
                        <span>Rekomendasi Vokasi SMK: RPL, SIJA</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'careers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs text-muted-foreground">Prospek Karir & Standar Kompensasi Indonesia (2026)</p>
                    <span className="text-xs text-muted-foreground">Sumber Data: Industri Teknologi Nasional</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col justify-between">
                      <div>
                        <Badge variant="outline" className="text-[10px] mb-2">Permintaan: Sangat Tinggi</Badge>
                        <h5 className="font-semibold text-sm text-foreground">Software Engineer</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Merancang, menguji, dan memelihara aplikasi dan sistem perangkat lunak skala tinggi.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[11px] text-muted-foreground">Rentang Gaji Industri:</p>
                        <p className="text-sm font-semibold font-mono text-primary">Rp 8.5M – Rp 22M / bln</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col justify-between">
                      <div>
                        <Badge variant="outline" className="text-[10px] mb-2">Permintaan: Tinggi</Badge>
                        <h5 className="font-semibold text-sm text-foreground">Data Analyst</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mengolah dan memvisualisasikan data kuantitatif untuk pengambilan keputusan bisnis.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[11px] text-muted-foreground">Rentang Gaji Industri:</p>
                        <p className="text-sm font-semibold font-mono text-primary">Rp 7.5M – Rp 18M / bln</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col justify-between">
                      <div>
                        <Badge variant="outline" className="text-[10px] mb-2">Permintaan: Meningkat</Badge>
                        <h5 className="font-semibold text-sm text-foreground">DevOps Engineer</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mengelola otomasi pipeline CI/CD, infrastruktur server cloud, dan stabilitas operasional.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[11px] text-muted-foreground">Rentang Gaji Industri:</p>
                        <p className="text-sm font-semibold font-mono text-primary">Rp 10M – Rp 26M / bln</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Window Footer Actions */}
            <div className="px-5 py-3 border-t border-border/60 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Laporan resmi dapat diekspor ke format dokumen PDF untuk konsultasi BK.</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 text-xs gap-1" onClick={handleStart}>
                  <Download className="w-3.5 h-3.5" />
                  Unduh Contoh PDF
                </Button>
                <Button size="sm" className="h-8 text-xs gap-1" onClick={handleStart}>
                  Mulai Asesmen Sendiri
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Section 2: RIASEC Dimensions ---------------- */}
      <section id="riasec" className="py-20 md:py-28 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Heading */}
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Kerangka Teori Psikometri
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Enam Dimensi Minat Karir Model John Holland.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Model RIASEC mengklasifikasikan kecenderungan kepribadian kerja menjadi 6 tipologi utama.
              Mengetahui kombinasi kode Anda memastikan pilihan jurusan dan profesi selaras dengan minat alami.
            </p>
          </div>

          {/* 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {riasecDimensions.map((item) => (
              <div
                key={item.code}
                className="group p-6 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-border/80 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`w-9 h-9 rounded-lg border font-mono font-bold text-sm flex items-center justify-center ${item.accent}`}
                    >
                      {item.code}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">Tipe {item.name}</span>
                  </div>

                  <h3 className="font-semibold text-base text-foreground mb-1.5">{item.name}</h3>
                  <p className="text-xs font-medium text-primary mb-3">{item.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">{item.desc}</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border/50 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Jurusan SMK Relevan:</span>
                    <span className="font-medium text-foreground">{item.smkMajor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Contoh Jalur Karir:</span>
                    <span className="font-medium text-foreground">{item.careers.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Section 3: Feature Bento Grid ---------------- */}
      <section id="fitur" className="py-20 md:py-28 border-b border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Keunggulan Platform
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Dirancang Spesifik untuk Menjawab Kebutuhan Siswa Vokasi.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Bukan sekadar kuis umum. CareerConnect mengaitkan kompetensi kejuruan SMK langsung ke
              kurikulum perguruan tinggi dan realitas pasar tenaga kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Card 1 (Span 8) */}
            <div className="md:col-span-8 p-6 sm:p-8 rounded-2xl border border-border bg-card flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Pemetaan Linier Jurusan SMK ke Program Studi Perguruan Tinggi
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  Banyak lulusan SMK ragu memilih jurusan kuliah yang tidak menyia-nyiakan bekal 3 tahun di sekolah kejuruan. Sistem kami memberikan rekomendasi program studi akademik (S1) maupun vokasi terapan (D4) yang memiliki kecocokan materi pembelajaran tertinggi.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-muted/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Asal SMK</span>
                  <span className="font-semibold text-foreground">Rekayasa Perangkat Lunak</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Rekomendasi S1</span>
                  <span className="font-semibold text-foreground">Informatika / Sains Data</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Peluang SNBP</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Tinggi (Linier)</span>
                </div>
              </div>
            </div>

            {/* Card 2 (Span 4) */}
            <div className="md:col-span-4 p-6 sm:p-8 rounded-2xl border border-border bg-card flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Basis Data Gaji & Permintaan Karir
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Setiap rekomendasi dilengkapi rincian kompensasi bulanan riil di industri nasional, pertumbuhan profesi, dan sertifikasi keahlian yang dicari recruiter.
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Database Karir</span>
                  <span className="font-semibold text-foreground">120+ Profesi</span>
                </div>
              </div>
            </div>

            {/* Card 3 (Span 4) */}
            <div className="md:col-span-4 p-6 sm:p-8 rounded-2xl border border-border bg-card flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Sinkronisasi dengan Guru Bimbingan Konseling
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Laporan asesmen dapat langsung ditautkan untuk konsultasi tatap muka bersama guru BK sekolah, mempermudah validasi berkas pendaftaran jalur prestasi.
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <Link
                  href="/counseling"
                  className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  Pelajari Fitur Konseling
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4 (Span 8) */}
            <div className="md:col-span-8 p-6 sm:p-8 rounded-2xl border border-border bg-card flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Laporan Hasil Asesmen Standar & Portofolio PDF
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  Dapatkan dokumen PDF terstruktur yang mencantumkan skor 6 dimensi RIASEC, deskripsi kepribadian kerja, serta rekomendasi 3 program studi dan 5 karir linier. Siap dicetak sebagai bukti minat bakat resmi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Format Standar Portofolio
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Unduh Kapan Saja
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Tersimpan di Akun
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Section 4: Cara Kerja ---------------- */}
      <section id="cara-kerja" className="py-20 md:py-28 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Alur Penggunaan
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Tiga Langkah Menemukan Arah Pendidikan dan Karir.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Sistem dirancang efisien dan praktis agar setiap siswa dapat menyelesaikan tes dalam satu sesi singkat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-6 sm:p-7 rounded-2xl border border-border bg-card/60 flex flex-col justify-between hover:bg-card hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <span className="text-3xl font-mono font-bold text-muted-foreground/40 block mb-6">
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-lg text-foreground mb-2.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40 flex items-center text-xs text-primary font-medium">
                  <span>Proses Terintegrasi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Section 5: Bukti Hasil & Metrik ---------------- */}
      <section id="bukti" className="py-20 md:py-28 border-b border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Dampak Teruji
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Membantu Ribuan Siswa Kejuruan Menentukan Langkah.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Data riil dari implementasi asesmen di berbagai sekolah menengah kejuruan di Indonesia.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card">
              <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-foreground block mb-1">
                3.200+
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground">Asesmen Siswa Selesai</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card">
              <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-foreground block mb-1">
                48
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground">Program Studi Terpetakan</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card">
              <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-foreground block mb-1">
                120+
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground">Profil Karir Industri</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card">
              <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-foreground block mb-1">
                94%
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground">Kesesuaian Minat Siswa</p>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card max-w-3xl">
            <blockquote className="text-sm sm:text-base leading-relaxed text-foreground mb-5 font-normal">
              &ldquo;Banyak teman sekelas bingung antara langsung kerja teknis atau lanjut kuliah S1. Lewat tes RIASEC CareerConnect, saya jadi yakin bahwa tipe IRC saya paling tepat untuk lanjut ke Teknik Informatika. Penjelasan linieritas jurusannya sangat membantu saat saya berdiskusi dengan orang tua dan guru BK.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                RP
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Rian Pratama</p>
                <p className="text-xs text-muted-foreground">Alumni SMKN 1 Cimahi · Mahasiswa S1 Teknik Informatika</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Section 6: FAQ ---------------- */}
      <section id="faq" className="py-20 md:py-28 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Pusat Informasi
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Pertanyaan yang Sering Diajukan.
            </h2>
            <p className="text-base text-muted-foreground">
              Semua hal yang perlu Anda ketahui mengenai asesmen dan platform CareerConnect.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="rounded-xl border border-border bg-card/60 px-5"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold py-4 hover:no-underline text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------------- Section 7: Closing CTA ---------------- */}
      <section className="py-20 md:py-28 border-b border-border/40 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 sm:p-12 rounded-3xl border border-border bg-card shadow-lg">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Siap Menentukan Jalur Masa Depanmu?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Ambil asesmen psikometri RIASEC sekarang dalam 10 menit. Temukan program studi kuliah dan peluang karir yang selaras dengan potensi dirimu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-sm font-semibold shadow-sm"
                onClick={handleStart}
              >
                {isPending === false && session?.user ? 'Buka Dashboard' : 'Mulai Asesmen Sekarang'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-sm font-medium border-border"
                onClick={() => router.push('/majors')}
              >
                Eksplorasi Database Jurusan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="py-12 md:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border/60">
            {/* Col 1: Brand */}
            <div className="md:col-span-1 space-y-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-7 h-7 shrink-0">
                  <Image
                    src="/logo-cc.png"
                    alt="CareerConnect"
                    fill
                    sizes="28px"
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-base tracking-tight text-foreground">
                  Career<span className="text-primary font-bold">Connect</span>
                </span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Platform asesmen minat karir berbasis RIASEC untuk membantu siswa SMK menentukan jurusan kuliah dan jalur karir masa depan.
              </p>
            </div>

            {/* Col 2: Fitur Utama */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Fitur Utama</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/test" className="hover:text-foreground transition-colors">
                    Tes Asesmen RIASEC
                  </Link>
                </li>
                <li>
                  <Link href="/majors" className="hover:text-foreground transition-colors">
                    Database Jurusan Kuliah
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Database Prospek Karir
                  </Link>
                </li>
                <li>
                  <Link href="/counseling" className="hover:text-foreground transition-colors">
                    Konsultasi Guru BK
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Akses Siswa */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Akses Siswa</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard Siswa
                  </Link>
                </li>
                <li>
                  <Link href="/test?guest=true" className="hover:text-foreground transition-colors">
                    Coba Mode Tamu
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="hover:text-foreground transition-colors">
                    Masuk Akun
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="hover:text-foreground transition-colors">
                    Daftar Akun Baru
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Bantuan & Kontak */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Bantuan & Dokumen</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Panduan Model RIASEC
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground transition-colors">
                    Pertanyaan Umum (FAQ)
                  </a>
                </li>
                <li>
                  <span className="text-muted-foreground">Kontak: support@careerconnect.example</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
            <p>© {new Date().getFullYear()} CareerConnect Indonesia. Seluruh hak cipta dilindungi.</p>
            <p>Dirancang untuk kemajuan pendidikan vokasi kejuruan dan karir generasi muda.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
