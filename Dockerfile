# Use the official Node.js 20 image for better compatibility
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production --omit=dev

# Install dev dependencies for build steps
FROM base AS buildDeps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy build dependencies to get dev dependencies needed for build steps
COPY --from=buildDeps /app/node_modules ./node_modules
COPY . .

# Generate Drizzle schema
RUN npm run db:generate

# Build the application
RUN npx next build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose port - Railway will provide the PORT environment variable
EXPOSE $PORT 3000

# Set the hostname to allow external connections
ENV HOSTNAME="0.0.0.0"

# Copy necessary files for migrations (including dev dependencies for drizzle-kit)
COPY --from=buildDeps /app/node_modules ./node_modules
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY db ./db

# Create a startup script that runs migrations before starting the app
RUN echo '#!/bin/sh\nset -e\nif [ -n "$DATABASE_URL" ]; then\n  echo "Running database migrations..."\n  npx drizzle-kit migrate\n  echo "Database migrations completed!"\nfi\nexec node server.js' > startup.sh && chmod +x startup.sh

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["sh", "-c", "./startup.sh"]
