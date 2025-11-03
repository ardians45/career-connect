# Tahap 1: Base Image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Tahap 2: Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Tahap 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run db:generate
RUN npx next build

# Tahap 4: Production Runner (Final)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy node_modules dari tahap builder agar Drizzle ORM tersedia untuk migrasi
COPY --from=builder /app/node_modules ./node_modules

# Salin 'standalone' output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Salin file-file yang dibutuhkan Drizzle untuk migrasi
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/db ./db

# Tetap sebagai root untuk membuat startup script
# Buat startup script sebagai 'root' agar bisa 'chown'
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'set -e' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "--- MEMULAI SCRIPT STARTUP (MODE DEBUG) ---"' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "Mencetak variabel... (Jika URL kosong, ini masalahnya)"' >> /app/startup.sh && \
    # Cetak variabel untuk debug, potong sebagian agar aman
    echo 'echo "DATABASE_URL (parsial): ${DATABASE_URL:0:40}..."' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "Mencetak isi folder /app..."' >> /app/startup.sh && \
    # Cetak isi folder untuk memastikan config Drizzle ada
    echo 'ls -la /app' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "Menjalankan migrasi database..."' >> /app/startup.sh && \
    # Jalankan migrasi (lebih cocok untuk production daripada push:pg)
    echo 'npx drizzle-kit migrate' >> /app/startup.sh && \
    echo 'echo "Migrasi database selesai!"' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "Memulai server aplikasi..."' >> /app/startup.sh && \
    # Jalankan server dengan environment variables yang benar
    echo 'HOSTNAME="0.0.0.0" exec node server.js' >> /app/startup.sh

# Beri izin eksekusi dan ganti pemilik file
RUN chmod +x /app/startup.sh

# Ganti kembali ke pengguna non-root
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ganti CMD untuk menjalankan skrip startup baru
CMD ["sh", "-c", "/app/startup.sh"]