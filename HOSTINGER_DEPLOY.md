# Hostinger VPS Deployment Guide

This project is a Node.js + TypeScript full-stack app. Deploy it on Hostinger VPS (not static shared hosting) to keep API routes working.

## Quick one-command bootstrap

If your DNS A records already point to VPS IP, run this on the VPS as root:

```bash
DOMAIN=digitaldaari.com WWW_DOMAIN=www.digitaldaari.com REPO_URL=YOUR_REPO_URL bash scripts/bootstrap-hostinger-vps.sh
```

Then edit `.env` with real values and run:

```bash
bash scripts/deploy-vps.sh
```

## 1) Prepare VPS

```bash
ssh root@YOUR_VPS_IP
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git
npm i -g pnpm pm2
```

## 2) Upload project

```bash
mkdir -p /var/www
cd /var/www
git clone YOUR_REPO_URL digital-daari
cd digital-daari
```

## 3) Configure environment variables

```bash
cp .env.example .env
nano .env
```

Set real values for all required variables, especially:
- DATABASE_URL
- JWT_SECRET
- OAUTH_SERVER_URL
- OWNER_OPEN_ID
- CMS_ADMIN_EMAIL
- CMS_ADMIN_PASSWORD
- BUILT_IN_FORGE_API_URL
- BUILT_IN_FORGE_API_KEY

## 4) Build and run with PM2

```bash
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
pm2 startup
```

The app runs on port 3000 by default.

## 5) Configure Nginx reverse proxy

```bash
cp deploy/nginx.digital-daari.conf /etc/nginx/sites-available/digital-daari
ln -s /etc/nginx/sites-available/digital-daari /etc/nginx/sites-enabled/digital-daari
nginx -t
systemctl reload nginx
```

Update `server_name` in the Nginx file before enabling it.

## 6) Point domain to VPS

In Hostinger DNS:
- Add `A` record for `@` to VPS IP
- Add `A` record for `www` to VPS IP

## 7) Enable SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
certbot --nginx -d digitaldaari.com -d www.digitaldaari.com
```

## 8) Verify

- Open `https://yourdomain.com`
- Test app routes and `/api/trpc`
- Check logs if needed:

```bash
pm2 logs digital-daari --lines 200
```

## Notes

- Shared hosting can only host static frontend files, not this backend API.
- CMS admin login is disabled unless `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD` are set in `.env`.
