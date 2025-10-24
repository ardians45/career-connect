'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { jsPDF } from 'jspdf';

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

interface TestResultReportPrinterProps {
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
    careers: ['Akuntan', 'Administrasi', 'Bankir', 'Sekretaris', 'Pengacara', 'Petugas Administrasi', 'Analis Data'],
    majors: ['Akuntansi', 'Manajemen', 'Administrasi Niaga', 'Ilmu Perpustakaan', 'Statistika', 'Ilmu Komputer', 'Ekonomi'],
    strengths: ['Ketelitian dan akurasi', 'Kemampuan administratif', 'Kemampuan aritmatika', 'Kemampuan klerikal', 'Kemampuan memproses data'],
    developmentAreas: ['Kegiatan yang sangat bebas', 'Kegiatan yang tidak terstruktur', 'Kegiatan yang memerlukan inovasi', 'Kegiatan yang memerlukan ekspresi diri']
  }
};

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

const TestResultReportPrinter: React.FC<TestResultReportPrinterProps> = ({ result, userName, studentName }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      // Create a new PDF instance with A4 size (210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const margin = 15;
      let yPosition = 20;
      
      // Set font
      pdf.setFont('helvetica');
      
      // Header with modern styling
      pdf.setFontSize(22);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 0, 0); // Black color
      pdf.text('Laporan Profil Karir', pageWidth / 2, yPosition, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(107, 114, 128); // Gray color
      pdf.text('Berdasarkan Metode RIASEC (Holland Code)', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      // Add a decorative line
      pdf.setDrawColor(59, 130, 246); // Blue color
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition + 12, pageWidth - margin, yPosition + 12);
      
      yPosition += 20;
      
      // Personal Information Section with background box
      pdf.setFillColor(249, 250, 251); // Light gray background
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39); // Dark gray
      pdf.text('Informasi Pribadi', margin + 2, yPosition);
      
      pdf.setDrawColor(229, 231, 235); // Light gray border
      pdf.setLineWidth(0.1);
      pdf.line(margin + 2, yPosition + 1, pageWidth - margin - 2, yPosition + 1);
      
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.text(`Nama: ${studentName || userName || 'Siswa/Umum'}`, margin + 5, yPosition);
      yPosition += 6;
      
      pdf.text(`Tanggal Tes: ${format(new Date(result.completedAt), 'dd MMMM yyyy', { locale: id })}`, margin + 5, yPosition);
      yPosition += 6;
      
      if (result.testDuration) {
        pdf.text(`Waktu Pengerjaan: ${Math.floor((result.testDuration || 0) / 60)} menit ${(result.testDuration || 0) % 60} detik`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      yPosition += 10;
      
      // Holland Code Results Section
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Kode Holland (RIASEC)', margin + 2, yPosition);
      
      pdf.setLineWidth(0.1);
      pdf.line(margin + 2, yPosition + 1, pageWidth - margin - 2, yPosition + 1);
      
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(55, 65, 81);
      pdf.text(`Tipe Utama: ${riasecDescriptions[result.dominantType]?.name || result.dominantType}`, margin + 5, yPosition);
      yPosition += 6;
      
      if (result.secondaryType) {
        pdf.text(`Tipe Kedua: ${riasecDescriptions[result.secondaryType]?.name || result.secondaryType}`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      if (result.tertiaryType) {
        pdf.text(`Tipe Ketiga: ${riasecDescriptions[result.tertiaryType]?.name || result.tertiaryType}`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      yPosition += 10;
      
      // Personality Description Section
      pdf.setFillColor(239, 246, 255); // Light blue background
      const personalityBoxHeight = 35;
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, personalityBoxHeight, 'F');
      
      pdf.setDrawColor(30, 58, 138); // Blue border
      pdf.setLineWidth(0.3);
      pdf.rect(margin, yPosition - 5, 5, personalityBoxHeight, 'F'); // Left side color bar
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Deskripsi Kepribadian', margin + 8, yPosition);
      
      yPosition += 6;
      
      const dominantTypeInfo = riasecDescriptions[result.dominantType];
      const personalityText = `Berdasarkan hasil tes, Anda adalah tipe ${dominantTypeInfo?.name.split(' ')[0]} yang artinya: ${dominantTypeInfo?.description || ''}`;
      
      // Split the text to fit within the page width
      const splitPersonalityText = pdf.splitTextToSize(personalityText, pageWidth - 2 * margin - 15);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(30, 64, 175); // Blue text
      
      splitPersonalityText.forEach((line: string) => {
        if (yPosition > 270) { // If reaching bottom of page, add new page
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin + 8, yPosition);
        yPosition += 5;
      });
      
      yPosition += 8;
      
      // Strengths and Development Areas in two columns
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Kekuatan & Area Pengembangan', margin, yPosition);
      
      pdf.setLineWidth(0.1);
      pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
      
      yPosition += 8;
      
      // Strengths - Column 1
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Kekuatan Anda', margin, yPosition);
      yPosition += 5;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(55, 65, 81);
      
      dominantTypeInfo?.strengths.slice(0, 5).forEach((strength, index) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`• ${strength}`, margin + 2, yPosition);
        yPosition += 4.5;
      });
      
      // Start development areas in column 2
      let devYPos = yPosition - (dominantTypeInfo?.strengths.slice(0, 5).length * 4.5) + 5;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Area Pengembangan', margin + 100, devYPos);
      devYPos += 5;
      
      dominantTypeInfo?.developmentAreas.slice(0, 5).forEach((area, index) => {
        if (devYPos > 270) {
          pdf.addPage();
          devYPos = 20;
        }
        pdf.text(`• ${area}`, margin + 100 + 2, devYPos);
        devYPos += 4.5;
      });
      
      yPosition = Math.max(yPosition, devYPos) + 8;
      
      // Major Recommendations Section
      pdf.setFillColor(240, 249, 255); // Light blue background
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 40, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Rekomendasi Jurusan', margin + 2, yPosition);
      
      pdf.setLineWidth(0.1);
      pdf.line(margin + 2, yPosition + 1, pageWidth - margin - 2, yPosition + 1);
      
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(55, 65, 81);
      
      // Show first 6 majors in two columns
      const majors = dominantTypeInfo?.majors.slice(0, 6) || [];
      const col1Majors = majors.filter((_, i) => i % 2 === 0);
      const col2Majors = majors.filter((_, i) => i % 2 === 1);
      
      col1Majors.forEach((major, index) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`• ${major}`, margin + 5, yPosition);
        yPosition += 5;
      });
      
      let col2YPos = yPosition - (col1Majors.length * 5);
      col2Majors.forEach((major, index) => {
        if (col2YPos > 270) {
          pdf.addPage();
          col2YPos = 20;
        }
        pdf.text(`• ${major}`, margin + 95, col2YPos);
        col2YPos += 5;
      });
      
      yPosition = Math.max(yPosition, col2YPos) + 6;
      
      // Career Recommendations Section
      pdf.setFillColor(248, 250, 252); // Light purple background
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 40, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Rekomendasi Karir', margin + 2, yPosition);
      
      pdf.setLineWidth(0.1);
      pdf.line(margin + 2, yPosition + 1, pageWidth - margin - 2, yPosition + 1);
      
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(55, 65, 81);
      
      // Show first 6 careers in two columns
      const careers = dominantTypeInfo?.careers.slice(0, 6) || [];
      const col1Careers = careers.filter((_, i) => i % 2 === 0);
      const col2Careers = careers.filter((_, i) => i % 2 === 1);
      
      col1Careers.forEach((career, index) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`• ${career}`, margin + 5, yPosition);
        yPosition += 5;
      });
      
      let col2YPosCareer = yPosition - (col1Careers.length * 5);
      col2Careers.forEach((career, index) => {
        if (col2YPosCareer > 270) {
          pdf.addPage();
          col2YPosCareer = 20;
        }
        pdf.text(`• ${career}`, margin + 95, col2YPosCareer);
        col2YPosCareer += 5;
      });
      
      yPosition = Math.max(yPosition, col2YPosCareer) + 8;
      
      // Score Breakdown Section
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(17, 24, 39);
      pdf.text('Skor Detail Per Kategori', margin, yPosition);
      
      pdf.setLineWidth(0.1);
      pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
      
      yPosition += 8;
      
      // Calculate max score for percentage calculations
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
      
      // Create the score breakdown with progress bars
      const categories = result.scores ? 
        Object.entries(result.scores) : 
        ['R', 'I', 'A', 'S', 'E', 'C'].map(category => [category, getScoreValue(result, category)]);
      
      for (const [category, score] of categories) {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const percentage = maxScore > 0 ? (Number(score) / maxScore) * 100 : 0;
        const percentageRounded = Math.round(percentage);
        
        // Text for category name and score
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(55, 65, 81);
        pdf.text(`${riasecDescriptions[category]?.name}`, margin, yPosition);
        pdf.text(`${score}`, pageWidth - margin - 15, yPosition);
        
        // Draw a line for the progress bar
        const barStartX = margin + 50;
        const barEndX = pageWidth - margin - 30;
        const barWidth = barEndX - barStartX;
        const filledWidth = (percentageRounded / 100) * barWidth;
        
        // Empty bar background
        pdf.setFillColor(229, 231, 235); // Light gray
        pdf.rect(barStartX, yPosition - 2, barWidth, 3, 'F');
        
        // Filled bar
        pdf.setFillColor(59, 130, 246); // Blue
        pdf.rect(barStartX, yPosition - 2, filledWidth, 3, 'F');
        
        // Percentage text on the bar
        pdf.setTextColor(255, 255, 255); // White text
        pdf.setFont(undefined, 'bold');
        if (percentageRounded > 15) { // Only show percentage if bar is wide enough
          pdf.text(`${percentageRounded}%`, barStartX + filledWidth / 2, yPosition + 0.5, { align: 'center' });
        }
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(55, 65, 81);
        
        yPosition += 7;
      }
      
      // Add footer if there's enough space, otherwise add new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Footer
      yPosition = 275; // Fixed position at the bottom
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.1);
      pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
      
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text('Laporan Profil Karir - CareerConnect • Halaman 1 dari 1', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 4;
      const footerText = 'Laporan ini adalah hasil dari tes RIASEC (Holland Code) yang dirancang untuk membantu menemukan minat dan bakat karir Anda.';
      const splitFooterText = pdf.splitTextToSize(footerText, pageWidth - 2 * margin);
      splitFooterText.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 3.5;
      });
      
      // Save the PDF
      const fileName = `Laporan-Profil-Karir-${studentName || userName || 'Siswa'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownloadPDF} 
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      disabled={isGenerating}
    >
      <Download className="h-4 w-4" />
      {isGenerating ? 'Membuat PDF...' : 'Cetak Laporan PDF'}
    </Button>
  );
};

export default TestResultReportPrinter;