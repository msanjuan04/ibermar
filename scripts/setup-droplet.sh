#!/usr/bin/env bash
# ============================================================
#  Ibermar Motor Gallery — despliegue en un droplet (Ubuntu)
#  Ejecutar como root en el droplet:  bash setup-droplet.sh
#  REQUISITO PREVIO: el DNS de ibermar.gnerai.com debe apuntar
#  (registro A) a la IP de este droplet ANTES de ejecutar.
# ============================================================
set -euo pipefail

DOMAIN="${DOMAIN:-ibermar.gnerai.com}"
EMAIL="${EMAIL:-marcsanjuansard@gmail.com}"   # Let's Encrypt (avisos de caducidad del SSL)
REPO="${REPO:-https://github.com/msanjuan04/ibermar.git}"
APPDIR="${APPDIR:-/var/www/ibermar}"

echo ">> [1/5] Instalando nginx, git, node y certbot..."
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a NEEDRESTART_SUSPEND=1
apt-get update -y
apt-get install -y nginx git curl
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
apt-get install -y certbot python3-certbot-nginx

echo ">> [2/5] Clonando y compilando el sitio..."
mkdir -p /var/www
if [ -d "$APPDIR/.git" ]; then
  git -C "$APPDIR" pull --ff-only
else
  git clone "$REPO" "$APPDIR"
fi
cd "$APPDIR"
npm install --no-audit --no-fund
npm run build

echo ">> [3/5] Configurando nginx (root -> dist)..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $APPDIR/dist;
    index index.html;

    location / { try_files \$uri \$uri/ =404; }

    location ~* \.(?:jpg|jpeg|png|webp|svg|mp4|css|js|woff2?)\$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ">> [4/5] Firewall (si ufw está activo)..."
ufw allow 'Nginx Full' >/dev/null 2>&1 || true

echo ">> [5/5] Emitiendo certificado SSL (HTTPS) con Let's Encrypt..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect \
  || echo "!! Certbot falló. Comprueba que el DNS (registro A) de $DOMAIN ya apunta a la IP de este droplet y reejecuta: certbot --nginx -d $DOMAIN"

echo ""
echo ">> LISTO. Visita: https://$DOMAIN"
echo ">> Para actualizar en el futuro:  cd $APPDIR && git pull && npm run build"
