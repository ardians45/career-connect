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

interface TestResult {
  id: string;
  completedAt: string;
  dominantType: string;
  secondaryType: string;
  tertiaryType: string;
  realisticScore: number;
  investigativeScore: number;
  artisticScore: number;
  socialScore: number;
  enterprisingScore: number;
  conventionalScore: number;
}

interface PdfDashboardSummaryProps {
  userProfile: {
    name: string;
    school: string | null;
    grade: number | null;
  };
  testResults: TestResult[];
}

const PdfDashboardSummary: React.FC<PdfDashboardSummaryProps> = ({ userProfile, testResults }) => {
  // Get the most recent test to determine the dominant type
  const mostRecentTest = testResults.length > 0 
    ? testResults[testResults.length - 1] 
    : null;

  // Calculate aggregated scores across all tests (for averages)
  const aggregatedScores = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0
  };

  testResults.forEach(test => {
    aggregatedScores.R += test.realisticScore || 0;
    aggregatedScores.I += test.investigativeScore || 0;
    aggregatedScores.A += test.artisticScore || 0;
    aggregatedScores.S += test.socialScore || 0;
    aggregatedScores.E += test.enterprisingScore || 0;
    aggregatedScores.C += test.conventionalScore || 0;
  });

  // Calculate averages
  const avgScores = {
    R: testResults.length > 0 ? Math.round(aggregatedScores.R / testResults.length) : 0,
    I: testResults.length > 0 ? Math.round(aggregatedScores.I / testResults.length) : 0,
    A: testResults.length > 0 ? Math.round(aggregatedScores.A / testResults.length) : 0,
    S: testResults.length > 0 ? Math.round(aggregatedScores.S / testResults.length) : 0,
    E: testResults.length > 0 ? Math.round(aggregatedScores.E / testResults.length) : 0,
    C: testResults.length > 0 ? Math.round(aggregatedScores.C / testResults.length) : 0,
  };

  // Determine the top 3 scores for overall dominant types
  const sortedAvgCategories = Object.entries(avgScores)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category);

  const overallDominantType = sortedAvgCategories[0];
  const overallSecondaryType = sortedAvgCategories[1];
  const overallTertiaryType = sortedAvgCategories[2];

  // RIASEC descriptions
  const riasecDescriptions: Record<string, { name: string, description: string, strength: string, workEnvironment: string, nextSteps: string }> = {
    'R': {
      name: 'Realistic (R)', 
      description: 'Orang dengan tipe Realistic menyukai kegiatan yang bersifat fisik, memanipulasi benda, mesin, alat dan hewan. Mereka cenderung praktis, stabil, dan mandiri.',
      strength: 'Kekuatan utama: Keterampilan praktis, kerja keras, dan kemampuan bekerja dengan benda-benda nyata.',
      workEnvironment: 'Lingkungan kerja yang cocok: Lingkungan yang terstruktur, praktis, dan berfokus pada tugas teknis atau manual.',
      nextSteps: 'Rekomendasi tindak lanjut: Eksplorasi karir yang melibatkan keterampilan teknis dan pekerjaan manual.'
    },
    'I': {
      name: 'Investigative (I)', 
      description: 'Orang dengan tipe Investigative suka dengan kegiatan yang bersifat penelitian, eksplorasi, dan analisis. Mereka cenderung intelektual, logis, dan kritis.',
      strength: 'Kekuatan utama: Keterampilan analitis, penyelesaian masalah kompleks, dan pemikiran logis.',
      workEnvironment: 'Lingkungan kerja yang cocok: Lingkungan yang mendukung eksplorasi intelektual dan penelitian mendalam.',
      nextSteps: 'Rekomendasi tindak lanjut: Menjajaki karir dalam bidang sains, teknologi, atau penelitian.'
    },
    'A': {
      name: 'Artistic (A)', 
      description: 'Orang dengan tipe Artistic menyukai kegiatan yang bersifat kreatif, imajinatif, dan ekspresif. Mereka cenderung inovatif, emosional, dan tidak konvensional.',
      strength: 'Kekuatan utama: Kreativitas, inovasi, dan kemampuan mengekspresikan ide-ide secara artistik.',
      workEnvironment: 'Lingkungan kerja yang cocok: Lingkungan yang fleksibel, kreatif, dan mendukung ekspresi pribadi.',
      nextSteps: 'Rekomendasi tindak lanjut: Menjelajahi karir dalam bidang seni, desain, atau media kreatif.'
    },
    'S': {
      name: 'Social (S)', 
      description: 'Orang dengan tipe Social menyukai kegiatan yang bersifat membantu, melatih, dan memberi informasi kepada orang lain. Mereka cenderung sosial, kooperatif, dan mudah beradaptasi.',
      strength: 'Kekuatan utama: Keterampilan interpersonal, empati, dan kemampuan mengajar/membantu orang lain.',
      workEnvironment: 'Lingkungan kerja yang cocok: Lingkungan kerja tim yang kolaboratif dan berorientasi pelayanan.',
      nextSteps: 'Rekomendasi tindak lanjut: Menjajaki karir dalam pendidikan, kesehatan, atau layanan sosial.'
    },
    'E': {
      name: 'Enterprising (E)', 
      description: 'Orang dengan tipe Enterprising menyukai kegiatan yang bersifat kepemimpinan, pengaruh, dan kemampuan untuk mempengaruhi orang lain. Mereka cenderung ambisius, percaya diri, dan dominan.',
      strength: 'Kekuatan utama: Keterampilan kepemimpinan, persuasi, dan kemampuan mengambil inisiatif.',
      workEnvironment: 'Lingkungan kerja yang cocok: Lingkungan yang kompetitif, dinamis, dan berorientasi pada pencapaian.',
      nextSteps: 'Rekomendasi tindak lanjut: Menjelajahi karir dalam bisnis, manajemen, atau pemasaran.'
    },
    'C': {
      name: 'Conventional (C)', 
      description: 'Orang dengan tipe Conventional menyukai kegiatan yang bersifat data, angka, dan informasi terstruktur. Mereka cenderung teliti, stabil, dan taat aturan.',
      strength: 'Kekuatan utama: Keterampilan organisasi, ketelitian, dan kemampuan mengelola informasi secara sistematis.',
      workEnvironment: 'Lingkungan kerja yang cocok: Lingkungan yang terstruktur, teratur, dan berbasis data serta administrasi.',
      nextSteps: 'Rekomendasi tindak lanjut: Menjajaki karir dalam administrasi, akuntansi, atau teknologi informasi.'
    }
  };

  // Get recommendation for the dominant type
  const getMajorsForType = (type: string): string[] => {
    const majors: Record<string, string[]> = {
      'R': [
        'Teknik Mesin', 
        'Teknik Elektro', 
        'Teknik Sipil', 
        'Teknik Informatika', 
        'Teknik Industri',
        'Teknik Kimia',
        'Perikanan',
        'Pertanian'
      ],
      'I': [
        'Ilmu Komputer', 
        'Fisika', 
        'Matematika', 
        'Biologi', 
        'Kimia',
        'Statistika',
        'Psikologi',
        'Kedokteran'
      ],
      'A': [
        'Desain Komunikasi Visual', 
        'Desain Produk', 
        'Seni Rupa', 
        'Sastra', 
        'Musik',
        'Audio Visual',
        'Fotografi',
        'Periklanan'
      ],
      'S': [
        'Pendidikan', 
        'Psikologi', 
        'Kedokteran', 
        'Keperawatan', 
        'Sosiologi',
        'Kesejahteraan Sosial',
        'Pekerjaan Sosial',
        'Konseling'
      ],
      'E': [
        'Manajemen', 
        'Bisnis', 
        'Ekonomi', 
        'Hukum', 
        'Ilmu Politik',
        'Marketing',
        'Kewirausahaan',
        'Perbankan'
      ],
      'C': [
        'Akuntansi', 
        'Administrasi', 
        'Perpajakan', 
        'Statistika', 
        'Arsiparis',
        'Manajemen',
        'Sistem Informasi',
        'Perbankan'
      ]
    };

    return majors[type] || [`Rekomendasi jurusan untuk tipe ${type}`];
  };

  const getCareersForType = (type: string): string[] => {
    const careers: Record<string, string[]> = {
      'R': [
        'Teknik Mesin', 
        'Otomotif', 
        'Pertanian', 
        'Konstruksi', 
        'Perbengkelan',
        'Mekanik',
        'Listrik',
        'Arsitek'
      ],
      'I': [
        'Peneliti', 
        'Dokter', 
        'Ilmuwan', 
        'Analisis Data', 
        'Farmasi',
        'Dosen',
        'Insinyur R&D',
        'Analis Sistem'
      ],
      'A': [
        'Desainer Grafis', 
        'Seniman', 
        'Fotografer', 
        'Arsitek', 
        'Penulis',
        'Musisi',
        'Animator',
        'Kreator Konten'
      ],
      'S': [
        'Guru', 
        'Psikolog', 
        'Perawat', 
        'Pekerja Sosial', 
        'Konselor',
        'Dokter',
        'Terapis',
        'Pekerja Komunitas'
      ],
      'E': [
        'Wirausaha', 
        'Marketing', 
        'Manajer', 
        'Politisi', 
        'Penjual',
        'Pemimpin Tim',
        'CEO',
        'Konsultan'
      ],
      'C': [
        'Akuntan', 
        'Administrasi', 
        'Bankir', 
        'Sekretaris', 
        'Pengacara',
        'Staf Administrasi',
        'Analis Data',
        'Auditor'
      ]
    };

    return careers[type] || [`Rekomendasi karir untuk tipe ${type}`];
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 80,
      height: 80,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 10,
      fontFamily: 'OpenSans',
      fontWeight: 'bold',
      color: '#1976D2',
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'OpenSans',
      color: '#546E7A',
    },
    userProfileSection: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      paddingBottom: 15,
    },
    userRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    userLabel: {
      fontSize: 11,
      fontFamily: 'OpenSans',
      fontWeight: 'bold',
      color: '#546E7A',
    },
    userValue: {
      fontSize: 11,
      fontFamily: 'OpenSans',
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#1976D2',
      marginTop: 15,
      textDecoration: 'underline',
    },
    summaryInsightSection: {
      backgroundColor: '#F5F7FA',
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
    },
    insightDominantType: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
      color: '#1976D2',
    },
    insightDescription: {
      fontSize: 10,
      lineHeight: 1.4,
      fontFamily: 'OpenSans',
      marginBottom: 10,
      textAlign: 'justify'
    },
    insightStrength: {
      fontSize: 10,
      lineHeight: 1.3,
      fontFamily: 'OpenSans',
      marginBottom: 5,
      fontWeight: 'normal',
    },
    insightWorkEnvironment: {
      fontSize: 10,
      lineHeight: 1.3,
      fontFamily: 'OpenSans',
      marginBottom: 5,
    },
    insightNextSteps: {
      fontSize: 10,
      lineHeight: 1.3,
      fontFamily: 'OpenSans',
      marginBottom: 5,
    },
    testListHeader: {
      flexDirection: 'row',
      backgroundColor: '#E3F2FD',
      padding: 8,
      marginBottom: 5,
    },
    testHeaderItem: {
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'OpenSans',
      width: '15%',
    },
    testHeaderDate: {
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'OpenSans',
      width: '25%',
    },
    testHeaderType: {
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'OpenSans',
      width: '60%',
    },
    testItem: {
      flexDirection: 'row',
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    testItemData: {
      fontSize: 9,
      fontFamily: 'OpenSans',
      width: '15%',
    },
    testItemDate: {
      fontSize: 9,
      fontFamily: 'OpenSans',
      width: '25%',
    },
    testItemType: {
      fontSize: 9,
      fontFamily: 'OpenSans',
      width: '60%',
    },
    scoresSummarySection: {
      marginBottom: 20,
    },
    scoresSummaryTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#546E7A',
    },
    scoresRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    scoreLabel: {
      fontSize: 10,
      fontFamily: 'OpenSans',
      width: '60%',
    },
    scoreValue: {
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'OpenSans',
      width: '40%',
      textAlign: 'right',
    },
    recommendationsTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#1976D2',
    },
    recommendationItem: {
      fontSize: 9,
      fontFamily: 'OpenSans',
      marginBottom: 3,
      paddingLeft: 8,
    },
    recommendationSubtitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#546E7A',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: 9,
      color: '#546E7A',
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: 10,
    },
    motivationNote: {
      fontSize: 10,
      lineHeight: 1.4,
      fontFamily: 'OpenSans',
      marginBottom: 10,
      textAlign: 'justify',
      backgroundColor: '#E8F5E9',
      padding: 10,
      borderRadius: 5,
    },
    counselorNote: {
      fontSize: 10,
      lineHeight: 1.4,
      fontFamily: 'OpenSans',
      textAlign: 'justify',
      backgroundColor: '#FFF3E0',
      padding: 10,
      borderRadius: 5,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Halaman Judul */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="/logo-cc.png" 
            cache={true}
          />
          <Text></Text> {/* Placeholder to maintain alignment */}
        </View>

        <Text style={styles.title}>Laporan Ringkasan Hasil Tes CareerConnect</Text>
        <Text style={styles.subtitle}>Berdasarkan Metode RIASEC (Holland Code)</Text>
        
        <View style={styles.userProfileSection}>
          <View style={styles.userRow}>
            <Text style={styles.userLabel}>Nama Pengguna:</Text>
            <Text style={styles.userValue}>{userProfile.name}</Text>
          </View>
          <View style={styles.userRow}>
            <Text style={styles.userLabel}>Sekolah:</Text>
            <Text style={styles.userValue}>{userProfile.school || 'Tidak disebutkan'}</Text>
          </View>
          <View style={styles.userRow}>
            <Text style={styles.userLabel}>Kelas:</Text>
            <Text style={styles.userValue}>{userProfile.grade ? userProfile.grade.toString() : 'Tidak disebutkan'}</Text>
          </View>
        </View>

        {/* Rangkuman Profil dan Insight Utama */}
        <Text style={styles.sectionTitle}>Rangkuman Profil dan Insight Utama</Text>
        
        <View style={styles.summaryInsightSection}>
          {mostRecentTest ? (
            <>
              <Text style={styles.insightDominantType}>
                {mostRecentTest.dominantType}{mostRecentTest.secondaryType || ''}{mostRecentTest.tertiaryType || ''}
              </Text>
              <Text style={styles.insightDescription}>
                {riasecDescriptions[mostRecentTest.dominantType]?.description || 'Deskripsi tidak tersedia'}
              </Text>
              <Text style={styles.insightStrength}>
                {riasecDescriptions[mostRecentTest.dominantType]?.strength || ''}
              </Text>
              <Text style={styles.insightWorkEnvironment}>
                {riasecDescriptions[mostRecentTest.dominantType]?.workEnvironment || ''}
              </Text>
              <Text style={styles.insightNextSteps}>
                {riasecDescriptions[mostRecentTest.dominantType]?.nextSteps || ''}
              </Text>
            </>
          ) : (
            <Text>Anda belum menyelesaikan tes apapun</Text>
          )}
        </View>

        {/* Daftar Hasil Tes yang Telah Dikerjakan */}
        <Text style={styles.sectionTitle}>Daftar Hasil Tes yang Telah Dikerjakan</Text>
        
        <View style={styles.testListHeader}>
          <Text style={styles.testHeaderItem}>Tes</Text>
          <Text style={styles.testHeaderDate}>Tanggal</Text>
          <Text style={styles.testHeaderType}>Kode RIASEC</Text>
        </View>
        
        {testResults.length === 0 ? (
          <Text>Belum ada tes yang diselesaikan</Text>
        ) : (
          testResults.map((test, index) => (
            <View key={index} style={styles.testItem}>
              <Text style={styles.testItemData}>{index + 1}</Text>
              <Text style={styles.testItemDate}>
                {new Date(test.completedAt).toLocaleDateString('id-ID')}
              </Text>
              <Text style={styles.testItemType}>
                {test.dominantType}{test.secondaryType && test.secondaryType !== test.dominantType ? test.secondaryType : ''}{test.tertiaryType && test.tertiaryType !== test.dominantType && test.tertiaryType !== test.secondaryType ? test.tertiaryType : ''}
              </Text>
            </View>
          ))
        )}

        {/* Ringkasan Angka */}
        <View style={styles.scoresSummarySection}>
          <Text style={styles.scoresSummaryTitle}>Ringkasan Skor Rata-Rata Per Dimensi RIASEC</Text>
          <View style={styles.scoresRow}>
            <Text style={styles.scoreLabel}>{riasecDescriptions.R.name}</Text>
            <Text style={styles.scoreValue}>{avgScores.R}</Text>
          </View>
          <View style={styles.scoresRow}>
            <Text style={styles.scoreLabel}>{riasecDescriptions.I.name}</Text>
            <Text style={styles.scoreValue}>{avgScores.I}</Text>
          </View>
          <View style={styles.scoresRow}>
            <Text style={styles.scoreLabel}>{riasecDescriptions.A.name}</Text>
            <Text style={styles.scoreValue}>{avgScores.A}</Text>
          </View>
          <View style={styles.scoresRow}>
            <Text style={styles.scoreLabel}>{riasecDescriptions.S.name}</Text>
            <Text style={styles.scoreValue}>{avgScores.S}</Text>
          </View>
          <View style={styles.scoresRow}>
            <Text style={styles.scoreLabel}>{riasecDescriptions.E.name}</Text>
            <Text style={styles.scoreValue}>{avgScores.E}</Text>
          </View>
          <View style={styles.scoresRow}>
            <Text style={styles.scoreLabel}>{riasecDescriptions.C.name}</Text>
            <Text style={styles.scoreValue}>{avgScores.C}</Text>
          </View>
          <Text style={{ fontSize: 9, fontFamily: 'OpenSans', marginTop: 5 }}>
            Kode dominan keseluruhan: {overallDominantType}{overallSecondaryType}{overallTertiaryType}
          </Text>
        </View>

        {/* Rekomendasi Arah Jurusan dan Karier */}
        <Text style={styles.sectionTitle}>Rekomendasi Arah Jurusan dan Karier</Text>
        
        <Text style={styles.recommendationSubtitle}>“Jurusan yang Cocok dengan Profil Anda”</Text>
        <View>
          {getMajorsForType(overallDominantType).slice(0, 5).map((major, index) => (
            <Text key={index} style={styles.recommendationItem}>
              • {major}
            </Text>
          ))}
        </View>
        
        <Text style={styles.recommendationSubtitle}>“Pilihan Karier yang Direkomendasikan”</Text>
        <View>
          {getCareersForType(overallDominantType).slice(0, 5).map((career, index) => (
            <Text key={index} style={styles.recommendationItem}>
              • {career}
            </Text>
          ))}
        </View>

        {/* Catatan Penutup */}
        <Text style={styles.sectionTitle}>Catatan Penutup</Text>
        
        <View>
          <Text style={styles.motivationNote}>
            Selamat! Anda telah membuat langkah penting dalam memahami diri sendiri dan potensi karier Anda. 
            Hasil tes ini menunjukkan preferensi dan kekuatan alami Anda. Gunakan informasi ini sebagai 
            alat untuk mengeksplorasi pilihan pendidikan dan karier yang sesuai dengan kepribadian Anda.
          </Text>
          
          <Text style={styles.counselorNote}>
            Kami mendorong Anda untuk mendiskusikan hasil tes ini dengan guru Bimbingan Konseling (BK) 
            Anda untuk mendapatkan wawasan tambahan dan bimbingan yang lebih mendalam dalam memilih 
            jurusan dan jalur karier yang paling sesuai.
          </Text>
        </View>

        <Text style={styles.footer}>
          CareerConnect 2025 © Platform Asesmen Karier untuk Siswa SMK/MA/SMA
        </Text>
      </Page>
    </Document>
  );
};

export default PdfDashboardSummary;