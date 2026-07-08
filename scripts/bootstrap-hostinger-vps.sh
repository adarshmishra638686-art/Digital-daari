#!/usr/bin/env bash
set -euo pipefail

# Usage:
# DOMAIN=example.com WWW_DOMAIN=www.example.com REPO_URL=https://github.com/you/repo.git bash scripts/bootstrap-hostinger-vps.sh

if [ "${EUID}" -ne 0 ]; then
  echo "Run as root"
  exit 1
fi

: "${DOMAIN:?DOMAIN is required}"
: "${WWW_DOMAIN:?WWW_DOMAIN is required}"
: "${REPO_URL:?REPO_URL is required}"

APP_DIR="/var/www/digital-daari"
SITE_CONF="/etc/nginx/sites-available/digital-daari"

echo "[1/9] Installing system dependencies..."
apt update
apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git certbot python3-certbot-nginx
npm i -g pnpm pm2

echo "[2/9] Cloning or updating repository..."
mkdir -p /var/www
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --all --prune
  CURRENT_BRANCH="$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD)"
  git -C "$APP_DIR" pull --ff-only origin "$CURRENT_BRANCH"
else
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

echo "[3/9] Preparing environment file if missing..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
  echo "Update .env values, then run: bash scripts/deploy-vps.sh"
fi

echo "[4/9] Writing nginx site config..."
cat > "$SITE_CONF" <<EOF
server {
    listen 80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

echo "[5/9] Enabling nginx site..."
ln -sf "$SITE_CONF" /etc/nginx/sites-enabled/digital-daari
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl reload nginx

echo "[6/9] Installing dependencies and building app..."
pnpm install --frozen-lockfile
pnpm build

echo "[7/9] Running migrations..."
pnpm db:push

echo "[8/9] Starting app with PM2..."
if pm2 describe digital-daari >/dev/null 2>&1; then
  pm2 restart digital-daari
else
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "[9/9] Requesting SSL certificate..."
certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "admin@${DOMAIN}" || true

echo "Bootstrap complete."
echo "If SSL step failed, ensure DNS A records are pointing to this VPS and rerun certbot."
