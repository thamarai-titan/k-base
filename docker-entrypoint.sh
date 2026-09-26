#!/bin/sh
set -e

# Automatically sync database schema with Prisma if enabled
if [ "$AUTO_DB_PUSH" != "false" ]; then
  echo "==> Syncing database schema with Prisma..."
  MAX_RETRIES=20
  COUNT=0
  until pnpm --filter @repo/database db:push --accept-data-loss || [ $COUNT -ge $MAX_RETRIES ]; do
    echo "Waiting for PostgreSQL to be ready ($COUNT/$MAX_RETRIES)..."
    sleep 2
    COUNT=$((COUNT + 1))
  done

  if [ $COUNT -ge $MAX_RETRIES ]; then
    echo "Warning: Database push reached max retries. Proceeding..."
  fi
fi

# Seed database if requested
if [ "$SEED_DATABASE" = "true" ]; then
  echo "==> Seeding initial data..."
  pnpm --filter @repo/database db:seed || echo "Seed command completed or skipped."
fi

exec "$@"
