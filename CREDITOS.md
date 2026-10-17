# Créditos de imágenes

Las fotos de este proyecto son **imágenes de ejemplo** y se guardan localmente en
`public/productos/`.

> ⚠️ **Aviso importante de licencias.** Las 48 fotos actuales se obtuvieron de
> búsquedas en [Pinterest](https://www.pinterest.com) y se guardan solo como
> **material de demostración**. Son obras de terceros protegidas por derechos de
> autor y **no** tienen una licencia libre verificada: subirlas a un sitio
> comercial puede infringir los derechos de sus autores y los términos de uso de
> Pinterest. Antes de publicar la tienda, **reemplázalas por fotos propias o por
> imágenes con licencia que permita uso comercial** (por ejemplo de
> [Unsplash](https://unsplash.com), [Pexels](https://pexels.com),
> [Pixabay](https://pixabay.com) o material propio).

## Origen

- Cada producto tiene 4 imágenes: portada (`NN-slug.jpg`) y galería
  (`NN-slug-2.jpg`, `-3.jpg`, `-4.jpg`).
- Se seleccionaron a partir de una búsqueda en Pinterest por categoría, y se
  descargaron en alta resolución desde `i.pinimg.com` (variante `736x`).

## Búsquedas usadas por producto

| Producto | Búsqueda en Pinterest |
| --- | --- |
| 01-agenda-personalizada | agenda personalizada |
| 02-planner-semanal | planner semanal |
| 03-tarjetas-presentacion | tarjetas de presentacion |
| 04-cake-topper | cake topper |
| 05-devocional-femenino | devocional femenino |
| 06-devocional-infantil | devocional infantil |
| 07-cuaderno-punteado | bullet journal |
| 08-stickers | stickers personalizados |
| 09-invitaciones-boda | invitaciones de boda |
| 10-etiquetas-regalo | etiquetas de regalo |
| 11-portavasos | portavasos |
| 12-agenda-oraciones | agenda de oraciones |

> Las imágenes anteriores (Openverse / Wikimedia Commons, con licencias CC) se
> respaldaron antes del cambio. Si necesitas volver a ellas, están en el respaldo
> temporal de la sesión.

## Cómo reemplazar las imágenes

1. Copia tus fotos a `public/productos/` (formato `.jpg`, idealmente 1000 px de
   ancho).
2. Edita el arreglo `imagenes` de cada producto en `src/data/productos.js`. La
   primera imagen es la portada; las demás aparecen en la galería de la ficha:

   ```js
   {
     id: 1,
     nombre: 'Agenda personalizada A5',
     medidas: 'A5 · 14,8 × 21 cm',
     detalles: ['200 hojas bond de 90 g', 'Encuadernación artesanal'],
     imagenes: [
       '/productos/mi-agenda.jpg',      // portada
       '/productos/mi-agenda-2.jpg',    // galería
       '/productos/mi-agenda-3.jpg',
     ],
     icono: '📔', // respaldo si una imagen no carga
     // ...
   }
   ```

El campo `icono` (emoji) se muestra automáticamente si una imagen no carga. Si
una foto de la galería no existe, simplemente se omite de la ficha.
