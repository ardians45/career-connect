'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Users, 
  BarChart3, 
  Lightbulb, 
  Shield, 
  Info,
  GraduationCap,
  Briefcase,
  Target
} from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pusat Bantuan</h1>
        <p className="text-muted-foreground">Temukan jawaban atas pertanyaan umum tentang CareerConnect</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Tentang CareerConnect</CardTitle>
                <CardDescription>
                  Platform untuk membantu Anda menemukan minat bakat dan rekomendasi karir
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              CareerConnect adalah platform berbasis RIASEC (Realistic, Investigative, Artistic, 
              Social, Enterprising, Conventional) untuk membantu individu mengidentifikasi minat 
              dan bakat mereka serta mendapatkan rekomendasi karir yang sesuai dengan kepribadian.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Fitur Utama</CardTitle>
                <CardDescription>Kenali fitur-fitur utama CareerConnect</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-primary/70 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Tes Minat Bakat</h4>
                <p className="text-xs text-muted-foreground">Temukan tipe kepribadian RIASEC Anda</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 mt-0.5 text-primary/70 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Rekomendasi Jurusan</h4>
                <p className="text-xs text-muted-foreground">Dapatkan rekomendasi jurusan yang sesuai</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 mt-0.5 text-primary/70 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Rekomendasi Karir</h4>
                <p className="text-xs text-muted-foreground">Lihat peluang karir yang cocok untuk Anda</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Pertanyaan Umum (FAQ)</CardTitle>
              <CardDescription>
                Jawaban atas pertanyaan yang sering diajukan tentang aplikasi ini
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Apa itu tes RIASEC?</AccordionTrigger>
              <AccordionContent>
                Tes RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) 
                adalah alat penilaian psikologi yang digunakan untuk mengevaluasi minat karier seseorang. 
                Tes ini membantu individu memahami kepribadian dan minat kerja mereka yang dapat 
                digunakan dalam perencanaan karier dan keputusan pendidikan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Bagaimana cara mengikuti tes minat bakat?</AccordionTrigger>
              <AccordionContent>
                Untuk mengikuti tes minat bakat, cukup klik menu &quot;Dasbor&quot; dan pilih opsi &quot;Ikuti Tes&quot;. 
                Anda akan diminta untuk menjawab sejumlah pertanyaan tentang minat dan preferensi Anda. 
                Setelah selesai, sistem akan memberikan hasil serta rekomendasi jurusan dan karir yang 
                sesuai.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Apakah hasil tes disimpan?</AccordionTrigger>
              <AccordionContent>
                Ya, hasil tes Anda akan disimpan secara aman di sistem kami. Anda dapat mengakses 
                riwayat tes Anda kapan saja melalui menu &quot;Riwayat Tes&quot;. Setiap hasil tes akan 
                menyimpan tanggal dan skor yang Anda dapatkan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Bagaimana interpretasi hasil tes?</AccordionTrigger>
              <AccordionContent>
                Hasil tes menunjukkan tipe RIASEC dominan Anda berdasarkan skor tertinggi. Masing-masing 
                tipe memiliki karakteristik dan bidang yang cocok. Misalnya, tipe Artistic cocok untuk 
                pekerjaan kreatif, sedangkan tipe Investigative cocok untuk pekerjaan penelitian dan 
                analisis. Sistem kami juga memberikan rekomendasi jurusan dan karir yang sesuai.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Apakah ada biaya untuk menggunakan CareerConnect?</AccordionTrigger>
              <AccordionContent>
                CareerConnect sepenuhnya gratis untuk digunakan. Anda dapat mengikuti tes minat bakat, 
                melihat rekomendasi, dan mengakses semua fitur tanpa biaya sepeserpun.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>Bagaimana cara menghubungi tim bantuan?</AccordionTrigger>
              <AccordionContent>
                Jika Anda memiliki pertanyaan tambahan, Anda bisa menghubungi tim kami melalui 
                formulir kontak di situs kami atau melalui email resmi kami. Kami siap membantu 
                Anda dalam waktu 24 jam pada hari kerja.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Keamanan & Privasi</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Kami menjaga privasi dan data pengguna dengan serius. Data tes dan informasi pribadi 
            Anda tidak akan dibagikan kepada pihak ketiga. Semua data disimpan secara aman dan hanya 
            digunakan untuk memberikan rekomendasi yang lebih akurat kepada Anda.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}