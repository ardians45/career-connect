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

# Tetap sebagai root untuk membuat startup script karena user nextjs tidak punya izin
USER root

# Buat startup script yang lebih sederhana dan menunggu database
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'set -e' >> /app/startup.sh && \
    echo 'echo "Menunggu database siap..."' >> /app/startup.sh && \
    echo 'sleep 5' >> /app/startup.sh && \
    echo 'if [ -n "$DATABASE_URL" ]; then' >> /app/startup.sh && \
    echo '  echo "Menjalankan migrasi database..."' >> /app/startup.sh && \
    echo '  npx drizzle-kit migrate' >> /app/startup.sh && \
    echo '  echo "Migrasi database selesai!"' >> /app/startup.sh && \
    echo 'fi' >> /app/startup.sh && \
    echo 'echo "Memulai server aplikasi..."' >> /app/startup.sh && \
    echo 'exec node server.js --hostname 0.0.0.0 --port $PORT' >> /app/startup.sh

# Beri izin eksekusi
RUN chmod +x /app/startup.sh

# Ganti kembali ke pengguna non-root
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Gunakan startup script
CMD ["/app/startup.sh"]