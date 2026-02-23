#!/bin/sh
set -e

PRISMA="node ./node_modules/prisma/build/index.js"

echo "Waiting for database..."
until pg_isready -h db -p 5432 -U postgres 2>/dev/null; do
  sleep 1
done

echo "Running migrations..."
$PRISMA migrate deploy

echo "Running seed..."
$PRISMA db seed || true

echo "Starting application..."
exec "$@"
