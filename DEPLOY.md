# Desplegar Ibermar en ibermar.gnerai.com (IONOS)

Diagnóstico del problema actual:
- **HTTP → 404 en todo** (incluido `/index.html`): los archivos NO están en la carpeta
  que sirve el subdominio (document root vacío o mal apuntado).
- **HTTPS → error SSL**: el subdominio no tiene certificado SSL activado.

El código está bien. Solo falta colocar los archivos compilados y activar SSL.

---

## Opción A — Subida manual (rápida, una vez)

1. Compila:
   ```bash
   npm install
   npm run build
   ```
   Se genera la carpeta `dist/` (también tienes un ZIP listo: `ibermar-dist.zip`).

2. En IONOS: **Dominios y SSL → ibermar.gnerai.com** y mira su **carpeta de destino**
   (ej. `/ibermar/`).

3. Sube el **contenido** de `dist/` (o descomprime `ibermar-dist.zip`) DENTRO de esa carpeta.
   Debe quedar así en la raíz del subdominio:
   ```
   index.html
   favicon.svg  robots.txt  sitemap.xml  llms.txt  logo-mark.svg  hero.mp4
   assets/   blog/   images/
   ```
   ⚠️ El `index.html` va directo en la raíz, NO dentro de una subcarpeta `dist/`.

4. Comprobación: `http://ibermar.gnerai.com/index.html` debe dar **200** (no 404).

5. Activa **SSL**: IONOS → **SSL** → asigna un certificado (Let's Encrypt gratuito) a
   `ibermar.gnerai.com`. Tarda de minutos a un par de horas. Luego `https://` funcionará.

---

## Opción B — Despliegue automático (recomendada, cero FTP manual)

Ya está el workflow en `.github/workflows/deploy.yml`. Con esto, cada `git push` compila y
sube `dist/` solo.

1. Sube el proyecto a un repo de GitHub.
2. En el repo: **Settings → Secrets and variables → Actions** y añade:
   - `FTP_SERVER` — host FTP de IONOS (ej. `access-XXXX.webspace-host.com`)
   - `FTP_USERNAME` — usuario FTP
   - `FTP_PASSWORD` — contraseña FTP
   - `FTP_SERVER_DIR` — carpeta de destino del subdominio (ej. `/ibermar/`)
   (GitHub guarda los secrets cifrados; nadie los ve.)
3. Haz push a `main`. Se despliega solo.
4. Activa el SSL en IONOS (paso 5 de la Opción A) — esto solo se hace una vez.

---

## Opción C — Vercel / Netlify (lo más sencillo, HTTPS automático)

1. Conecta el repo en Vercel o Netlify (detectan Vite; build `npm run build`, salida `dist`).
2. En el panel, añade el dominio `ibermar.gnerai.com`.
3. En el DNS de `gnerai.com`, crea un registro **CNAME**: `ibermar` → el destino que te indique
   Vercel/Netlify. HTTPS se genera automáticamente. Sin FTP, sin certificados manuales.
