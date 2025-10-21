# Deployment Career Connect ke Railway

Dokumentasi ini menjelaskan cara mendeploy aplikasi Career Connect ke Railway, platform hosting gratis yang cocok untuk proyek fullstack Anda.

## Prasyarat

1. Repository GitHub publik atau privat
2. Akun Railway (https://railway.app)

## Langkah-langkah Deployment

### 1. Siapkan Repository GitHub
- Pastikan kode Anda di-push ke GitHub
- Pastikan tidak ada file sensitif yang terunggah

### 2. Buat Proyek Baru di Railway
1. Buka [Railway](https://railway.app)
2. Klik "New Project"
3. Pilih "Deploy from GitHub repo"
4. Pilih repository Career Connect Anda

### 3. Konfigurasi Variabel Lingkungan
Setelah proyek dibuat, klik pada proyek dan buka tab "Variables".

Tambahkan variabel-variabel berikut:

#### Variabel Database
- `DATABASE_URL` (akan otomatis terisi saat Anda menambahkan database PostgreSQL dari template)

#### Variabel Autentikasi
- `BETTER_AUTH_SECRET`: Buat secret acak yang kuat (gunakan perintah: `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: URL produksi Anda (contoh: `https://career-connect-xyz.railway.app`)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Sama seperti BETTER_AUTH_URL

#### Variabel PostgreSQL (opsional, jika tidak otomatis terisi)
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### 4. Tambahkan Database PostgreSQL
1. Di dashboard Railway, klik "New" → "Database" → "Provision PostgreSQL"
2. Railway akan menyediakan `DATABASE_URL` secara otomatis

### 5. Konfigurasi Build & Deploy
1. Di halaman proyek, klik pada service aplikasi Anda
2. Di tab "Settings", pastikan build command adalah `npm run build`
3. Di tab "Variables", pastikan semua variabel lingkungan terisi dengan benar

### 6. Deploy Manual (opsional)
Anda dapat memicu deploy manual dengan klik "Deploy Now" di tab "Deployments"

## Konfigurasi Tambahan untuk Fitur Lengkap

### Migrasi Database
Untuk menjalankan migrasi database, tambahkan script deployment berikut:
1. Buka halaman proyek di Railway
2. Klik pada service aplikasi
3. Pergi ke tab "Variables"
4. Tambahkan variable: 
   - KEY: `POST_BUILD_COMMAND`
   - VALUE: `npm run db:migrate`

Atau, Anda bisa menjalankan perintah migrasi secara manual lewat Railway CLI atau console.

## Variabel Lingkungan yang Dibutuhkan

### Production Environment
```bash
DATABASE_URL= # Akan otomatis disediakan oleh Railway PostgreSQL
BETTER_AUTH_SECRET= # Buat dengan perintah: openssl rand -base64 32
BETTER_AUTH_URL= # Contoh: https://career-connect-xyz.railway.app
NEXT_PUBLIC_BETTER_AUTH_URL= # Sama dengan BETTER_AUTH_URL
```

## Solusi Masalah Umum

### 1. Error saat Build
- Pastikan semua dependensi di `package.json` terbaru
- Periksa apakah build tidak melebihi batas waktu Railway (5 menit)

### 2. Error Database Connection
- Pastikan `DATABASE_URL` diisi dengan benar
- Pastikan migrasi database sudah dijalankan

### 3. Error Autentikasi
- Pastikan `BETTER_AUTH_SECRET` diisi dengan random string yang kuat
- Pastikan `BETTER_AUTH_URL` sesuai dengan domain produksi Anda
- `NEXT_PUBLIC_BETTER_AUTH_URL` harus cocok dengan `BETTER_AUTH_URL`

### 4. Issue dengan Next.js API Routes
- Pastikan semua API routes yang menggunakan database memiliki koneksi yang benar
- Pastikan tidak ada hard-coded URL di API routes

## Deployment Script Alternatif

Jika Anda mengalami masalah dengan automatic deployment, Anda juga bisa menggunakan Railway CLI:

1. Instal Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login dan link proyek:
```bash
railway login
railway link
```

3. Set variabel lingkungan:
```bash
railway vars set DATABASE_URL="..."
railway vars set BETTER_AUTH_SECRET="..."
railway vars set BETTER_AUTH_URL="..."
railway vars set NEXT_PUBLIC_BETTER_AUTH_URL="..."
```

4. Deploy:
```bash
railway up
```

## Setelah Deployment

Setelah deployment selesai:
1. Kunjungi URL produksi Anda
2. Uji fitur sign up dan sign in
3. Pastikan sistem tes berfungsi dengan baik
4. Verifikasi bahwa data disimpan ke database dengan benar
5. Uji fitur lain seperti rekomendasi jurusan dan karir

## Meningkatkan Performa

1. **Optimalkan ukuran Docker image** - File `Dockerfile` Anda sudah dioptimalkan untuk production
2. **Gunakan environment variables dengan benar** - Untuk konfigurasi yang berbeda antara development dan production
3. **Aktifkan caching** - Jika diperlukan, untuk meningkatkan kecepatan respon

## Support

Jika Anda mengalami masalah dengan deployment, Anda bisa:
1. Periksa logs di Railway dashboard (tab "Logs")
2. Pastikan semua konfigurasi mengikuti dokumentasi ini
3. Hubungi dukungan Railway jika ada masalah teknis dengan platform