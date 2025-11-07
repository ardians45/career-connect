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
  HelpCircle,
  Lightbulb,
  Target,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButtons } from '@/components/auth-buttons';
import { useSession } from '@/lib/auth-client';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Mouse-reactive 3D tilt card component
  const TiltCard = ({ children, className = "", ...props }) => {
    const ref = useRef(null);
    const isHovered = useMotionValue(0); // Use 0 for not hovered, 1 for hovered
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);
    const scale = useTransform(isHovered, [0, 1], [1, 1.03]);

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(e.clientX - centerX);
      y.set(e.clientY - centerY);
    };

    const handleMouseEnter = () => isHovered.set(1);
    const handleMouseLeave = () => {
      isHovered.set(0);
      x.set(0);
      y.set(0);
    };

    const style = {
      perspective: "1000px",
      rotateX,
      rotateY,
      scale,
      transformStyle: "preserve-3d",
    };

    return (
      <motion.div
        ref={ref}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  };

  // Deep parallax component for hero section
  const DeepParallax = ({ children, speed = 0.5 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

    return (
      <motion.div ref={ref} style={{ y }} className="relative">
        {children}
      </motion.div>
    );
  };

  // Scroll-linked animation component for sections
  const ScrollReveal = ({ children }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      // SOLUSI: Menggunakan offset yang lebih intuitif
      offset: ["start 0.9", "start 0.5"]
    });

    // Transformasi ini sekarang akan berjalan ke arah yang benar
    // (0 -> 1) seiring scroll ke bawah
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);

    return (
      <motion.div
        ref={ref}
        style={{
          opacity,
          y,
          rotateX
        }}
        className="origin-center relative"
      >
        {children}
      </motion.div>
    );
  };

  const handleGetStarted = () => {
    if (session?.user && !isPending) {
      router.push('/dashboard');
    } else if (!isPending) {
      router.push('/sign-in');
    }
  };



  const riasecTypes = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />,
      title: "Realistic",
      acronym: "R",
      description: "Memiliki minat pada aktivitas yang bersifat fisik dan praktis"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Investigative",
      acronym: "I",
      description: "Memiliki minat pada aktivitas yang bersifat analitis dan investigatif"
    },
    {
      icon: <Target className="w-8 h-8 text-pink-500 dark:text-pink-400" />,
      title: "Artistic",
      acronym: "A",
      description: "Memiliki minat pada aktivitas kreatif dan ekspresif"
    },
    {
      icon: <Users className="w-8 h-8 text-green-500 dark:text-green-400" />,
      title: "Social",
      acronym: "S",
      description: "Memiliki minat pada aktivitas yang melibatat orang lain"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      title: "Enterprising",
      acronym: "E",
      description: "Memiliki minat pada aktivitas yang bersifat kepemimpinan dan persuasif"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,
      title: "Conventional",
      acronym: "C",
      description: "Memiliki minat pada aktivitas yang bersifat terstruktur dan sistematis"
    }
  ];

  const advantages = [
    {
      icon: <BarChart3 className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />,
      title: "Asesmen Minat & Bakat",
      description: "Tes RIASEC yang dirancang untuk mengidentifikasi tipe minat dan bakat karir Anda"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
      title: "Rekomendasi Jurusan",
      description: "Sistem rekomendasi cerdas untuk membantu memilih jurusan kuliah yang sesuai"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
      title: "Rekomendasi Karir",
      description: "Daftar karir yang sesuai dengan tipe RIASEC Anda"
    },
    {
      icon: <Star className="w-8 h-8 text-rose-500 dark:text-rose-400" />,
      title: "Bookmark Favorit",
      description: "Simpan jurusan dan karir favorit untuk referensi cepat"
    },
    {
      icon: <Target className="w-8 h-8 text-violet-500 dark:text-violet-400" />,
      title: "Dashboard Progres",
      description: "Lacak perkembangan dan hasil asesmen Anda secara real-time"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />,
      title: "Gratis & Mudah",
      description: "Akses semua fitur secara gratis dengan antarmuka yang user-friendly"
    }
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  const backgroundX = useTransform(mouseX, [0, 100], [-20, 20]);
  const backgroundY = useTransform(mouseY, [0, 100], [-20, 20]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 dark:from-gray-950 dark:via-purple-950 dark:to-violet-950 overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 20, 0, -20],
            y: [0, -20, 0, 20],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [-20, 0, 20, 0],
            y: [20, 0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        <motion.div 
          className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          animate={{
            x: [10, -10, -10, 10],
            y: [-10, -10, 10, 10],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4,
          }}
        />
      </motion.div>

      {/* Header */}
      <div className="w-full px-4 py-3 md:py-4 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="absolute inset-x-0 top-0 h-full bg-gray-800/30 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl -z-10"></div>
          <div className="flex justify-between items-center">
            {/* Logo container with text */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative w-[120px] sm:w-[40px] h-[40px] sm:h-[50px]">
                <Image
                  src="/logo-cc.png"
                  alt="CareerConnect"
                  fill
                  sizes="(max-width: 640px) 40px, 120px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:block text-xl md:text-2xl font-bold">
                <span className="text-purple-400 dark:text-purple-300 underline">Career</span>
                <span className="text-cyan-400 dark:text-cyan-300 underline">Connect</span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <AuthButtons />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Deep Parallax Effect */}
      <div className="relative py-16 sm:py-24 px-4 overflow-hidden min-h-screen">
        {/* Background layer - slowest */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-10 dark:opacity-20"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Middle layer - text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 dark:bg-purple-900/50 backdrop-blur-sm rounded-full border border-purple-500/30 dark:border-purple-400/30 mb-6">
              <HelpCircle className="w-4 h-4 text-cyan-400 dark:text-cyan-300" />
              <span className="text-sm text-cyan-300 dark:text-cyan-200 font-medium">Apa itu RIASEC?</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Temukan <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Minat & Bakat</span> Karirmu
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Platform asesmen karir berbasis RIASEC untuk membantu siswa SMK menentukan jurusan kuliah dan jalur karir yang sesuai dengan minat dan bakat mereka.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg shadow-cyan-500/20"
              onClick={handleGetStarted}
            >
              {!isPending && session?.user ? 'Ke Dashboard' : 'Ikuti Tes Sekarang'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-full border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 hover:text-white"
              onClick={() => router.push('/test?guest=true')}
            >
              Coba Tanpa Login
            </Button>
          </motion.div>
        </div>
      </div>

      {/* RIASEC Explanation Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Apa itu <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">RIASEC?</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
                RIASEC adalah model psikologis yang mengklasifikasikan minat karir berdasarkan 6 tipe utama. 
                Mengetahui tipe RIASEC Anda membantu dalam memilih jurusan kuliah dan karir yang paling sesuai dengan kepribadian dan minat Anda.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riasecTypes.map((type, index) => (
              <TiltCard key={index} className="h-full flex">
                <ScrollReveal>
                  <Card className="p-6 bg-gray-800/50 dark:bg-gray-800/70 backdrop-blur-sm border-gray-700 dark:border-gray-600 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 h-full flex flex-col transform-gpu">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-700/50 dark:bg-gray-700/70 p-3 rounded-lg flex-shrink-0">
                        {type.icon}
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-white dark:text-gray-100">{type.title}</h3>
                          <span className="text-sm text-cyan-400 dark:text-cyan-300 font-bold">{type.acronym}</span>
                        </div>
                        <p className="text-gray-300 dark:text-gray-400 mt-2">{type.description}</p>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      {/* Features/Advantages Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Keunggulan & <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Fitur</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Platform kami dirancang khusus untuk membantu siswa SMK dalam mengambil keputusan penting tentang masa depan karir mereka
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {advantages.map((feature, index) => (
              <TiltCard key={index} className="h-full flex">
                <ScrollReveal>
                  <Card className="p-6 bg-gray-800/30 dark:bg-gray-800/50 backdrop-blur-sm border-gray-700 dark:border-gray-600 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all duration-300 h-full flex flex-col transform-gpu">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-700/50 dark:bg-gray-700/70 p-2 rounded-lg group-hover:bg-cyan-500/10 dark:group-hover:bg-cyan-500/20 group-hover:text-cyan-400 dark:group-hover:text-cyan-300 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white dark:text-gray-100 mb-2">{feature.title}</h3>
                        <p className="text-gray-300 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              </TiltCard>
            ))}
          </div>

          {/* How It Works */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Cara Kerja</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Ikuti langkah-langkah sederhana untuk menemukan jalur karir yang sesuai
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <TiltCard className="h-full">
              <ScrollReveal>
                <div className="text-center p-6 rounded-2xl bg-gray-800/30 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-700 dark:border-gray-600 transform-gpu">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 dark:from-cyan-400/30 dark:to-purple-400/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 dark:border-cyan-400/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 flex items-center justify-center">
                      <span className="text-white dark:text-gray-100 font-bold">1</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white dark:text-gray-100">Ikuti Tes RIASEC</h3>
                  <p className="text-gray-300 dark:text-gray-400">
                    Jawab serangkaian pertanyaan untuk mengidentifikasi minat dan bakat Anda
                  </p>
                </div>
              </ScrollReveal>
            </TiltCard>
            
            <TiltCard className="h-full">
              <ScrollReveal>
                <div className="text-center p-6 rounded-2xl bg-gray-800/30 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-700 dark:border-gray-600 transform-gpu">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 dark:from-cyan-400/30 dark:to-purple-400/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 dark:border-cyan-400/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 flex items-center justify-center">
                      <span className="text-white dark:text-gray-100 font-bold">2</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white dark:text-gray-100">Dapatkan Hasil</h3>
                  <p className="text-gray-300 dark:text-gray-400">
                    Lihat tipe kepribadian karir RIASEC Anda secara detail
                  </p>
                </div>
              </ScrollReveal>
            </TiltCard>
            
            <TiltCard className="h-full">
              <ScrollReveal>
                <div className="text-center p-6 rounded-2xl bg-gray-800/30 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-700 dark:border-gray-600 transform-gpu">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 dark:from-cyan-400/30 dark:to-purple-400/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30 dark:border-cyan-400/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 flex items-center justify-center">
                      <span className="text-white dark:text-gray-100 font-bold">3</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white dark:text-gray-100">Eksplorasi Rekomendasi</h3>
                  <p className="text-gray-300 dark:text-gray-400">
                    Temukan jurusan kuliah dan karir yang sesuai dengan tipe Anda
                  </p>
                </div>
              </ScrollReveal>
            </TiltCard>
          </div>

          {/* CTA Section */}
          <TiltCard className="h-full">
            <ScrollReveal>
              <div className="bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 dark:from-cyan-500/30 dark:via-purple-500/30 dark:to-pink-500/30 rounded-3xl p-8 md:p-12 text-center border border-cyan-500/30 dark:border-cyan-400/30 backdrop-blur-sm transform-gpu">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white dark:text-gray-100">Siap Temukan Jalur Karirmu?</h2>
                <p className="text-cyan-200 dark:text-cyan-300 max-w-2xl mx-auto mb-6">
                  Bergabunglah dengan ribuan siswa lainnya yang sudah menemukan arah karir mereka
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg shadow-cyan-500/20"
                  onClick={handleGetStarted}
                >
                  {!isPending && session?.user ? 'Ke Dashboard' : 'Mulai Sekarang'}
                </Button>
              </div>
            </ScrollReveal>
          </TiltCard>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 dark:border-gray-700 py-8 mt-12 relative z-10">
        <div className="container mx-auto px-4 text-center text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} CareerConnect - Platform Asesmen Karir untuk Siswa SMK</p>
        </div>
      </footer>
    </div>
  );
}