#!/bin/sh
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations..."
if ! npx prisma migrate deploy; then
  echo "No migration history found, syncing schema with db push..."
  npx prisma db push
fi

echo "Seeding demo data..."
if ! npx prisma db seed; then
  echo "Prisma seed failed. Fix the seed or database state before starting the app." >&2
  exit 1
fi

echo "Starting Next.js development server..."
mkdir -p .next/static .next/cache
npm run dev
