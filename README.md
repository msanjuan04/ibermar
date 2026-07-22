# Ibermar Motor Gallery — Importación de coches de lujo

Web de una **importadora de coches de lujo, exóticos y de colección**: localiza, importa,
homologa, matricula y entrega coches desde cualquier parte del mundo. El diseño está
sintetizado a partir de lo mejor de 5 referencias de lujo (las webs son de marcas/portales,
pero aquí la narrativa es 100% de importación).

## ▶ Cómo arrancarla
```bash
cd carz
npm install     # instala Vite
npm run dev     # servidor de desarrollo con hot-reload → http://localhost:5173
```
Otros comandos:
```bash
npm run build   # genera la versión de producción en dist/
npm run preview # sirve el build de dist/ para revisarlo
```

## Qué se ha tomado de cada referencia (patrones de diseño, no contenido)

| Web | Qué se replicó |
|-----|----------------|
| **hispanosuiza­cars.com** | Preloader con marca + `LOADING`, negro puro, acento rojo, tipografía condensada en mayúsculas con tracking amplio, hero cinematográfico, CTAs `DISCOVER`, sección de herencia/atelier. |
| **mansory.com** | Hero-carrusel a pantalla completa con nombre de modelo + `DISCOVER NOW`, configurador **"Encuentra tu modelo soñado"** (Marca → Modelo → Paquete), grid de creaciones a medida. |
| **brabus.com** | Franja de cifras de rendimiento con contadores animados (CV, 0-100, vel. máx, unidades), estética técnica rojo/negro. |
| **dupontregistry.com** | Cabecera editorial (menú + búsqueda / logo centrado / toggle claro-oscuro + `LIVE AUCTIONS`), buscador y **grid de coches en venta** con precio, cuota, km, badge y `Check availability`, filtros por marca. |
| **scgroup.dk** | Declaración *"Feel More"*, storytelling emocional y el **Universo** por secciones (Leasing, Investment, Colección, Racing, Events). |

> Se han replicado **estructura, layout, tipografía, color e interacciones**.
> Los textos de marca, logos y fotos originales **no** se copian: hay contenido y
> placeholders propios para que los sustituyas.

## Secciones
Preloader → hero-carrusel → franja animada → statement "Feel More" → cifras (contadores) →
**marcas que importamos** → importaciones recientes → configurador de importación → stock →
servicios → **cómo funciona (timeline 4 pasos)** → importación a medida → **testimonios** →
**FAQ (acordeón)** → **formulario de solicitud** → CTA → footer.

## Interacciones
- **Ficha de coche en modal**: clic en cualquier coche (stock o importaciones) abre una ficha
  con foto grande, specs (CV, 0-100, vel. máx, km), precio y CTA que prellena el formulario.
- **Formulario de solicitud** funcional con validación (nombre + email) y estado de éxito.
- **Cursor personalizado** (anillo que sigue el ratón, solo escritorio), **botones magnéticos**,
  **parallax** del hero con el ratón, **barra de progreso de scroll**.
- Botón flotante "Solicitar importación", volver arriba, buscador global, tema claro/oscuro,
  favicon e isotipo propio (coche + ola). Todo respeta `prefers-reduced-motion`.

## Estructura
```
carz/
├── index.html        # marcado de todas las secciones
├── favicon.svg       # isotipo IM (monograma Ibermar)
├── css/styles.css    # sistema de diseño (tokens, tema claro/oscuro, responsive)
└── js/main.js         # preloader, menú, carrusel, configurador, stock, contadores,
                        #  FAQ, botones flotantes, reveals
```

## Accesibilidad &amp; temas
- **Tema claro/oscuro** completo; la cabecera sobre el hero siempre usa texto claro (legible
  en ambos temas). Enlace **"saltar al contenido"**, foco visible, `prefers-reduced-motion`,
  y gestión de foco en el modal.
- **Móvil** pulido: menú fullscreen, botón de hero a ancho completo, rejillas a 1 columna.
- Reveal en **cascada** en las rejillas; enlaces del hero enlazados (sin enlaces muertos).

## Blog, SEO &amp; GEO
- **Blog** en `/blog/` (índice + 4 guías largas orientadas a las keywords más buscadas:
  importar de Alemania, costes/impuestos, homologación, importar de EE. UU.). Build
  multipágina configurado en `vite.config.js`.
- Cada artículo lleva **meta title/description, Open Graph, breadcrumb, FAQ y schema
  JSON-LD** (`Article` + `FAQPage`). Enlazado interno entre artículos y hacia el formulario.
- Home: teaser del blog (sección `#blog`), enlaces en menú y footer, y schema `FAQPage`.
- **SEO técnico**: `public/robots.txt`, `public/sitemap.xml`, canonicals, JSON-LD `AutoDealer`.
- **GEO** (IA): `public/llms.txt` describiendo el negocio para que ChatGPT/Perplexity/Gemini
  lo entiendan y citen; robots.txt permite explícitamente los bots de IA.

## Rendimiento &amp; SEO
- Fotos optimizadas a **JPEG** (todo el set ~1,7 MB en vez de ~13 MB en PNG).
- **Meta social** (Open Graph + Twitter Card) y **datos estructurados** JSON-LD
  (`AutoDealer`) en `index.html` para buscadores y al compartir el enlace.

## Imágenes
Las fotos están en `public/images/` (9 imágenes originales generadas por IA, estilo showroom
oscuro con luces hexagonales, sin copyright). Para cambiarlas, sustituye el archivo
manteniendo el nombre, o edita las rutas:

- **Hero** → `css/styles.css`, reglas `.hero__slide[data-media="1|2|3"] .hero__media`
  (`images/hero-1|2|3.png`). Cada una tiene `background-color` de reserva por si falla.
- **Colección** → `.ccard[data-tone="a…f"] .ccard__media::before` (`images/car-*.png`).
- **Stock** → array `CARS` en `js/main.js`, campo `img` de cada coche.
- **Importación a medida** → `.atelier__media` en el CSS (`images/hero-2.png`).
- **Logo** → isotipo coche + ola en SVG vectorial (`public/logo-mark.svg` + inline en
  cabecera, preloader y footer con `currentColor`, y `public/favicon.svg`). Es una
  recreación vectorial del logo de Ibermar; para el original exacto, coloca tu archivo
  (SVG o PNG transparente) en `public/` y avísame para cablearlo.

> Los `?v=2` en los enlaces de `css/js` de `index.html` son para evitar caché al iterar.

## Personalización rápida
- **Colores/tipos**: variables `:root` al inicio de `styles.css` (`--red`, `--gold`, fuentes…).
- **Modelos del configurador**: objeto `DATA` en `main.js`.
- **Coches en venta**: array `CARS` en `main.js`.

## Nota
Proyecto demostrativo. Marca, precios y datos son ficticios/placeholder.
