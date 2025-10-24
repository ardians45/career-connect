'use client';

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Font,
  Link
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Register font (using default font for now)
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-bold.ttf', fontWeight: 700 },
  ]
});

// Types based on the existing TestResult interface
interface TestResult {
  id?: string;
  userId?: string;
  dominantType: string;
  secondaryType?: string;
  tertiaryType?: string;
  realisticScore?: number;
  investigativeScore?: number;
  artisticScore?: number;
  socialScore?: number;
  enterprisingScore?: number;
  conventionalScore?: number;
  scores?: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  testDuration?: number;
  totalQuestions?: number;
  rawAnswers?: Record<string, unknown> | null;
  completedAt: string;
}

interface TestResultReportProps {
  result: TestResult;
  userName?: string;
  studentName?: string;
}

// RIASEC descriptions
const riasecDescriptions: Record<string, { name: string, description: string, careers: string[], majors: string[], strengths: string[], developmentAreas: string[] }> = {
  'R': {
    name: 'Realistic (M)', 
    description: 'Orang dengan tipe Realistic menyukai kegiatan yang bersifat fisik, memanipulasi benda, mesin, alat dan hewan. Mereka cenderung praktis, stabil, dan mandiri.',
    careers: ['Teknik Mesin', 'Otomotif', 'Pertanian', 'Konstruksi', 'Perbengkelan', 'Elektronik', 'Listrik'],
    majors: ['Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Teknik Industri', 'Pertanian', 'Kedokteran Hewan'],
    strengths: ['Keterampilan teknis', 'Ketekunan', 'Kerja keras', 'Ketrampilan praktis', 'Berorientasi hasil'],
    developmentAreas: ['Kemampuan sosial', 'Komunikasi interpersonal', 'Keterampilan manajerial', 'Pekerjaan yang berurusan langsung dengan manusia']
  },
  'I': {
    name: 'Investigative (I)', 
    description: 'Orang dengan tipe Investigative suka dengan kegiatan yang bersifat penelitian, eksplorasi, dan analisis. Mereka cenderung intelektual, logis, dan kritis.',
    careers: ['Peneliti', 'Dokter', 'Ilmuwan', 'Analis Data', 'Farmasi', 'Matematikawan', 'Psikolog'],
    majors: ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Kedokteran', 'Psikologi', 'Teknik Informatika'],
    strengths: ['Pemecahan masalah kompleks', 'Analisis kritis', 'Penelitian', 'Kemampuan abstrak', 'Keterampilan analitis'],
    developmentAreas: ['Keterampilan interpersonal', 'Kemampuan memperagakan', 'Administrasi', 'Keterampilan komunikasi']
  },
  'A': {
    name: 'Artistic (A)', 
    description: 'Orang dengan tipe Artistic menyukai kegiatan yang bersifat kreatif, imajinatif, dan ekspresif. Mereka cenderung inovatif, emosional, dan tidak konvensional.',
    careers: ['Desainer Grafis', 'Seniman', 'Fotografer', 'Arsitek', 'Penulis', 'Musisi', 'Aktris'],
    majors: ['Desain Komunikasi Visual', 'Desain Produk', 'Seni Rupa', 'Sastra', 'Fotografi', 'Musik', 'Filsafat'],
    strengths: ['Kreativitas', 'Intuisi', 'Ekspresi artistik', 'Kemampuan estetika', 'Imajinasi'],
    developmentAreas: ['Keterampilan administrasi', 'Kegiatan konvensional', 'Keputusan praktis', 'Kegiatan terstruktur']
  },
  'S': {
    name: 'Social (S)', 
    description: 'Orang dengan tipe Social menyukai kegiatan yang bersifat membantu, melatih, dan memberi informasi kepada orang lain. Mereka cenderung sosial, kooperatif, dan mudah beradaptasi.',
    careers: ['Guru', 'Psikolog', 'Perawat', 'Pekerja Sosial', 'Konselor', 'Dokter', 'Pustakawan'],
    majors: ['Pendidikan', 'Psikologi', 'Ilmu Sosial', 'Ilmu Kesejahteraan Sosial', 'Kedokteran', 'Farmasi', 'Ilmu Perpustakaan'],
    strengths: ['Kemampuan berkomunikasi', 'Empati', 'Mempengaruhi dan memberi pertolongan', 'Mengembangkan kemampuan orang lain', 'Kemampuan pelatihan'],
    developmentAreas: ['Keterampilan teknis', 'Kegiatan berbasis mesin', 'Kegiatan administratif', 'Kegiatan yang sangat teknis']
  },
  'E': {
    name: 'Enterprising (E)', 
    description: 'Orang dengan tipe Enterprising menyukai kegiatan yang bersifat kepemimpinan, pengaruh, dan kemampuan untuk mempengaruhi orang lain. Mereka cenderung ambisius, percaya diri, dan dominan.',
    careers: ['Wirausaha', 'Marketing', 'Manajer', 'Politisi', 'Penjual', 'Konsultan Bisnis', 'Hukum'],
    majors: ['Manajemen', 'Akuntansi', 'Marketing', 'Hukum', 'Ilmu Politik', 'Komunikasi', 'Kewirausahaan'],
    strengths: ['Kemampuan kepemimpinan', 'Keterampilan berbicara di depan umum', 'Inisiatif', 'Kemampuan negosiasi', 'Percaya diri'],
    developmentAreas: ['Kegiatan teknis', 'Kegiatan yang sangat terstruktur', 'Kegiatan penelitian', 'Kegiatan yang bersifat terpisah']
  },
  'C': {
    name: 'Conventional (C)', 
    description: 'Orang dengan tipe Conventional menyukai kegiatan yang bersifat data, angka, dan informasi terstruktur. Mereka cenderung teliti, stabil, dan taat aturan.',
    careers: ['Akuntan', 'Administrasi', 'Bankir', 'Sekretaris', 'Pengacara', 'Petugas Administrasi', 'Analisis Data'],
    majors: ['Akuntansi', 'Manajemen', 'Administrasi Niaga', 'Ilmu Perpustakaan', 'Statistika', 'Ilmu Komputer', 'Ekonomi'],
    strengths: ['Ketelitian dan akurasi', 'Kemampuan administratif', 'Kemampuan aritmatika', 'Kemampuan klerikal', 'Kemampuan memproses data'],
    developmentAreas: ['Kegiatan yang sangat bebas', 'Kegiatan yang tidak terstruktur', 'Kegiatan yang memerlukan inovasi', 'Kegiatan yang memerlukan ekspresi diri']
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Open Sans',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#6b7280',
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Open Sans',
    fontWeight: 700,
    color: '#1f2937',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
  },
  subsectionTitle: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 700,
    color: '#1f2937',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    color: '#374151',
    lineHeight: 1.4,
  },
  boldText: {
    fontFamily: 'Open Sans',
    fontWeight: 700,
  },
  typeBadge: {
    fontSize: 10,
    padding: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  list: {
    marginTop: 5,
    marginBottom: 5,
  },
  listItem: {
    flexDirection: 'row',
    fontSize: 11,
    fontFamily: 'Open Sans',
    color: '#374151',
    marginLeft: 10,
    lineHeight: 1.4,
  },
  listItemBullet: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    color: '#374151',
    marginRight: 5,
  },
  profileSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 5,
  },
  scoreLabel: {
    width: 100,
    fontSize: 10,
    fontFamily: 'Open Sans',
    color: '#374151',
  },
  scoreValue: {
    width: 40,
    textAlign: 'right',
    fontSize: 10,
    fontFamily: 'Open Sans',
    fontWeight: 700,
    color: '#374151',
  },
  progressBar: {
    height: 10,
    flexGrow: 1,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

// Calculate total score for percentage calculations
const getTotalScore = (result: TestResult) => {
  return result.scores 
    ? Object.values(result.scores).reduce((sum, score) => sum + (score as number), 0)
    : (result.realisticScore || 0) + 
      (result.investigativeScore || 0) + 
      (result.artisticScore || 0) + 
      (result.socialScore || 0) + 
      (result.enterprisingScore || 0) + 
      (result.conventionalScore || 0);
};

const getScoreValue = (result: TestResult, category: string) => {
  if (result.scores) {
    return result.scores[category as keyof typeof result.scores];
  }
  
  const scoreKey = `${category.toLowerCase()}Score` as keyof TestResult;
  return result[scoreKey] as number || 0;
};

const TestResultReport: React.FC<TestResultReportProps> = ({ result, userName, studentName }) => {
  const dominantTypeInfo = riasecDescriptions[result.dominantType];
  const totalScore = getTotalScore(result);
  const maxScore = result.scores 
    ? Math.max(...Object.values(result.scores as Record<string, number>))
    : Math.max(
        result.realisticScore || 0,
        result.investigativeScore || 0,
        result.artisticScore || 0,
        result.socialScore || 0,
        result.enterprisingScore || 0,
        result.conventionalScore || 0
      );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Laporan Profil Karir</Text>
            <Text style={styles.subtitle}>Berdasarkan Metode RIASEC (Holland Code)</Text>
          </View>
          <Image 
            style={styles.logo} 
            src="/images/logo.png" // You'll need to adjust this path to the actual logo
            onError={(e) => {
              // Handle image error, could be an empty image or default fallback
            }}
          />
        </View>

        {/* Personal Information */}
        <View>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          <View style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Nama:</Text> {studentName || userName || 'Siswa/Umum'}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Tanggal Tes:</Text> {format(new Date(result.completedAt), 'dd MMMM yyyy', { locale: id })}
            </Text>
            {result.testDuration && (
              <Text style={styles.text}>
                <Text style={styles.boldText}>Waktu Pengerjaan:</Text> {Math.floor((result.testDuration || 0) / 60)} menit {(result.testDuration || 0) % 60} detik
              </Text>
            )}
          </View>
        </View>

        {/* Holland Code Results */}
        <View>
          <Text style={styles.sectionTitle}>Kode Holland (RIASEC)</Text>
          <View style={styles.section}>
            <View style={styles.list}>
              <Text style={styles.text}>
                <Text style={styles.boldText}>Tipe Utama: </Text>
                {dominantTypeInfo?.name || result.dominantType}
              </Text>
              {result.secondaryType && (
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Tipe Kedua: </Text>
                  {riasecDescriptions[result.secondaryType]?.name || result.secondaryType}
                </Text>
              )}
              {result.tertiaryType && (
                <Text style={styles.text}>
                  <Text style={styles.boldText}>Tipe Ketiga: </Text>
                  {riasecDescriptions[result.tertiaryType]?.name || result.tertiaryType}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Personality Description */}
        <View>
          <Text style={styles.sectionTitle}>Deskripsi Kepribadian</Text>
          <View style={[styles.section, styles.profileSection]}>
            <Text style={styles.text}>
              Berdasarkan hasil tes, Anda adalah tipe <Text style={styles.boldText}>{dominantTypeInfo?.name.split(' ')[0]}</Text> yang artinya:
            </Text>
            <Text style={styles.text}>{dominantTypeInfo?.description}</Text>
          </View>
        </View>

        {/* Strengths and Development Areas */}
        <View>
          <Text style={styles.sectionTitle}>Kekuatan & Area Pengembangan</Text>
          
          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>Kekuatan Anda:</Text>
            <View style={styles.list}>
              {dominantTypeInfo?.strengths.map((strength, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemBullet}>•</Text>
                  <Text>{strength}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.subsectionTitle}>Area Pengembangan:</Text>
            <View style={styles.list}>
              {dominantTypeInfo?.developmentAreas.map((area, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemBullet}>•</Text>
                  <Text>{area}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Major Recommendations */}
        <View>
          <Text style={styles.sectionTitle}>Rekomendasi Jurusan</Text>
          <View style={styles.section}>
            <View style={styles.list}>
              {dominantTypeInfo?.majors.map((major, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemBullet}>•</Text>
                  <Text>{major}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Career Recommendations */}
        <View>
          <Text style={styles.sectionTitle}>Rekomendasi Karir</Text>
          <View style={styles.section}>
            <View style={styles.list}>
              {dominantTypeInfo?.careers.map((career, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemBullet}>•</Text>
                  <Text>{career}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Detailed Score Breakdown */}
        <View>
          <Text style={styles.sectionTitle}>Skor Detail Per Kategori</Text>
          <View style={styles.section}>
            {result.scores ? (
              Object.entries(result.scores).map(([category, score]) => {
                const percentage = maxScore > 0 ? (score as number) / maxScore * 100 : 0;
                return (
                  <View key={category} style={styles.scoreBar}>
                    <Text style={styles.scoreLabel}>{riasecDescriptions[category]?.name}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{score}</Text>
                  </View>
                );
              })
            ) : (
              ['R', 'I', 'A', 'S', 'E', 'C'].map(category => {
                const score = getScoreValue(result, category);
                const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                
                return (
                  <View key={category} style={styles.scoreBar}>
                    <Text style={styles.scoreLabel}>{riasecDescriptions[category]?.name}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{score}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Laporan Profil Karir - CareerConnect • Halaman 1 dari 1</Text>
          <Text style={{ marginTop: 5 }}>
            Laporan ini adalah hasil dari tes RIASEC (Holland Code) yang dirancang untuk membantu menemukan minat dan bakat karir Anda.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default TestResultReport;