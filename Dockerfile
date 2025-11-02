# Tahap 1: Base Image
# Gunakan node:20-alpine untuk image yang ringan
FROM node:20-alpine AS base
WORKDIR /app
# Menambahkan libc6-compat yang sering dibutuhkan oleh
# beberapa paket NPM di Alpine
RUN apk add --no-cache libc6-compat

# Tahap 2: Dependencies
# Instal SEMUA dependensi (termasuk dev) yang dibutuhkan untuk build
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Tahap 3: Builder
# Build aplikasi Next.js Anda
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Hasilkan skema Drizzle (diperlukan sebelum build)
RUN npm run db:generate

# Build aplikasi Next.js
# Ini akan membuat folder .next/standalone
RUN npx next build

# Tahap 4: Production Runner (Final)
# Ini adalah image akhir yang akan dijalankan Railway
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Buat pengguna non-root (nextjs) untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin HANYA file yang diperlukan dari 'standalone' build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Gunakan pengguna non-root
USER nextjs

# Expose port (Railway akan otomatis menggunakan variabel PORT)
EXPOSE 3000
ENV PORT=3000

# Set hostname agar bisa diakses dari luar container
ENV HOSTNAME="0.0.0.0"

# Perintah untuk menjalankan server
# (server.js dibuat otomatis oleh 'output: standalone')
CMD ["node", "server.js"]