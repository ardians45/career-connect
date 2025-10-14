# **Product Requirements Document (PRD): CareerConnect**

Versi: 4.0

Tanggal: 10 Oktober 2025

Penulis: Ardian S

## **1\. Tujuan Produk**

Aplikasi "CareerConnect" bertujuan untuk menjadi platform asesmen karir digital yang membantu siswa SMK (Sekolah Menengah Kejuruan) dalam mengidentifikasi minat dan bakat mereka menggunakan metode Holland (RIASEC). Tujuannya adalah memberikan rekomendasi jurusan kuliah dan jalur karir yang akurat dan dipersonalisasi, sehingga dapat mengurangi angka "salah jurusan" dan membantu siswa merencanakan masa depan dengan lebih percaya diri melalui antarmuka yang modern dan berkinerja tinggi.

## **2\. Target Pengguna**

* **Pengguna Utama (Siswa SMK):** Siswa kelas 10-12 yang sedang dalam fase eksplorasi pilihan karir dan membutuhkan panduan terstruktur untuk mengambil keputusan.  
* **Pengguna Tamu (Guest User):** Calon siswa, orang tua, atau siapa pun yang ingin mencoba tes minat bakat tanpa perlu membuat akun.  
* **Pengguna Sekunder (Guru BK):** Guru Bimbingan Konseling yang dapat memanfaatkan hasil tes sebagai alat bantu dalam sesi konseling karir dengan siswa.

## **3\. Fitur Utama**

| Fitur | Deskripsi | Prioritas |
| :---- | :---- | :---- |
| **1\.** Sistem Autentikasi **& Mode Tamu** | Mengimplementasikan alur pendaftaran dan masuk yang aman menggunakan **Better Auth**. Pengguna terdaftar dapat menyimpan riwayat hasil tes. Terdapat juga opsi "Mode Tamu" yang memungkinkan pengguna mengikuti tes tanpa login. | **Kritis** |
| **2\. Dashboard Siswa Interaktif** | (Untuk pengguna terdaftar) Halaman personal yang menampilkan riwayat hasil tes RIASEC sebelumnya, rekomendasi yang disimpan, dan statistik ringkas tentang tipe kepribadian dominan mereka. | **Kritis** |
| **3\. Manajemen Data Tes & Rekomendasi (CRUD)** | Sistem inti untuk mengelola data: **C**reate (menyimpan hasil tes baru), **R**ead (menampilkan hasil & rekomendasi), **U**pdate (memperbarui profil), **D**elete (menghapus akun). Data pengguna, hasil tes, dan database jurusan/karir dikelola oleh **Drizzle ORM** dengan **PostgreSQL**. | **Kritis** |
| **4\. Mode Terang dan Gelap** | Kemampuan untuk beralih antara tema terang dan gelap secara instan menggunakan **next-themes** untuk kenyamanan visual pengguna saat membaca hasil tes yang panjang. | Tinggi |
| **5\. Komponen UI Dinamis & Modern** | Pembangunan antarmuka, mulai dari kartu hasil tes, modal, hingga tombol, menggunakan koleksi komponen dari **shadcn/ui** dengan gaya "New York" untuk memastikan tampilan yang profesional dan konsisten. | Tinggi |
| **6\. Ikonografi Intuitif** | Penggunaan ikon dari **Lucide React** untuk memperjelas navigasi, kategori kepribadian RIASEC, dan tindakan pengguna, sehingga meningkatkan pengalaman visual dan kemudahan penggunaan. | Tinggi |
| **7\. Deployment Tercontainerisasi** | Seluruh aplikasi akan dibungkus dalam **Docker container** untuk memastikan proses deployment yang konsisten dan andal di berbagai lingkungan server. | Tinggi |

## **4\. Alur Pengguna (User Flow)**

1. **Halaman Awal:**  
   * Pengguna mengunjungi halaman utama dan disambut dengan penjelasan singkat tentang tes RIASEC.  
   * Dua pilihan utama disajikan: "Ikuti Tes (Tanpa Login)" untuk mode tamu, atau "Masuk/Daftar".  
2. **Alur Pengguna Tamu:**  
   * Pengguna memilih "Ikuti Tes (Tanpa Login)".  
   * Langsung diarahkan ke halaman tes dan menjawab serangkaian pertanyaan.  
   * Setelah selesai, halaman hasil tes yang detail ditampilkan (skor, tipe dominan, deskripsi, dan rekomendasi).  
   * Di akhir halaman hasil, muncul ajakan untuk "Daftar untuk Menyimpan Hasil Ini".  
3. **Alur Pengguna Terdaftar:**  
   * Pengguna memilih "Masuk/Daftar". Pengguna baru membuat akun; pengguna lama melakukan login.  
   * Setelah berhasil, pengguna diarahkan ke **Dashboard** pribadi.  
   * Dari dashboard, pengguna dapat memilih "Ambil Tes Baru" atau melihat riwayat tes sebelumnya.  
   * Proses tes sama seperti pengguna tamu, namun hasilnya akan otomatis tersimpan dan tercatat di dashboard.  
4. **Eksplorasi Rekomendasi:**  
   * Dari halaman hasil, pengguna dapat mengklik rekomendasi jurusan atau karir.  
   * Aplikasi akan menampilkan halaman detail yang berisi deskripsi, prospek kerja, dan informasi relevan lainnya dari database.

## **5\. Kebutuhan Teknis (Tech Stack)**

* **Framework:** Next.js 15 (App Router with Turbopack)  
* **Language:** TypeScript  
* **Authentication:** Better Auth  
* **Database:** Drizzle ORM with PostgreSQL  
* **Styling:** Tailwind CSS v4  
* **UI Components:** shadcn/ui (New York style)  
* **Theme System:** next-themes  
* **Icons:** Lucide React  
* **Deployment:** Docker

## **6\. Catatan Tambahan**

* **Desain & UX:** Desain antarmuka (UI) akan mengusung konsep *clean*, modern, dan memotivasi. Pendekatan *mobile-first* dengan **Tailwind CSS v4** menjadi prioritas untuk memastikan aksesibilitas bagi siswa yang mayoritas menggunakan *smartphone*.  
* **Performa:** Pemanfaatan **Turbopack** dari Next.js diharapkan memberikan performa development yang cepat. Arsitektur App Router akan digunakan untuk *data fetching* yang efisien dan *loading state* yang mulus.  
* **Kualitas Konten:** Akurasi pertanyaan tes dan relevansi database jurusan/karir adalah kunci. Perlu ada riset mendalam untuk memastikan konten yang disajikan valid dan bermanfaat.  
* **Dokumentasi Internal:** Dokumentasi kode (menggunakan TSDoc) dan panduan arsitektur  
*   
* 