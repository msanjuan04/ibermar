#!/usr/bin/env bash
# Despliega Ibermar a https://ibermar.gnerai.com
# Uso: ./deploy/deploy.sh
set -euo pipefail

HOST="${DEPLOY_HOST:-46.101.185.148}"
USER="${DEPLOY_USER:-root}"
REMOTE="${DEPLOY_PATH:-/var/www/ibermar.gnerai.com}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"
echo "==> Build"
npm run build

echo "==> Rsync → ${USER}@${HOST}:${REMOTE}"
ssh "${USER}@${HOST}" "mkdir -p '$REMOTE'"
rsync -avz --delete "$ROOT/dist/" "${USER}@${HOST}:${REMOTE}/"

echo ""
echo "OK — https://ibermar.gnerai.com"
echo "Si cambias DNS o es la primera vez con SSL:"
echo "  ssh ${USER}@${HOST} 'certbot --nginx -d ibermar.gnerai.com --non-interactive --agree-tos --redirect'"
