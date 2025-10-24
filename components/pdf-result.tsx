import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// Register a font that supports Indonesian characters
Font.register({
  family: 'OpenSans',
  src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ECEFF1',
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
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'OpenSans',
    color: '#546E7A',
  },
  resultSummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1976D2',
  },
  hollandCode: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1976D2',
  },
  nickname: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#546E7A',
  },
  description: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    fontFamily: 'OpenSans',
    marginBottom: 20,
  },
  scoresSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1976D2',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: 'OpenSans',
    width: '60%',
  },
  scoreValue: {
    fontSize: 11,
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'right',
  },
  progressBar: {
    width: '20%',
    height: 10,
    backgroundColor: '#B0BEC5',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#1976D2',
  },
  recommendationsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1976D2',
  },
  recommendationItem: {
    fontSize: 11,
    fontFamily: 'OpenSans',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#546E7A',
  },
});

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

interface PdfResultProps {
  result: TestResult;
  studentName: string;
}

const PdfResult: React.FC<PdfResultProps> = ({ result, studentName }) => {
  // RIASEC descriptions
  const riasecDescriptions: Record<string, { name: string, description: string, careers: string[] }> = {
    'R': {
      name: 'Realistic (M)', 
      description: 'Orang dengan tipe Realistic menyukai kegiatan yang bersifat fisik, memanipulasi benda, mesin, alat dan hewan. Mereka cenderung praktis, stabil, dan mandiri.',
      careers: ['Teknik Mesin', 'Otomotif', 'Pertanian', 'Konstruksi', 'Perbengkelan']
    },
    'I': {
      name: 'Investigative (I)', 
      description: 'Orang dengan tipe Investigative suka dengan kegiatan yang bersifat penelitian, eksplorasi, dan analisis. Mereka cenderung intelektual, logis, dan kritis.',
      careers: ['Peneliti', 'Dokter', 'Ilmuwan', 'Analisis Data', 'Farmasi']
    },
    'A': {
      name: 'Artistic (A)', 
      description: 'Orang dengan tipe Artistic menyukai kegiatan yang bersifat kreatif, imajinatif, dan ekspresif. Mereka cenderung inovatif, emosional, dan tidak konvensional.',
      careers: ['Desainer Grafis', 'Seniman', 'Fotografer', 'Arsitek', 'Penulis']
    },
    'S': {
      name: 'Social (S)', 
      description: 'Orang dengan tipe Social menyukai kegiatan yang bersifat membantu, melatih, dan memberi informasi kepada orang lain. Mereka cenderung sosial, kooperatif, dan mudah beradaptasi.',
      careers: ['Guru', 'Psikolog', 'Perawat', 'Pekerja Sosial', 'Konselor']
    },
    'E': {
      name: 'Enterprising (E)', 
      description: 'Orang dengan tipe Enterprising menyukai kegiatan yang bersifat kepemimpinan, pengaruh, dan kemampuan untuk mempengaruhi orang lain. Mereka cenderung ambisius, percaya diri, dan dominan.',
      careers: ['Wirausaha', 'Marketing', 'Manajer', 'Politisi', 'Penjual']
    },
    'C': {
      name: 'Conventional (C)', 
      description: 'Orang dengan tipe Conventional menyukai kegiatan yang bersifat data, angka, dan informasi terstruktur. Mereka cenderung teliti, stabil, dan taat aturan.',
      careers: ['Akuntan', 'Administrasi', 'Bankir', 'Sekretaris', 'Pengacara']
    }
  };

  // Get scores from either scores object or individual fields
  const scores = result.scores || {
    R: result.realisticScore || 0,
    I: result.investigativeScore || 0,
    A: result.artisticScore || 0,
    S: result.socialScore || 0,
    E: result.enterprisingScore || 0,
    C: result.conventionalScore || 0,
  };

  const getNicknameForType = (type: string): string => {
    const nicknames: Record<string, string> = {
      'R': 'Si Realistis',
      'I': 'Si Penyelidik',
      'A': 'Si Seniman',
      'S': 'Si Sosial',
      'E': 'Si Pemimpin',
      'C': 'Si Konvensional',
      'RI': 'Si Realistis Investigatif',
      'RA': 'Si Realistis Artistik',
      'RS': 'Si Realistis Sosial',
      'RE': 'Si Realistis Enterprising',
      'RC': 'Si Realistis Konvensional',
      'IA': 'Si Investigatif Artistik',
      'IS': 'Si Investigatif Sosial',
      'IE': 'Si Investigatif Enterprising',
      'IC': 'Si Investigatif Konvensional',
      'AS': 'Si Artistik Sosial',
      'AE': 'Si Artistik Enterprising',
      'AC': 'Si Artistik Konvensional',
      'SE': 'Si Sosial Enterprising',
      'SC': 'Si Sosial Konvensional',
      'EC': 'Si Enterprising Konvensional',
      'RIA': 'Si Penyelidik Realistis',
      'RIS': 'Si Realistis Penyelidik Sosial',
      'RIE': 'Si Realistis Penyelidik Enterprising',
      'RIC': 'Si Realistis Penyelidik Konvensional',
      'RAS': 'Si Realistis Artistik Sosial',
      'RAE': 'Si Realistis Artistik Enterprising',
      'RAC': 'Si Realistis Artistik Konvensional',
      'RSE': 'Si Realistis Sosial Enterprising',
      'RSC': 'Si Realistis Sosial Konvensional',
      'REC': 'Si Realistis Enterprising Konvensional',
      'IAS': 'Si Investigatif Artistik Sosial',
      'IAE': 'Si Investigatif Artistik Enterprising',
      'IAC': 'Si Investigatif Artistik Konvensional',
      'ISE': 'Si Investigatif Sosial Enterprising',
      'ISC': 'Si Investigatif Sosial Konvensional',
      'IEC': 'Si Investigatif Enterprising Konvensional',
      'ASE': 'Si Artistik Sosial Enterprising',
      'ASC': 'Si Artistik Sosial Konvensional',
      'AEC': 'Si Artistik Enterprising Konvensional',
      'SEC': 'Si Sosial Enterprising Konvensional',
    };

    return nicknames[type] || `Tipe ${type}`;
  };

  const getDescriptionForType = (type: string): string => {
    const descriptions: Record<string, string> = {
      'R': 'Sebagai tipe Realistic, Anda memiliki kekuatan dalam hal keterampilan praktis dan kerja tanganan. Anda cenderung suka bekerja dengan benda-benda nyata dan menyelesaikan masalah secara logis. Anda mungkin merasa kurang nyaman dalam situasi yang sangat sosial atau berorientasi pada layanan orang lain.',
      'I': 'Sebagai tipe Investigative, Anda suka dengan kegiatan yang bersifat penelitian, eksplorasi, dan analisis. Anda cenderung intelektual, logis, dan kritis. Anda lebih suka bekerja secara mandiri dan mengeksplorasi ide-ide baru.',
      'A': 'Sebagai tipe Artistic, Anda menyukai kegiatan yang bersifat kreatif, imajinatif, dan ekspresif. Anda cenderung inovatif, emosional, dan tidak konvensional. Anda perlu akan fleksibilitas dan kesempatan untuk mengekspresikan diri.',
      'S': 'Sebagai tipe Social, Anda menyukai kegiatan yang bersifat membantu, melatih, dan memberi informasi kepada orang lain. Anda cenderung sosial, kooperatif, dan mudah beradaptasi. Anda merasa nyaman dalam lingkungan yang kolaboratif.',
      'E': 'Sebagai tipe Enterprising, Anda menyukai kegiatan yang bersifat kepemimpinan, pengaruh, dan kemampuan untuk mempengaruhi orang lain. Anda cenderung ambisius, percaya diri, dan dominan. Anda suka akan tantangan dan peluang untuk memimpin.',
      'C': 'Sebagai tipe Conventional, Anda menyukai kegiatan yang bersifat data, angka, dan informasi terstruktur. Anda cenderung teliti, stabil, dan taat aturan. Anda merasa nyaman dengan tugas-tugas yang terstruktur dan rutin.',
      'RIA': 'Sebagai tipe RIA, Anda memiliki kekuatan dalam hal keterampilan praktis dan analitis. Anda cenderung suka bekerja dengan benda-benda nyata dan menyelesaikan masalah secara logis. Anda juga kreatif dalam mengekspresikan ide-ide Anda. Namun, Anda mungkin merasa kurang nyaman dalam situasi yang sangat sosial atau berorientasi pada layanan orang lain. Lingkungan kerja yang cocok untuk Anda adalah yang memberikan ruang untuk bekerja mandiri, mengeksplorasi ide-ide baru, dan mengekspresikan kreativitas Anda.',
    };

    return descriptions[type] || `Deskripsi untuk tipe ${type}.`;
  };

  const getMajorsForType = (type: string): string[] => {
    const majors: Record<string, string[]> = {
      'R': ['Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Teknik Informatika', 'Teknik Industri'],
      'I': ['Ilmu Komputer', 'Fisika', 'Matematika', 'Biologi', 'Kimia'],
      'A': ['Desain Komunikasi Visual', 'Desain Produk', 'Seni Rupa', 'Sastra', 'Musik'],
      'S': ['Pendidikan', 'Psikologi', 'Kedokteran', 'Keperawatan', 'Sosiologi'],
      'E': ['Manajemen', 'Bisnis', 'Ekonomi', 'Hukum', 'Ilmu Politik'],
      'C': ['Akuntansi', 'Administrasi', 'Perpajakan', 'Statistika', 'Arsiparis'],
      'RIA': [
        'Teknik Mesin', 
        'Teknik Informatika', 
        'Desain Produk', 
        'Arsitektur', 
        'Fisika'
      ]
    };

    return majors[type] || [`Rekomendasi jurusan untuk tipe ${type}`];
  };

  // Calculate max score for progress bar scaling
  const maxScore = Math.max(...Object.values(scores).map(score => score as number));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="/logo-cc.png" 
            cache={true}
          />
          <Text>Hasil Tes Minat Bakat</Text>
        </View>

        <Text style={styles.title}>Laporan Hasil Tes Minat Bakat</Text>
        <Text style={styles.subtitle}>Berdasarkan metode RIASEC (Holland Code)</Text>
        
        <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 12 }}>
          Untuk: {studentName}
        </Text>

        <View style={styles.resultSummary}>
          <Text style={styles.resultTitle}>Tipe Kepribadian Anda</Text>
          <Text style={styles.hollandCode}>{result.dominantType}</Text>
          <Text style={styles.nickname}>{getNicknameForType(result.dominantType)}</Text>
          <Text style={styles.description}>
            {getDescriptionForType(result.dominantType)}
          </Text>
        </View>

        <View style={styles.scoresSection}>
          <Text style={styles.scoresTitle}>Skor Detail Per Kategori</Text>
          {Object.entries(scores).map(([category, score]) => (
            <View key={category} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>
                {riasecDescriptions[category as keyof typeof riasecDescriptions]?.name}
              </Text>
              <Text style={styles.scoreValue}>{score}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${maxScore > 0 ? ((score as number) / maxScore) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Rekomendasi Karir</Text>
          {riasecDescriptions[result.dominantType as keyof typeof riasecDescriptions]?.careers.map((career, index) => (
            <Text key={index} style={styles.recommendationItem}>
              • {career}
            </Text>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Rekomendasi Jurusan</Text>
          {getMajorsForType(result.dominantType).map((major, index) => (
            <Text key={index} style={styles.recommendationItem}>
              • {major}
            </Text>
          ))}
        </View>

        <Text style={styles.footer}>
          CareerConnect - Platform Asesmen Karir untuk Siswa SMK
        </Text>
      </Page>
    </Document>
  );
};

export default PdfResult;