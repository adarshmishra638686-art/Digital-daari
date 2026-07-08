#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/digital-daari"

if [ ! -d "$APP_DIR" ]; then
  echo "Project directory not found: $APP_DIR"
  echo "Clone the repository first, then run this script again."
  exit 1
fi

cd "$APP_DIR"

echo "[1/5] Installing dependencies..."
pnpm install --frozen-lockfile

echo "[2/5] Building app..."
pnpm build

echo "[3/5] Running database migrations..."
pnpm db:push

echo "[4/5] Starting app with PM2..."
if pm2 describe digital-daari >/dev/null 2>&1; then
  pm2 restart digital-daari
else
  pm2 start deploy/ecosystem.config.cjs
fi

echo "[5/5] Saving PM2 process list..."
pm2 save

echo "Deployment completed successfully."
