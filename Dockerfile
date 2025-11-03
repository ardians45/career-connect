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

# Jalankan migrasi database sebelum memulai server
RUN npx drizzle-kit migrate

# Ganti kembali ke pengguna non-root
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan server langsung tanpa startup script tambahan
CMD ["node", "server.js"]