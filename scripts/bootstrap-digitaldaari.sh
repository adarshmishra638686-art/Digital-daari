#!/usr/bin/env bash
set -euo pipefail

: "${REPO_URL:?REPO_URL is required}"

DOMAIN=digitaldaari.com \
WWW_DOMAIN=www.digitaldaari.com \
REPO_URL="$REPO_URL" \
bash scripts/bootstrap-hostinger-vps.sh
