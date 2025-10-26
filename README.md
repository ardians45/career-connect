# Career Connect

Career Connect adalah platform modern yang dirancang untuk membantu siswa dalam pemilihan jurusan dan karier yang sesuai dengan minat, bakat, dan potensi mereka. Platform ini menyediakan berbagai fitur untuk membantu pengguna dalam mengeksplorasi karier, mengikuti kuis minat karier, serta memperoleh rekomendasi jurusan yang sesuai.

## Teknologi yang Digunakan

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router dengan Turbopack)
- **Bahasa:** TypeScript
- **Otentikasi:** [Better Auth](https://better-auth.com/)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) dengan PostgreSQL
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen UI:** [shadcn/ui](https://ui.shadcn.com/) (gaya New York)
- **Sistem Tema:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Ikon:** [Lucide React](https://lucide.dev/)
- **Visualisasi Data:** [Recharts](https://recharts.org/)

## Prasyarat

Sebelum memulai, pastikan Anda memiliki hal-hal berikut:
- Node.js 18+ terinstal
- Docker dan Docker Compose (untuk pengaturan database)
- Project documents dari [CodeGuide](https://codeguide.dev/) untuk pengalaman pengembangan terbaik

## Cara Memulai

1. **Clone repositori**
   ```bash
   git clone <url-repositori>
   cd career-connect
   ```

2. **Instal dependensi**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Pengaturan Variabel Lingkungan**
   - Salin file `.env.example` ke `.env`:
     ```bash
     cp .env.example .env
     ```
   - Nilai default bekerja dengan pengaturan Docker, ubah sesuai kebutuhan

4. **Jalankan server pengembangan**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

5. **Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.**

## Konfigurasi

### Opsi 1: Pengaturan Docker (Disarankan)
1. **Jalankan PostgreSQL dengan Docker:**
   ```bash
   npm run db:dev
   ```
   Ini akan menjalankan PostgreSQL dalam kontainer Docker dengan kredensial default pada port 5433.

2. **Terapkan skema database:**
   ```bash
   npm run db:push
   ```

### Opsi 2: Pengaturan Database Lokal
1. Buat database PostgreSQL secara lokal
2. Perbarui variabel lingkungan Anda di `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   POSTGRES_DB=nama_database_anda
   POSTGRES_USER=nama_pengguna
   POSTGRES_PASSWORD=kata_sandi
   ```
3. Jalankan migrasi database:
   ```bash
   npm run db:push
   ```

## Variabel Lingkungan

Buat file `.env` di direktori root dengan variabel berikut:

```env
# Konfigurasi Database (default bekerja dengan Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Otentikasi
BETTER_AUTH_SECRET=kunci_rahasia_anda_disini
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Fitur-Fitur

- 🔐 Otentikasi dengan Better Auth (email/kata sandi)
- 🗄️ Database PostgreSQL dengan Drizzle ORM
- 🎨 40+ komponen shadcn/ui (gaya New York)
- 🌙 Mode gelap dengan deteksi preferensi sistem
- 🚀 App Router dengan Server Components dan Turbopack
- 📱 Desain responsif dengan TailwindCSS v4
- 🎯 Operasi database yang aman secara tipe
- 🔒 Pola otentikasi modern
- 🐳 Dukungan penuh Docker dengan build multi-tahap
- 🚀 Konfigurasi deployment siap produksi

## Fitur Utama Career Connect

- 📊 **Kuis Minat Karier**: Kuis interaktif untuk mengevaluasi minat dan bakat pengguna
- 🎯 **Rekomendasi Jurusan**: Rekomendasi jurusan yang disesuaikan berdasarkan hasil kuis
- 💼 **Eksplorasi Karier**: Informasi mendalam tentang berbagai karier dan bidang pekerjaan
- 📈 **Analisis Data**: Visualisasi dan analisis data karier untuk pengambilan keputusan yang lebih baik
- 👥 **Manajemen Profil**: Fitur untuk mengelola informasi profil pengguna
- 📚 **Sumber Daya Pendidikan**: Kumpulan sumber daya untuk membantu dalam pemilihan jurusan

## Struktur Proyek

```
career-connect/
├── app/                        # Halaman Next.js app router
│   ├── api/                    # Endpoint API
│   ├── auth/                   # Halaman otentikasi
│   ├── dashboard/              # Dashboard pengguna
│   ├── careers/                # Eksplorasi karier
│   ├── recommendations/        # Rekomendasi jurusan
│   ├── quiz/                   # Kuis minat karier
│   ├── profile/                # Manajemen profil
│   ├── globals.css            # Gaya global dengan mode gelap
│   ├── layout.tsx             # Layout root dengan provider
│   └── page.tsx               # Halaman utama
├── components/                # Komponen React
│   ├── ui/                    # Komponen shadcn/ui (40+)
│   ├── auth/                  # Komponen otentikasi
│   ├── charts/                # Komponen visualisasi data
│   └── navigation/            # Komponen navigasi
├── db/                        # Konfigurasi database
│   ├── index.ts              # Koneksi database
│   └── schema/               # Skema database
├── docker/                    # Konfigurasi Docker
│   └── postgres/             # PostgreSQL initialization
├── hooks/                     # Hooks React kustom
├── lib/                       # Fungsi utilitas
│   ├── auth.ts               # Konfigurasi Better Auth
│   └── utils.ts              # Utilitas umum
├── types/                     # Definisi tipe TypeScript
├── auth-schema.ts            # Skema otentikasi
├── docker-compose.yml        # Konfigurasi layanan Docker
├── Dockerfile                # Definisi kontainer aplikasi
├── drizzle.config.ts         # Konfigurasi Drizzle
└── components.json           # Konfigurasi shadcn/ui
```

## Integrasi Database

Proyek ini mencakup integrasi database modern:

- **Drizzle ORM** untuk operasi database yang aman secara tipe
- **PostgreSQL** sebagai penyedia database
- **Integrasi Better Auth** dengan adapter Drizzle
- **Migrasi database** dengan Drizzle Kit

## Perintah Pengembangan

### Aplikasi
- `npm run dev` - Jalankan server pengembangan dengan Turbopack
- `npm run build` - Build untuk produksi dengan Turbopack
- `npm start` - Jalankan server produksi
- `npm run lint` - Jalankan ESLint

### Database
- `npm run db:up` - Jalankan PostgreSQL di Docker
- `npm run db:down` - Hentikan kontainer PostgreSQL
- `npm run db:dev` - Jalankan PostgreSQL pengembangan (port 5433)
- `npm run db:dev-down` - Hentikan PostgreSQL pengembangan
- `npm run db:push` - Terapkan perubahan skema ke database
- `npm run db:generate` - Hasilkan file migrasi Drizzle
- `npm run db:studio` - Buka Drizzle Studio (GUI database)
- `npm run db:reset` - Reset database (hapus semua tabel dan buat kembali)

### Styling dengan shadcn/ui
- Dikonfigurasi dengan 40+ komponen shadcn/ui dalam gaya New York
- Komponen sepenuhnya dapat disesuaikan dan menggunakan variabel CSS untuk theming
- Dukungan mode gelap otomatis dengan integrasi next-themes
- Tambahkan komponen baru: `npx shadcn@latest add [nama-komponen]`

### Docker
- `npm run docker:build` - Build image Docker aplikasi
- `npm run docker:up` - Jalankan stack aplikasi lengkap (app + database)
- `npm run docker:down` - Hentikan semua kontainer
- `npm run docker:logs` - Lihat log kontainer
- `npm run docker:clean` - Hentikan kontainer dan bersihkan volume

## Pengembangan Docker

### Memulai dengan Docker
```bash
# Jalankan seluruh stack (disarankan untuk pengguna baru)
npm run docker:up

# Lihat log
npm run docker:logs

# Hentikan semuanya
npm run docker:down
```

### Alur Kerja Pengembangan
```bash
# Opsi 1: Database saja (kembangkan aplikasi secara lokal)
npm run db:up          # Jalankan PostgreSQL
npm run dev            # Jalankan server pengembangan Next.js

# Opsi 2: Stack Docker lengkap
npm run docker:up      # Jalankan aplikasi dan database
```

### Layanan Docker

`docker-compose.yml` mencakup:

- **postgres**: Database PostgreSQL utama (port 5432)
- **postgres-dev**: Database pengembangan (port 5433) - gunakan `--profile dev`
- **app**: Kontainer aplikasi Next.js (port 3000)

### Profil Docker

```bash
# Jalankan database pengembangan di port 5433
docker-compose --profile dev up postgres-dev -d

# Atau gunakan skrip npm
npm run db:dev
```

## Deployment

### Deployment Produksi

#### Opsi 1: Docker Compose (VPS/Server)

1. **Clone dan setup di server Anda:**
   ```bash
   git clone <repositori-anda>
   cd career-connect
   cp .env.example .env
   ```

2. **Konfigurasi variabel lingkungan:**
   ```bash
   # Edit .env dengan nilai produksi
   DATABASE_URL=postgresql://postgres:kata_sandi_amankan@postgres:5432/postgres
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=kata_sandi_amankan
   BETTER_AUTH_SECRET=kunci_rahasia_sangat_amankan
   BETTER_AUTH_URL=https://domainanda.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://domainanda.com
   ```

3. **Deploy:**
   ```bash
   npm run docker:up
   ```

#### Opsi 2: Registry Container (AWS/GCP/Azure)

1. **Build dan push image:**
   ```bash
   # Build image
   docker build -t registry-anda/career-connect:latest .
   
   # Push ke registry
   docker push registry-anda/career-connect:latest
   ```

2. **Deploy menggunakan layanan container dari penyedia cloud Anda**

#### Opsi 3: Vercel + Database Eksternal

1. **Deploy ke Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Tambahkan variabel lingkungan di dashboard Vercel:**
   - `DATABASE_URL`: String koneksi PostgreSQL yang dikelola
   - `BETTER_AUTH_SECRET`: Generate secret yang aman
   - `BETTER_AUTH_URL`: URL deployment Vercel Anda

3. **Setup database:**
   ```bash
   # Terapkan skema ke database yang dikelola Anda
   npm run db:push
   ```

### Variabel Lingkungan untuk Produksi

```env
# Diperlukan untuk produksi
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=generate-kunci-32-karakter-yang-sangat-aman
BETTER_AUTH_URL=https://domainanda.com

# Optimasi opsional
NODE_ENV=production
```

### Pertimbangan Produksi

- **Database**: Gunakan PostgreSQL yang dikelola (AWS RDS, Google Cloud SQL, dll.)
- **Keamanan**: Generate secret yang kuat, gunakan HTTPS
- **Performa**: Aktifkan Next.js output: 'standalone' untuk kontainer yang lebih kecil
- **Monitoring**: Tambahkan logging dan health check
- **Backup**: Backup database secara reguler
- **SSL**: Terminasi SSL di load balancer atau reverse proxy

### Health Check

Aplikasi ini mencakup health check dasar. Anda dapat memperluasnya:

```dockerfile
# Di Dockerfile, tambahkan health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## Integrasi AI Coding Agent

Template starter ini dioptimalkan untuk agen coding AI:

- **Struktur file yang jelas** dan konvensi penamaan
- **Integrasi TypeScript** dengan definisi tipe yang tepat
- **Pola otentikasi modern**
- **Contoh skema database**

## Kontribusi

Kontribusi sangat dipersilakan! Silakan kirim Pull Request jika Anda ingin berkontribusi.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail selengkapnya.
