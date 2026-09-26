# syntax=docker/dockerfile:1

# -------------------------------------------------------------
# Base Stage: Node.js 24 & pnpm package manager
# -------------------------------------------------------------
FROM node:24-slim AS base
WORKDIR /app

# Install system dependencies (OpenSSL is required by Prisma)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install pnpm matching repo version
RUN npm install -g pnpm@11.25.0

# -------------------------------------------------------------
# Dependencies Stage: Cache and install workspace packages
# -------------------------------------------------------------
FROM base AS dependencies
WORKDIR /app

# Copy root configurations and workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/database/prisma ./packages/database/prisma
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies using frozen lockfile
RUN pnpm install --frozen-lockfile

# -------------------------------------------------------------
# Builder Stage: Generate Prisma Client & build workspace
# -------------------------------------------------------------
FROM dependencies AS builder
WORKDIR /app

# Copy entire source tree
COPY . .

# Generate Prisma Client
RUN pnpm --filter @repo/database db:generate

# Build frontend and backend
ARG NEXT_PUBLIC_API_URL=http://localhost:5001/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN pnpm build

# -------------------------------------------------------------
# Backend Production Stage
# -------------------------------------------------------------
FROM base AS backend
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

COPY --from=builder /app ./
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5001

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "--filter", "backend", "start"]

# -------------------------------------------------------------
# Web Production Stage (Default if no target specified)
# -------------------------------------------------------------
FROM base AS web
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
