# Use the official Node.js 20 image for better compatibility
FROM node:20-alpine AS base

# Common dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Install dependencies (including dev for migration) ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build the application ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run db:generate
RUN npm run build

# ---- Production image ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Add runtime user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what’s needed for running
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /app/node_modules ./node_modules
COPY drizzle.config.* ./
COPY drizzle ./drizzle
COPY src/db ./src/db

# Run migrations before starting
RUN echo '#!/bin/sh\n\
set -e\n\
if [ -n "$DATABASE_URL" ]; then\n\
  echo "Running database migrations..."\n\
  npx drizzle-kit migrate\n\
  echo "Database migrations completed!"\n\
fi\n\
exec node server.js' > startup.sh && chmod +x startup.sh

USER nextjs

EXPOSE 3000
CMD ["sh", "-c", "./startup.sh"]
