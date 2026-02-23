#!/bin/sh
set -e

echo "Waiting for database..."
until pg_isready -h db -p 5432 -U postgres 2>/dev/null; do
  sleep 1
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Running seed..."
npx prisma db seed || true

echo "Starting application..."
exec "$@"
