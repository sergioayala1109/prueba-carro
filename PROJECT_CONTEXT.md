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

Incluye además un **panel de administración de demostración** (ruta `#/admin`) donde la administradora puede editar el catálogo, los datos del negocio y los textos. **No es seguro ni persistente en el servidor**: las credenciales viajan en el código público y los cambios se guardan **solo en el navegador** de quien los hace (ver §6 y §9).

### Stack
- **Vite 6** + **React 19** (JavaScript, sin TypeScript).
- CSS propio: `src/App.css` (vitrina) y `src/components/admin/Admin.css` (panel). Sin frameworks ni librerías de UI.
- **Sin backend.** Los datos por defecto viven en `src/data/`; el panel guarda sus cambios en `localStorage`.
- **Sin router.** La pantalla de administración se elige por el hash de la URL (`#/admin`), leído con `src/hooks/useHash.js`.

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
    ├── main.jsx               # punto de entrada + providers (Datos y Auth)
    ├── index.css              # estilos base / reset
    ├── App.jsx                # elige vitrina o panel según el hash + estado del modal
    ├── App.css                # TODOS los estilos de la vitrina (tema completo)
    ├── assets/                # ⚠️ residuos de plantilla sin usar:
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── hooks/
    │   └── useHash.js         # lee el hash de la URL y detecta la ruta #/admin
    ├── store/
    │   ├── datos.jsx          # DatosProvider/useDatos: negocio, productos y textos + localStorage
    │   └── auth.jsx           # AuthProvider/useAuth: sesión de demostración
    ├── utils/
    │   ├── urls.js            # rutaPublica(): antepone la ruta base a public/
    │   └── whatsapp.js        # enlaceWhatsApp(): arma los enlaces wa.me (con respaldo)
    ├── data/
    │   ├── negocio.js         # marca, misión, dirección, teléfono, redes, horario
    │   ├── productos.js       # 12 productos + categorías (rutas de public/ sin prefijo)
    │   ├── textos.js          # textos del Hero y de "Nosotros"
    │   └── admin.js           # ⚠️ credenciales de demostración (visibles en el código)
    └── components/
        ├── Header.jsx          # logo, navegación, CTA "Escríbenos"
        ├── Hero.jsx            # portada con collage + botones
        ├── Destacados.jsx      # carrusel de productos destacados
        ├── Beneficios.jsx      # banda de 5 beneficios (debajo del carrusel)
        ├── Catalogo.jsx        # grilla + filtros por categoría + buscador
        ├── ProductoCard.jsx    # tarjeta de producto
        ├── ProductoModal.jsx   # ficha de detalle con galería
        ├── Footer.jsx          # misión, información, tienda + enlace "Administrar"
        └── admin/
            ├── Admin.jsx          # muestra el acceso o el panel según la sesión
            ├── AdminLogin.jsx     # pantalla de acceso (demo)
            ├── AdminPanel.jsx     # pestañas, catálogo (filtros, paginación, acciones)
            ├── EditorProducto.jsx # formulario de un producto (con gestión de fotos)
            ├── FormNegocio.jsx    # datos del negocio + textos del Hero/Nosotros
            └── Admin.css          # estilos del panel
```

### Orden de las secciones en la página
`Header` → `Hero` → `Destacados` (carrusel) → `Beneficios` → `Catalogo` → "Nosotros" → `Footer` → `ProductoModal` (solo cuando hay uno activo).

> Con el hash `#/admin`, en vez de la vitrina se muestra la pantalla de administración (acceso o panel). El enlace discreto **"Administrar"** está al final del footer.

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

### Fase 10 — Panel de administración (demostración)
- **Qué se pidió:** un "login para la persona administradora" que permita gestionar el **catálogo completo** (crear, editar, duplicar, eliminar productos) y los **datos del negocio + textos**.
- **Restricción de fondo:** el sitio es estático (Pages no ejecuta servidor) y el repositorio es **público**, así que un login "de verdad" es imposible sin backend. **Decisión del cliente:** implementarlo como **demostración local** (pantalla de acceso + `localStorage`), asumiendo que no protege nada.
- **Estado compartido:** `src/store/datos.jsx` expone `useDatos()` con `negocio`, `textos`, `productos` (ya con la ruta base aplicada), `productosCrudos`, `categorias`, `hayCambios` y las funciones de guardado. Memoriza el estado en un `ref` para poder encadenar guardados sin pisarse.
- **Persistencia:** todo se guarda como un único JSON en `localStorage` (`monsant:datos`), con versión (`VERSION = 1`). La sesión se guarda en `monsant:sesion`.
- **Enrutado sin librerías:** `#/admin` muestra el panel; la vitrina usa sus anclas normales (`#inicio`, `#catalogo`, `#tienda`), que no chocan porque la ruta empieza por `#/`.
- **Refactor de consumidores:** los 8 componentes que importaban datos directamente ahora usan `useDatos()`. Se quitaron los cálculos a nivel de módulo (carrusel, footer, beneficios, hero) para que reaccionen a los cambios.
- **Textos editables:** se movieron a `src/data/textos.js` (Hero y "Nosotros", incluida la cifra destacada). `negocio.descripcion` desapareció: su contenido vive ahora en `textos.hero.descripcion`.
- **Fotos:** el editor acepta una ruta interna (`/productos/...`), una URL externa o **subir un archivo** (se guarda como `data:` URL, con tope de 400 KB por el límite de `localStorage`). `rutaPublica()` ahora **no** toca URLs externas ni `data:`.
- **Robustez:** `enlaceWhatsApp()` (`src/utils/whatsapp.js`) centraliza los enlaces y devuelve `null` si no hay teléfono, así el sitio no se rompe si la administradora lo borra. Si una categoría desaparece, el filtro vuelve a "Todos".
- **Panel:** pestañas "Productos" / "Datos y textos", aviso visible de que es una demo sin seguridad y botón "Restablecer originales" (se deshabilita si no hay cambios).
- **Verificado en el navegador:** acceso con credenciales incorrectas (muestra error) y correctas; alta, edición, duplicado y borrado de productos; edición de teléfono/misión/textos reflejada en la vitrina (los 21 enlaces de WhatsApp cambian de número); restablecer; salir; y **0 errores de consola** en la vitrina y en el panel.

### Fase 11 — Ficha de producto: foto a todo el recuadro + zoom al pasar el mouse
- **Pedido:** que la imagen del detalle "ocupe todo el recuadro" y que al poner el mouse encima haga zoom.
- **Cambio de `object-fit`:** `contain` → `cover` en la foto principal del modal (`.modal__principal img`). La foto ya no deja bandas de fondo vacías.
- **Zoom al hover:** `transition: transform 0.3s` + `.modal__principal:hover img { transform: scale(1.15) }`, recortado por `overflow: hidden` del recuadro. El crecimiento está limitado a `@media (hover: hover) and (pointer: fine)` para no dejar efectos "pegados" en táctil. Cursor `zoom-in`.
- **Lupa:** se probó y luego **se quitó** (commit `6f2101a`): había estado y handlers de puntero en `ProductoModal.jsx` que se eliminaron junto con su CSS (`.modal__lupa`). Si vuelve a pedirse, está documentada en el historial de git.
- **Verificado:** `.modal__imagen` con `object-fit: cover`, `transitionProperty: transform`, sin nodos `.modal__lupa`, media queries `hover`/`pointer` activas y **0 errores de consola**.

### Fase 12 — Filtros en el catálogo del panel
- **Pedido:** en la administración poder **buscar**, **filtrar por categoría** y **filtrar por destacados**.
- **Barra de filtros** (`AdminPanel.jsx` → `.panel__filtros`), visible solo si hay productos:
  - **Buscar** (`input type="search"`): coincide contra nombre, categoría, medidas y descripción, sin distinguir mayúsculas.
  - **Categoría** (select): usa las `categorias` que ya expone el store, siempre arrancando en "Todas".
  - **Destacados** (select): `Todos` / `Solo destacados` / `Sin destacar`.
  - **Contador** (`Mostrando X de Y`) + botón **Limpiar filtros**, que también aparece en el mensaje de "sin resultados".
- **Sin `useMemo`:** la lista es chica, se filtra en cada render con la función `coincide()` (evita avisos de dependencias del linter).
- **Bordes de casos:**
  - Si la categoría elegida desaparece (se borró su último producto), el filtro se comporta como "Todas".
  - Si se guarda un producto que **no pasa los filtros activos**, estos se limpian solos y el aviso lo indica (`Se limpiaron los filtros para mostrarlo.`), para que no parezca que el guardado falló.
- **CSS:** `Admin.css` con `.panel__filtros`, `.panel__filtros-buscar`, `.panel__filtros-contador` y un `@media (max-width: 640px)` que apila los controles. Se agregó `input[type='search']` a los selectores de `.campo input`.
- **Verificado:** búsqueda (2/12 con "agenda"), categoría + destacados combinados (2/12 y ambos con la etiqueta), resultado vacío con botón de limpiar, limpiar vuelve a 12, guardado con filtro activo que limpia los filtros, borrado de prueba y **0 errores de consola**.

### Fase 13 — Paginación del catálogo en el panel
- **Pedido:** paginar la lista de productos del panel, **máximo 10 registros por defecto**.
- **Estado nuevo:** `porPagina` (predefinido 10, con selector 10/20/50) y `pagina`; `POR_PAGINA_PREDETERMINADO` y `OPCIONES_POR_PAGINA` viven fuera del componente.
- **Derivación sin `useEffect`:** `totalPaginas`, `paginaActual = Math.min(Math.max(pagina, 1), totalPaginas)` y `productosPagina` (el `slice` que se mapea en el `<ul>`). El recorte en el render evita forzar `setState` cuando se borran filas o cambian los filtros (páginas que dejan de existir).
- **Reinicios:** cambiar búsqueda/categoría/destacados o pulsar *Limpiar filtros* vuelve a la página 1; cambiar *Por página* también.
- **Botones de página:** si hay 7 páginas o menos se muestran todas; si no, la primera, la última y las vecinas de la actual, con `…` en los saltos. La página activa usa `boton-mini--activo` + `aria-current="page"`.
- **Barra `.panel__paginacion`:** *← Anterior*, números, *Siguiente →*, rango (`11–13 de 13`) y el selector *Por página*. Los botones de página se ocultan si todo cabe en una pantalla, pero **el rango y el selector se quedan visibles** (si no, elegir 20/50 en un catálogo chico esconde la barra y no se puede volver a 10).
- **Creados y duplicados:** un producto nuevo o una copia siempre queda al final del listado, así que se salta a la última página (`paginaFinalDe`) para que se vea recién guardado; si el guardado limpió los filtros, la página se calcula con la lista ya filtrada de nuevo.
- **Verificado:** 12 productos → 2 páginas (`1–10 de 12`, *Anterior* deshabilitado), página 2 con 2 filas y *Siguiente* deshabilitado, filtro a 2 resultados recorta la página pedida a la 1, 20 por página muestra los 12 sin navegación, creación salta a la última página (3 filas, `11–13 de 13`), duplicado igual (4 filas), borrado recorta bien, limpiar vuelve a `1–10 de 12` y **0 errores de consola**.

---

## 6. Decisiones técnicas importantes

1. **Datos centralizados en `src/data/`.** `negocio.js`, `productos.js` y `textos.js` son la única fuente de verdad (los *valores por defecto*). Los componentes **no** los importan directamente: leen del contexto `useDatos()` (`src/store/datos.jsx`), que aplica los cambios guardados desde el panel. Así, editar un dato no requiere tocar componentes y el panel puede sobrescribirlo.
2. **Un solo archivo CSS (`App.css`) con variables de tema.** Sin Tailwind ni styled-components. La paleta se controla desde `:root`.
   - Paleta: `--crema #fdf7fb`, `--crema-2 #f8e9f4`, `--rosa #c06c9f`, `--rosa-oscuro #a1507f`, `--lila #b583d6`, `--ciruela #581868`, `--ciruela-oscuro #3d0f47`, `--verde #4c9e73` (residual), `--tinta #46243f`, `--tinta-suave #856a80`, `--borde #f0ddeb`.
3. **Modelo de imágenes: `imagenes[]`.** La primera es la portada; las demás forman la galería del modal. Si una imagen no existe, se omite; si falla la carga, se muestra el `icono` (emoji) como respaldo.
4. **Estado del modal en `App.jsx`.** `useState(productoActivo)`; se pasa `onVerDetalle` a `Destacados` y `Catalogo`. Un solo modal global en vez de uno por tarjeta.
5. **Objetos de imagen `object-fit: cover` en el modal.** La ficha de producto usa `cover` para que la foto **llene todo el recuadro** (pedido del cliente); al sobrar o faltar, se recorta de forma proporcional. En las tarjetas también se usa `cover` para uniformar la grilla. Ojo: `contain` se abandonó porque dejaba márgenes que no gustaron.
6. **Conversión por WhatsApp.** No hay carrito ni pasarela de pago: todos los CTA llevan a `https://wa.me/56984536000` con un mensaje precargado (`?text=`). Es el canal principal del negocio.
7. **Políticas del footer → WhatsApp.** Como no existen páginas reales de "Plazos de despacho", "Cambios y devoluciones", etc., cada enlace abre WhatsApp con una pregunta precargada (`consulta` en `negocio.js`).
8. **Moneda con `Intl`.** `formatoPrecio()` con `es-CL` y `maximumFractionDigits: 0` (los pesos chilenos no usan decimales).
9. **Imágenes 100 % locales.** Todo vive en `public/productos/`, sin dependencias externas en tiempo de ejecución (más rápido y sin enlaces rotos).
10. **Accesibilidad básica.** `aria-label` en navegaciones, `alt` en imágenes, `role="tablist"` en filtros, cierre del modal con Escape y foco gestionado, `StrictMode` activo.
11. **Ruta base configurable para el despliegue.** En vez de escribir rutas absolutas (`/productos/...`, que se rompen en una subruta), se usa `import.meta.env.BASE_URL` a través de `rutaPublica()` (`src/utils/urls.js`). En desarrollo la base es `/` y en Pages `/prueba-carro/`; el mismo código sirve en ambos entornos sin cambios.
12. **El panel es una demo declarada, no un sistema de seguridad.** Se eligió `localStorage` para no depender de un backend, y se dejó **explícito en la interfaz, en el código (`src/data/admin.js`) y en el footer** que las credenciales son públicas y los cambios son locales. Se prefirió que el usuario y la contraseña se **vean como demo** (con pista en pantalla) antes que dar una falsa sensación de seguridad.
13. **Una sola fuente de verdad también para los textos.** El Hero y "Nosotros" estaban escritos dentro de los componentes; ahora son datos (`textos.js`) editables desde el panel. Lo mismo con las cifras de "Nosotros", que antes eran parte del JSX.
14. **`rutaPublica()` distingue rutas internas de externas.** Solo antepone el prefijo a rutas que empiezan por `/`; deja intactas `http:`, `data:`, `blob:`, `mailto:`, `tel:` y los anclas. Así el panel puede aceptar tanto rutas de `public/` como URLs pegadas o archivos subidos.
15. **Enlaces de WhatsApp centralizados.** `enlaceWhatsApp(negocio, mensaje)` evita repetir el `wa.me/...` en 5 componentes y devuelve `null` cuando no hay teléfono configurado, de modo que la interfaz simplemente oculta el botón en vez de romperse.

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
| 17 | **El panel decía "Datos guardados" pero no cambiaba nada.** Al guardar negocio + textos se hacían **dos `setState` seguidos** en el mismo clic, y el segundo partía del estado anterior: pisaba el primero y revertía el cambio | Una sola actualización **atómica** (`guardar({ negocio, textos })`) y un `ref` con el estado más reciente para poder encadenar guardados |
| 18 | Las URLs externas y las fotos subidas (`data:`) se rompían: `rutaPublica()` les anteponía el prefijo del sitio | `rutaPublica()` ahora solo prefija rutas internas que empiezan por `/` |
| 19 | `npm run lint` fallaba con `Cannot find native binding` (oxlint 1.88): el paquete opcional `@oxlint/binding-darwin-arm64` figuraba en el lock pero **no estaba instalado**, y ni `npm install` ni `npm ci` lo resolvían (bug conocido de npm con dependencias opcionales) | Se instaló a mano sin tocar `package.json`: `npm i --no-save @oxlint/binding-darwin-arm64@1.88.0`. Queda como aviso: si se reinstala `node_modules`, hay que repetirlo |
| 20 | Al eliminar productos, el índice del carrusel podía quedar fuera de rango | Se acota durante el render (`indiceSeguro`) en lugar de con un `useEffect` (además evita un render extra) |

> Nota: `--verde` sigue definido en el CSS y se usa únicamente en el **tilde (✓)** de la lista de detalles del modal. No es un botón; quedó pendiente decidir si se cambia al rosa/lila.

---

## 8. Pendientes para mañana (priorizados)

> 📌 **Imágenes:** por decisión del cliente (17/10/2026) se **mantienen las 48 imágenes actuales** (Pinterest) **sin cambios**. No está pendiente reemplazarlas ni ajustarlas.

### Prioridad alta
1. **Decidir el futuro del panel.** Ahora es una **demo declarada**: cualquiera entra con `admin` / `monsant2026` y sus cambios **no** llegan al sitio publicado. Hay dos caminos:
   - **Darle backend** (Supabase o Firebase) para que la administradora gestione el contenido de verdad, o un CMS que haga *commits* al repositorio.
   - **Ocultarlo**: quitar el enlace "Administrar" del footer y dejar el panel solo como demo.
   Mientras no se decida, conviene saber que **el enlace está visible para cualquier visitante**.
2. **Confirmar los datos reales del negocio:** nombre de marca ("Monsant"), correo, teléfono, horario, redes y dirección. Se pueden editar desde el panel, pero para que queden en el **sitio publicado** hay que hacerlo en `src/data/negocio.js` (o dar el paso a un backend).
3. **Revisar las métricas de la sección "Nosotros"** (`+2,500 pedidos`, `4.9★`, `3-5 días`): son de ejemplo y hay que validarlas o quitarlas. También son editables desde el panel.

### Prioridad media
4. **Optimizar el peso de las imágenes** (solo rendimiento, sin cambiar el contenido visible): hoy pesan ~6 MB en total. Comprimir, evaluar WebP y añadir `loading="lazy"` a las imágenes fuera de pantalla.
5. **Revisar la navegación y el layout en móvil** (el menú `.nav` se oculta bajo 900 px; revisar si hace falta un menú hamburguesa). El panel **no** se ha probado en pantallas chicas.
6. **Revisar el ancla `#tienda`**: hoy el nav "Contacto" del header baja al footer. Confirmar que sea la experiencia deseada.
7. **Decidir el tilde verde** del modal (unificar paleta).
8. **Aviso al salir sin guardar.** En el editor de producto y en el formulario del negocio, salir con cambios sin guardar no avisa ni conserva el borrador.

### Prioridad baja
9. **SEO / metadatos:** Open Graph (imagen para compartir en redes), favicon propio de la marca, `sitemap.xml`, datos estructurados.
10. **Limpieza de residuos de plantilla:** `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg` y el `README.md` genérico.
11. **Sitio publicado** en GitHub Pages (https://sergioayala1109.github.io/prueba-carro/). Pendiente menor: evaluar un **dominio propio** (ej. `monsant.cl`) y revisar el sitio ya en producción.
12. **Pulido de accesibilidad y contraste** (foco visible, textos alternativos más descriptivos).
13. **Si se cambia de navegador o de equipo**, los cambios del panel "desaparecen" (viven en `localStorage`). Explicar eso a quien lo use.

---

## 9. Advertencias y riesgos

- 🔓 **El panel de administración NO es seguro (leer esto).** Es una demostración: el usuario y la contraseña (`admin` / `monsant2026`) están escritos en `src/data/admin.js` y **viajan dentro del JavaScript público**, así que cualquiera puede leerlos (y el repositorio también es público). Además, los cambios se guardan **solo en el `localStorage`** del navegador donde se hacen: **no** cambian lo que ven los visitantes ni quedan registrados en GitHub. La aplicación lo advierte en la pantalla de acceso y en la parte superior del panel. Para una autenticación real hace falta un servicio con backend (Supabase, Firebase) o un CMS que haga commits al repositorio.
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
- **Panel de administración:** se entra por `#/admin` (o con el enlace "Administrar" del footer). Credenciales de demo: `admin` / `monsant2026`. Los datos del panel se guardan en `localStorage` bajo `monsant:datos` y la sesión en `monsant:sesion`; para dejar el navegador limpio, borrar esas dos claves.
- **Lint:** `npm run lint` usa **oxlint**. Si tras reinstalar `node_modules` falla con `Cannot find native binding`, hace falta reinstalar el binario de la plataforma: `npm i --no-save @oxlint/binding-darwin-arm64@1.88.0` (en Mac con Apple Silicon). Quedan 3 avisos inofensivos de *Fast Refresh* en `src/store/`, porque esos archivos exportan a la vez el provider y su hook.
- Para probar el build localmente igual que en producción: `npm run build` y luego `npm run preview` (sirve en `http://localhost:4173/prueba-carro/`).
- El asistente **no puede ver imágenes**: para analizar capturas se usa OCR + extracción de paleta con Swift (`analyze.swift`), y las capturas se muestran al usuario en el panel de revisión.
- Las capturas de pantalla en macOS pueden tener caracteres invisibles (U+202F) en el nombre; referenciarlas con `find`/globs.

### Archivos que se tocan más seguido
| Quiero cambiar… | Sin panel (queda publicado en el sitio) | Con el panel (solo en tu navegador) |
| --- | --- | --- |
| Precios, nombres, descripciones, medidas, categorías | `src/data/productos.js` | pestaña **Productos** |
| Marca, misión, dirección, teléfono, redes, horario | `src/data/negocio.js` | pestaña "Datos y textos" |
| Textos del Hero y de "Nosotros" | `src/data/textos.js` | pestaña "Datos y textos" |
| Colores y tipografías | `:root` en `src/App.css` y `src/components/admin/Admin.css` | — |
| Beneficios (textos fijos) | `src/components/Beneficios.jsx` | — |
| Estructura del footer | `src/components/Footer.jsx` | — |
| Credenciales de la demo | `src/data/admin.js` | — |
