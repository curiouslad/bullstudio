#!/bin/sh

set -x

#scripts/wait-for-it.sh ${DATABASE_HOST} -- echo "Database is up - starting web server"

echo "Running database migrations..."
cd ./packages/prisma
pnpx prisma migrate deploy
cd ../..
echo "Starting BullStudio web server..."
node apps/web/server.js