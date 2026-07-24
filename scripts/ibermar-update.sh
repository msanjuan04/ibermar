#!/usr/bin/env bash
# ============================================================
#  Auto-actualización de Ibermar en el droplet.
#  Comprueba GitHub y, si hay cambios, hace pull + build.
#  Se ejecuta por cron cada 2 min (ver más abajo cómo activarlo).
# ============================================================
set -euo pipefail
APPDIR=/var/www/ibermar
cd "$APPDIR"

git fetch --quiet origin main
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[$(date -u +%FT%TZ)] Cambios detectados. Actualizando..."
  git reset --hard origin/main
  npm install --no-audit --no-fund --silent
  npm run build
  echo "[$(date -u +%FT%TZ)] OK -> $(git rev-parse --short @)"
fi

# ------------------------------------------------------------
# CÓMO ACTIVARLO (una sola vez, en el droplet como root):
#
#   curl -s https://raw.githubusercontent.com/msanjuan04/ibermar/main/scripts/ibermar-update.sh \
#     -o /usr/local/bin/ibermar-update.sh
#   chmod +x /usr/local/bin/ibermar-update.sh
#   ( crontab -l 2>/dev/null | grep -v ibermar-update; \
#     echo '*/2 * * * * /usr/local/bin/ibermar-update.sh >> /var/log/ibermar-update.log 2>&1' ) | crontab -
#
# A partir de ahí, cada push a GitHub se publica solo en ~2 min.
# ------------------------------------------------------------
