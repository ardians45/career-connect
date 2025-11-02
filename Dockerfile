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

# Salin 'standalone' output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# --- PERUBAHAN DIMULAI DI SINI ---

# Salin file-file yang dibutuhkan Drizzle untuk migrasi
# (drizzle-kit akan ada di node_modules karena Langkah 1)
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

# Buat startup script sebagai 'root' agar bisa 'chown'
USER root
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'set -e' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'echo "Menjalankan migrasi database..."' >> /app/startup.sh && \
    # Jalankan migrasi
    echo 'npx drizzle-kit push:pg' >> /app/startup.sh && \
    echo 'Migrasi database selesai!' >> /app/startup.sh && \
    echo '' >> /app/startup.sh && \
    echo 'Memulai server aplikasi...' >> /app/startup.sh && \
    # Jalankan server
    echo 'exec node server.js' >> /app/startup.sh

# Beri izin eksekusi dan ganti pemilik file
RUN chmod +x /app/startup.sh
RUN chown nextjs:nodejs /app/startup.sh

# Ganti kembali ke pengguna non-root
USER nextjs

# --- AKHIR PERUBAHAN ---

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ganti CMD untuk menjalankan skrip startup baru
CMD ["/app/startup.sh"]