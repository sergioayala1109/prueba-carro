# PROJECT_CONTEXT.md

> Documento de contexto del proyecto. Se actualizó por última vez el **17 de octubre de 2026**.
> Resume qué se ha hecho, las decisiones técnicas, los errores ya resueltos y lo que queda pendiente.

---

## 1. Resumen

**Nombre del proyecto:** `prueba-carro`
**Marca:** **Monsant · Estudio Creativo**
**Tipo:** Vitrina / catálogo web (sitio de una sola página) para un emprendimiento de papelería y regalos personalizados.
**Ubicación del negocio:** Cruz 395, Constitución, Maule, Chile.
**Estado general:** ✅ **Publicado y en línea.** Compila (`npm run build`), corre en desarrollo sin errores de consola y se despliega automáticamente en GitHub Pages con cada push a `main`.
**Sitio en vivo:** https://sergioayala1109.github.io/prueba-carro/
**Repositorio:** https://github.com/sergioayala1109/prueba-carro (público, rama `main`)

### Qué es
Una landing page de una sola página con estética rosa/lila/ciruela que muestra 12 productos personalizados, permite ver el detalle de cada uno en un modal con galería, y canaliza la conversión hacia **WhatsApp**. Incluye carrusel de destacados, banda de beneficios, catálogo filtrable, sección "nosotros" y footer con la misión.

### Stack
- **Vite 6** + **React 19** (JavaScript, sin TypeScript).
- CSS propio en un único archivo (`src/App.css`), sin frameworks ni librerías de UI.
- Sin backend: todos los datos son estáticos en `src/data/`.

---

## 2. Datos clave del negocio

Definidos en `src/data/negocio.js`:

| Dato | Valor |
| --- | --- |
| Nombre | Monsant |
| Eslogan | Estudio creativo |
| Dirección | Cruz 395, Constitución, Maule, Chile |
| Teléfono | +56 9 8453 6000 (WhatsApp y fijo) |
| Correo | hola@monsant.cl |
| Instagram | [@monsantestudiocreativo](https://www.instagram.com/monsantestudiocreativo) |
| Facebook | [/monsantestudiocreativo](https://www.facebook.com/monsantestudiocreativo) |
| Moneda | CLP, formateada con `Intl.NumberFormat('es-CL')` |

> ⚠️ Varios de estos datos **están por confirmar** (ver Pendientes). El nombre "Monsant" se leyó por OCR de capturas del logo con confianza media: conviene verificarlo.

---

## 3. Cómo ejecutar el proyecto

Requisitos: **Node.js** (probado con v22.2.0) y **npm** (probado con 10.7.0).

```bash
cd /Users/sergioayala/Documents/prueba-carro

npm install        # solo la primera vez
npm run dev        # servidor de desarrollo → http://localhost:5173/prueba-carro/
npm run build      # genera la carpeta dist/ lista para publicar
npm run preview    # sirve la versión de producción → http://localhost:4173/prueba-carro/
npm run lint       # oxlint
```

> Nota: por la ruta base del despliegue (`/prueba-carro/`), **dev y preview ya no responden en `/`**: hay que entrar con la subruta `prueba-carro/`.

Para que el servidor de dev se vea desde otros dispositivos de la red local:

```bash
npm run dev -- --host
```

---

## 4. Estructura de archivos

```
prueba-carro/
├── index.html                 # HTML raíz (título, meta description, favicon)
├── vite.config.js             # config (plugin React + base '/prueba-carro/')
├── package.json               # scripts y dependencias
├── CREDITOS.md                # origen y licencias de las imágenes
├── PROJECT_CONTEXT.md         # este documento
├── README.md                  # genérico de la plantilla Vite (sin usar)
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI: build + despliegue automático a GitHub Pages
├── public/
│   ├── favicon.svg            # sí se usa (index.html)
│   ├── icons.svg              # ⚠️ sin usar (residuo de plantilla)
│   └── productos/             # 48 imágenes (12 productos × 4)
├── dist/                      # build de producción (generado, no versionado)
└── src/
    ├── main.jsx               # punto de entrada (React StrictMode)
    ├── index.css              # estilos base / reset
    ├── App.jsx                # compone las secciones + estado del modal
    ├── App.css                # TODOS los estilos de la vitrina (tema completo)
    ├── assets/                # ⚠️ residuos de plantilla sin usar:
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── utils/
    │   └── urls.js            # rutaPublica(): antepone la ruta base a public/
    ├── data/
    │   ├── negocio.js          # marca, misión, dirección, teléfono, redes, horario
    │   └── productos.js        # 12 productos + categorías
    └── components/
        ├── Header.jsx          # logo, navegación, CTA "Escríbenos"
        ├── Hero.jsx            # portada con collage + botones
        ├── Destacados.jsx      # carrusel de productos destacados
        ├── Beneficios.jsx      # banda de 5 beneficios (debajo del carrusel)
        ├── Catalogo.jsx        # grilla + filtros por categoría + buscador
        ├── ProductoCard.jsx    # tarjeta de producto
        ├── ProductoModal.jsx   # ficha de detalle con galería
        └── Footer.jsx          # misión, información, tienda (dirección → Maps)
```

### Orden de las secciones en la página
`Header` → `Hero` → `Destacados` (carrusel) → `Beneficios` → `Catalogo` → "Nosotros" → `Footer` → `ProductoModal` (solo cuando hay uno activo).

---

## 5. Qué hemos hecho hasta ahora

### Fase 1 — Base del proyecto y vitrina completa
- Se creó el proyecto con Vite + React.
- Se construyó la estructura completa: Header, Hero, Destacados, Catálogo, Nosotros y Footer.
- Se definió la identidad de marca (nombre, eslogan, paleta, tono de comunicación).

### Fase 2 — Modelo de datos de productos
- `src/data/productos.js` con **12 productos** en 5 categorías (`Papelería`, `Impresión`, `Repostería`, `Devocionales`, `Todos`).
- Cada producto tiene: `nombre`, `categoria`, `precio` (y `precioAntes` opcional), `descripcion`, **`medidas`**, **`detalles[]`**, **`imagenes[]`**, `icono` (emoji de respaldo) y `destacado`.

### Fase 3 — Ficha de producto (modal)
- Componente `ProductoModal.jsx`: se abre al hacer clic en la **imagen** de una tarjeta o en el botón "Ver detalles".
- Incluye: imagen principal, **galería con miniaturas**, flechas ‹ ›, contador, navegación con teclado (←/→), medidas, descripción, lista de detalles y precios.
- Se cierra con ✕, tecla **Escape** o clic en el fondo; bloquea el scroll del body mientras está abierto.

### Fase 4 — Banda de beneficios
- `Beneficios.jsx`: 5 tarjetas (Hecho con amor · Diseños únicos · Envíos a todo Chile · Taller en Constitución · ¿Cuál elegir?), con íconos SVG propios.
- Ubicada **debajo del carrusel** y encima del catálogo, replicando una referencia visual del cliente.

### Fase 5 — Footer con misión
- `Footer.jsx` de 3 columnas: **(1)** marca + **misión de Monsant** + redes (IG/FB/WhatsApp) + copyright; **(2)** "Información"; **(3)** "Tienda Monsant" con dirección y horario.
- La **dirección enlaza a Google Maps** (`https://www.google.com/maps/search/?api=1&query=...`) y abre en pestaña nueva.

### Fase 6 — Eliminación de la sección "Contacto"
- A pedido del cliente se eliminó **toda la sección Contacto** (título, datos y tarjeta de mapa) y se borró `Contacto.jsx` + sus estilos.
- Para no dejar enlaces rotos, se redirigieron: el nav "Contacto" del header → ancla `#tienda` del footer; el botón "Cómo llegar" del Hero → Google Maps; el enlace "Tienda física" del footer → Google Maps.

### Fase 7 — Unificación de colores de botones
- Los botones que estaban en **verde WhatsApp** (`boton--wa`) se cambiaron al **mismo rosa de marca** que el botón "Ver productos" (`boton--primario`), incluyendo hover y sombra. Ya no quedan botones verdes.

### Fase 8 — Reemplazo de imágenes (Pinterest)
- Se reemplazaron **las 48 imágenes** por fotos obtenidas de **Pinterest**, buscando por categoría de producto.
- Se respetó la estructura `NN-slug.jpg` (portada) + `-2`, `-3`, `-4` (galería), sin repetir imágenes entre categorías.
- Se documentó todo en `CREDITOS.md` (incluida la advertencia de licencias).

### Fase 9 — Publicación en GitHub Pages
- **Repositorio propio** creado en la carpeta del proyecto (`main`), con `.gitignore` para `node_modules`/`dist`.
- **Ruta base:** `vite.config.js` fija `base: '/prueba-carro/'`, porque Pages publica el sitio en una subruta (`usuario.github.io/prueba-carro/`).
- **Rutas de imágenes con base:** se creó `src/utils/urls.js` con `rutaPublica()`, que antepone `import.meta.env.BASE_URL` a las rutas de `public/`. `productos.js` (48 imágenes) y `Hero.jsx` (collage) pasan por ahí, así que funcionan igual en local y en producción.
- **CI/CD:** `.github/workflows/deploy.yml` compila (`npm ci` + `vite build`) y publica en Pages en cada push a `main` (y también a mano con `workflow_dispatch`).
- **Verificación en producción:** 20 imágenes en portada + 5 de la galería del modal cargando desde `/prueba-carro/productos/...`, CSS aplicado y consola **sin errores**.

---

## 6. Decisiones técnicas importantes

1. **Datos centralizados en `src/data/`.** `negocio.js` y `productos.js` son la única fuente de verdad. Cambiar un teléfono, una dirección o un producto no requiere tocar componentes.
2. **Un solo archivo CSS (`App.css`) con variables de tema.** Sin Tailwind ni styled-components. La paleta se controla desde `:root`.
   - Paleta: `--crema #fdf7fb`, `--crema-2 #f8e9f4`, `--rosa #c06c9f`, `--rosa-oscuro #a1507f`, `--lila #b583d6`, `--ciruela #581868`, `--ciruela-oscuro #3d0f47`, `--verde #4c9e73` (residual), `--tinta #46243f`, `--tinta-suave #856a80`, `--borde #f0ddeb`.
3. **Modelo de imágenes: `imagenes[]`.** La primera es la portada; las demás forman la galería del modal. Si una imagen no existe, se omite; si falla la carga, se muestra el `icono` (emoji) como respaldo.
4. **Estado del modal en `App.jsx`.** `useState(productoActivo)`; se pasa `onVerDetalle` a `Destacados` y `Catalogo`. Un solo modal global en vez de uno por tarjeta.
5. **Objetos de imagen `object-fit: contain` en el modal.** Las fotos tienen orientaciones mixtas (vertical/horizontal/cuadrada); `contain` evita recortes deformes. En las tarjetas se usa recorte (`cover`) para uniformar la grilla.
6. **Conversión por WhatsApp.** No hay carrito ni pasarela de pago: todos los CTA llevan a `https://wa.me/56984536000` con un mensaje precargado (`?text=`). Es el canal principal del negocio.
7. **Políticas del footer → WhatsApp.** Como no existen páginas reales de "Plazos de despacho", "Cambios y devoluciones", etc., cada enlace abre WhatsApp con una pregunta precargada (`consulta` en `negocio.js`).
8. **Moneda con `Intl`.** `formatoPrecio()` con `es-CL` y `maximumFractionDigits: 0` (los pesos chilenos no usan decimales).
9. **Imágenes 100 % locales.** Todo vive en `public/productos/`, sin dependencias externas en tiempo de ejecución (más rápido y sin enlaces rotos).
10. **Accesibilidad básica.** `aria-label` en navegaciones, `alt` en imágenes, `role="tablist"` en filtros, cierre del modal con Escape y foco gestionado, `StrictMode` activo.
11. **Ruta base configurable para el despliegue.** En vez de escribir rutas absolutas (`/productos/...`, que se rompen en una subruta), se usa `import.meta.env.BASE_URL` a través de `rutaPublica()` (`src/utils/urls.js`). En desarrollo la base es `/` y en Pages `/prueba-carro/`; el mismo código sirve en ambos entornos sin cambios.

---

## 7. Errores que ya solucionamos

| # | Problema | Solución aplicada |
| --- | --- | --- |
| 1 | Fotos de orientaciones mixtas se veían deformes en la ficha | `object-fit: contain` en la imagen del modal (y `cover` en las tarjetas) |
| 2 | Al borrar la sección Contacto quedaron enlaces rotos a `#contacto` | Se redirigieron a `#tienda` (footer) y a Google Maps (Hero y footer) |
| 3 | Botones verdes de WhatsApp rompían la paleta | Se unificó `boton--wa` al rosa de marca |
| 4 | La API de Openverse devolvía **429 (rate limit)** | Se cambió a Wikimedia Commons para las imágenes de galería |
| 5 | `upload.wikimedia.org` (originales) devolvía **403** | Se usaron las URLs de miniatura de `thumb.wikimedia.org` |
| 6 | Pinterest bloquea el scraping: **403** en su API interna de búsqueda | Se usó el proxy de lectura `r.jina.ai` para obtener los resultados |
| 7 | Pinterest mostró un **reCAPTCHA/desafío anti-bot** al navegador automatizado | Se abandonó el navegador y se siguió por el proxy |
| 8 | Las imágenes de Pinterest venían en miniatura (236 px) | Se pidió la variante `736x` del mismo archivo en `i.pinimg.com` (misma ruta, mayor resolución) |
| 9 | **Bug de transporte de código:** el carácter `+` se convertía en espacio y rompía los cuantificadores de las expresiones regulares (`+` en regex) | Se reescribió el parser de URLs usando `split`/`indexOf` y se evitaron `+` dentro de regex |
| 10 | El servidor de desarrollo se detenía y la página no cargaba | Se documentó cómo levantarlo (`npm run dev`, en segundo plano) y verificarlo con `curl` |
| 11 | `setTimeout` no existe en el runtime de Code Mode | Se ejecutó la espera dentro del navegador (`browser.evaluate`) en vez del runtime |
| 12 | El modelo no puede "ver" imágenes | Se usa un script de OCR/paleta (`swift analyze.swift`) para leer capturas, y las capturas se muestran al usuario en el panel de revisión |
| 13 | En GitHub Pages las imágenes y el CSS daban **404** (el sitio vive en la subruta `/prueba-carro/`, no en la raíz) | `base: '/prueba-carro/'` en `vite.config.js` + helper `rutaPublica()` para las rutas de `public/` |
| 14 | El run #1 del workflow falló: `Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions` | Faltaba habilitar Pages. Se intentó con `enablement: true` en `configure-pages` (no funcionó) |
| 15 | El run #2 falló: `Create Pages site failed. Resource not accessible by integration` — el `GITHUB_TOKEN` **no puede crear** el sitio de Pages | Se quitó `enablement: true` y se habilitó Pages **a mano** una sola vez (Settings → Pages → Source: GitHub Actions). El run #3 pasó ✅ |
| 16 | Aviso de que Node 20 está deprecado en las acciones | Se subieron `actions/checkout` y `actions/setup-node` a `v5` |

> Nota: `--verde` sigue definido en el CSS y se usa únicamente en el **tilde (✓)** de la lista de detalles del modal. No es un botón; quedó pendiente decidir si se cambia al rosa/lila.

---

## 8. Pendientes para mañana (priorizados)

> 📌 **Imágenes:** por decisión del cliente (17/10/2026) se **mantienen las 48 imágenes actuales** (Pinterest) **sin cambios**. No está pendiente reemplazarlas ni ajustarlas.

### Prioridad alta
1. **Confirmar los datos reales del negocio:** nombre de marca ("Monsant"), correo, teléfono, horario, redes y dirección.
2. **Revisar las métricas de la sección "Nosotros"** (`+2,500 pedidos`, `4.9★`, `3-5 días`): son de ejemplo y hay que validarlas o quitarlas.

### Prioridad media
3. **Optimizar el peso de las imágenes** (solo rendimiento, sin cambiar el contenido visible): hoy pesan ~6 MB en total. Comprimir, evaluar WebP y añadir `loading="lazy"` a las imágenes fuera de pantalla.
4. **Revisar la navegación y el layout en móvil** (el menú `.nav` se oculta bajo 900 px; revisar si hace falta un menú hamburguesa).
5. **Revisar el ancla `#tienda`**: hoy el nav "Contacto" del header baja al footer. Confirmar que sea la experiencia deseada.
6. **Decidir el tilde verde** del modal (unificar paleta).

### Prioridad baja
7. **SEO / metadatos:** Open Graph (imagen para compartir en redes), favicon propio de la marca, `sitemap.xml`, datos estructurados.
8. **Limpieza de residuos de plantilla:** `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg` y el `README.md` genérico.
9. **Sitio publicado** en GitHub Pages (https://sergioayala1109.github.io/prueba-carro/). Pendiente menor: evaluar un **dominio propio** (ej. `monsant.cl`) y revisar el sitio ya en producción.
10. **Pulido de accesibilidad y contraste** (foco visible, textos alternativos más descriptivos).

---

## 9. Advertencias y riesgos

- ⚠️ **Licencias de imágenes (riesgo asumido).** Las 48 fotos provienen de Pinterest y son obras de terceros sin licencia comercial verificada. **Decisión del cliente (17/10/2026): mantener las imágenes actuales sin cambios.** El aviso queda registrado en `CREDITOS.md`. Nota: el repositorio es **público**, así que las imágenes son visibles para cualquiera.
- ⚠️ **Datos y métricas sin verificar.** El nombre de marca, el correo, las redes y las cifras de "Nosotros" son de ejemplo/OCR.
- ℹ️ **El proyecto ya tiene su propio repositorio Git** (`prueba-carro/.git`), independiente del repo mayor de `/Users/sergioayala/Documents` (que contiene archivos personales). Evitar hacer `git add` desde `Documents`.
- ℹ️ **`node_modules/` y `dist/`** quedan excluidos por `.gitignore`: no se suben al repositorio.

---

## 10. Notas de entorno y herramientas

- **Fecha de esta actualización:** 17 de octubre de 2026.
- **Servidor de desarrollo:** `http://localhost:5173/prueba-carro/` (Vite 6.4.4). Ojo: desde que se fijó la ruta base, **ya no responde en `/`**, sino en `/prueba-carro/`.
- **Sitio en producción:** https://sergioayala1109.github.io/prueba-carro/ (GitHub Pages).
- **Repositorio Git:** propio, dentro de la carpeta del proyecto. Remoto `git@github.com:sergioayala1109/prueba-carro.git`, rama `main` (público).
- **Despliegue:** automático. Un `git push` a `main` dispara `.github/workflows/deploy.yml`; tarda ~35 s. Se puede relanzar desde la pestaña **Actions** (`workflow_dispatch`).
- **Pages debe estar habilitado** con *Source: GitHub Actions* en Settings → Pages. El `GITHUB_TOKEN` del workflow **no** puede habilitarlo por sí solo.
- **`dist/`** no se versiona: lo genera el workflow.
- Para probar el build localmente igual que en producción: `npm run build` y luego `npm run preview` (sirve en `http://localhost:4173/prueba-carro/`).
- El asistente **no puede ver imágenes**: para analizar capturas se usa OCR + extracción de paleta con Swift (`analyze.swift`), y las capturas se muestran al usuario en el panel de revisión.
- Las capturas de pantalla en macOS pueden tener caracteres invisibles (U+202F) en el nombre; referenciarlas con `find`/globs.

### Archivos que se tocan más seguido
| Quiero cambiar… | Archivo |
| --- | --- |
| Precios, nombres, descripciones, medidas, categorías | `src/data/productos.js` |
| Marca, misión, dirección, teléfono, redes, horario, políticas | `src/data/negocio.js` |
| Colores y tipografías | `:root` en `src/App.css` |
| Textos del Hero / "Nosotros" | `src/components/Hero.jsx` / `App.jsx` |
| Beneficios | `src/components/Beneficios.jsx` |
| Estructura del footer | `src/components/Footer.jsx` |
