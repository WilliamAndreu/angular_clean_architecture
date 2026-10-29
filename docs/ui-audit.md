# Auditoría de UI: Tailwind first

Auditoría realizada tras la migración de estilos del 28 de octubre de 2026. Se conserva el diseño de Store y la arquitectura existente.

## Resultado

La implementación utiliza utilidades en los 27 templates, tokens semánticos en `src/tailwind.css` y una base global para los controles nativos. No quedan hojas SCSS de componentes, media queries privadas, colores literales ni estilos inline en presentación. `src/styles.scss` conserva únicamente el registro de Manrope local.

| Dimensión de Impeccable | Puntuación | Evidencia y alcance                                                                                                   |
| ----------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Accesibilidad           | 3/4        | axe, nombres accesibles, validación, salto al contenido y galería con teclado; sin prueba con lector de pantalla real |
| Rendimiento             | 3/4        | Build dentro del presupuesto, rutas diferidas e imágenes con proporción reservada; sin métricas de campo              |
| Theming                 | 4/4        | Paleta, roles, escala, dimensiones, breakpoints y movimiento centralizados; cambio de token comprobado en navegador   |
| Responsive              | 3/4        | Siete pantallas/estados en ocho anchuras; toque emulado y zoom del catálogo al 200%; sin dispositivo físico           |
| Integridad              | 4/4        | Sin sistema de estilos paralelo; arquitectura y State/ViewModel conservados                                           |
| **Total**               | **17/20**  | **Buena implementación dentro del alcance verificado**                                                                |

No hay hallazgos abiertos P0/P1/P2 en el alcance revisado. Esto no certifica conformidad WCAG completa.

## Skills y criterios aplicados

- **Impeccable:** auditoría de accesibilidad, rendimiento, theming, responsive e integridad; detector y revisión de capturas.
- **Taste Skill:** inspector real en Chromium/Brave y lint de estilos; criterios de pantallas de aplicación contextualizados para un catálogo.
- **UI UX Pro Max:** mobile first, controles nativos, etiquetas persistentes, targets y feedback; consulta local de sus reglas responsive.
- **Better Accessibility:** navegación nativa, foco visible, nombres y estados accesibles, errores asociados a campos y selección de galería.
- **Better Typography:** Manrope local, inputs móviles de 16px, metadatos de 13px, precios tabulares y texto sin truncamiento irreversible.
- **Emil Design Engineering:** estados de interacción, transiciones limitadas a propiedades concretas y respeto por movimiento reducido.
- **Frontend Design:** coherencia del diseño existente, jerarquía de contenido, fotografía real y ausencia de promesas comerciales inventadas.

## Cambios revisados

| Antes                                                        | Después                                                            | Motivo                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Colores repartidos entre `:root` y SCSS locales              | Paleta semántica en `@theme static`                                | Una fuente para superficies, estados e interacción          |
| Layouts y media queries por componente                       | Utilidades y variantes `xs/sm/md/lg/xl` en HTML                    | Composición mobile first consistente                        |
| Hojas SCSS para estilos y hosts                              | Utilidades en templates y metadata `host`                          | Eliminar el sistema paralelo de CSS                         |
| Nombre `login` compartido por anchura y altura               | `max-w-login` y `min-h-login-min`                                  | Corregir la colisión que estrechaba el acceso en escritorio |
| Paginación inline con márgenes automáticos                   | `flex w-fit mx-auto`                                               | Recuperar el centrado real del botón                        |
| Categorías y valoraciones de 12px                            | Rol `text-caption` de 13px                                         | Mejorar la lectura de los metadatos                         |
| Alturas de línea base fijando variables internas de Tailwind | Tokens de línea aplicados sin bloquear las utilidades tipográficas | Respetar la escala de cada rol                              |

## Verificación

- **155 tests** correctos; lint, Prettier, reglas de arquitectura y build correctos.
- Build inicial de **347.30 kB**; CSS de **26.97 kB** sin comprimir, con una transferencia estimada de **5.47 kB** para el CSS. La fuente es un recurso aparte.
- Build de producción servido localmente y revisado en Brave/Chromium headless.
- Catálogo, detalle, acceso, perfil, carrito, carrito vacío y error de catálogo: **320, 352, 390, 640, 768, 1024, 1280 y 1440 px**. Sin desbordamiento horizontal ni incidencias de axe en esas muestras.
- Flujos: búsqueda, vacío, categoría, orden, paginación, validación, login, alta y modificación del carrito, vaciado, logout, recuperación de red y selección de galería.
- Teclado: salto al contenido, foco del primer campo pendiente y selección de miniaturas. Toque emulado: navegación al detalle y selección de imagen.
- Inputs móviles de 16px; contraste de foco en colores forzados; movimiento reducido sin transición de imagen; cambio del token primario reflejado en la marca.
- Zoom tipográfico al 200% verificado en el catálogo, sin desbordamiento.

Las capturas, árboles de accesibilidad y resultados completos se guardan localmente en `.impeccable/review/tailwind/`, ignorado por Git. La paginación automática se pausa solo en el navegador de captura para fotografiar una página estable; la paginación manual se prueba por separado.

## Avisos de herramientas contrastados

El lint de Taste Skill devuelve **0 FAIL y 0 WARN**. Su inspector de producción conserva tres avisos de contexto: contenido bajo el primer viewport, huecos de imágenes diferidas fuera de la vista y título de 48px. El catálogo es una colección paginada, las imágenes completas se han verificado en las capturas hidratadas y el título conserva la dirección visual del rediseño. No se trasladan automáticamente límites propios de un dashboard al escaparate.

El detector de Impeccable genera 25 avisos de color negro por analizar fragmentos HTML sin el CSS global generado y cinco de imagen por no interpretar `[src]` de Angular. El navegador verifica el texto principal como `rgb(23, 35, 53)` y las imágenes se revisan con datos reales. No son colores ni imágenes rotas de la aplicación final.

## Mejora opcional pendiente

**[P3, rendimiento] Fuente TTF de 164700 bytes.** `src/core/assets/fonts/manrope.ttf` se sirve localmente con `font-display: swap`. Una versión WOFF2 podría reducir su transferencia. No bloquea esta migración y no se ha estimado un ahorro sin medir el archivo convertido. Criterio relacionado: Impeccable optimize y Better Typography.

No se han medido Core Web Vitals de campo ni se ha probado un lector de pantalla o un teléfono físico. Los árboles ARIA, axe y la emulación no sustituyen esas pruebas.
