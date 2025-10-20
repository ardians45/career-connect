'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  BarChart3, 
  Users, 
  BookOpen, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButtons } from '@/components/auth-buttons';
import { useSession } from '@/lib/auth-client';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleGetStarted = () => {
    if (status === 'authenticated' && session?.user) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in');
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Tes Minat Bakat RIASEC",
      description: "Temukan tipe kepribadian karir Anda dengan metode Holland (RIASEC)"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Rekomendasi Jurusan",
      description: "Dapatkan rekomendasi jurusan kuliah yang sesuai dengan minat Anda"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Rekomendasi Karir",
      description: "Jelajahi karir yang cocok berdasarkan hasil tes Anda"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Konseling BK",
      description: "Jadwalkan sesi konseling karir dengan guru bimbingan konseling"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
  <div className="container mx-auto px-4 py-4 md:py-6">
  <div className="flex justify-between items-center">
    {/* Logo container with text */}
    <div className="flex items-center gap-2 md:gap-3">
      <div className="relative w-[120px] sm:w-[40px] h-[40px] sm:h-[50px]">
        <Image
          src="/logo-cc.png"
          alt="CareerConnect"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="hidden sm:block text-xl md:text-2xl font-bold">
        <span className="text-purple-600 underline">Career</span>
        <span className="text-blue-600 underline">Connect</span>
      </span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2 sm:gap-3">
      <AuthButtons />
      <ThemeToggle />
    </div>
  </div>
</div>



      {/* Hero Section */}
      <div className="text-center py-12 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Temukan <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Minat & Bakat</span> Karirmu
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Platform asesmen karir berbasis RIASEC untuk membantu siswa SMK menentukan jurusan kuliah dan jalur karir yang sesuai dengan minat dan bakat mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full"
              onClick={handleGetStarted}
            >
              {status === 'authenticated' && session?.user ? 'Ke Dashboard' : 'Ikuti Tes Sekarang'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-full"
              onClick={() => router.push('/test?guest=true')}
            >
              Coba Tanpa Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Kenapa CareerConnect?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Platform kami dirancang khusus untuk membantu siswa SMK dalam mengambil keputusan penting tentang masa depan karir mereka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cara Kerja</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ikuti langkah-langkah sederhana untuk menemukan jalur karir yang sesuai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ikuti Tes RIASEC</h3>
            <p className="text-muted-foreground">
              Jawab serangkaian pertanyaan untuk mengidentifikasi minat dan bakat Anda
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dapatkan Hasil</h3>
            <p className="text-muted-foreground">
              Lihat tipe kepribadian karir RIASEC Anda secara detail
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Eksplorasi Rekomendasi</h3>
            <p className="text-muted-foreground">
              Temukan jurusan kuliah dan karir yang sesuai dengan tipe Anda
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Siap Temukan Jalur Karirmu?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Bergabunglah dengan ribuan siswa lainnya yang sudah menemukan arah karir mereka
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6 rounded-full"
            onClick={handleGetStarted}
          >
            {status === 'authenticated' && session?.user ? 'Ke Dashboard' : 'Mulai Sekarang'}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CareerConnect - Platform Asesmen Karir untuk Siswa SMK</p>
        </div>
      </footer>
    </div>
  );
}