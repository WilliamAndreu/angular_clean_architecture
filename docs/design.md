---
name: Store
description: Sistema visual extraído de la tienda de demostración Angular.
colors:
  primary: '#154fc4'
  primary-hover: '#103e9b'
  ink: '#172335'
  muted: '#576579'
  white: '#ffffff'
  surface: '#f4f6f9'
  line: '#dbe1e9'
  control-border: '#8794a6'
  danger: '#a32332'
  success: '#216341'
typography:
  display:
    fontFamily: 'Manrope, sans-serif'
    fontSize: 'clamp(2rem, 4vw, 3rem)'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'Manrope, sans-serif'
    fontSize: 'clamp(1.875rem, 3vw, 2.5rem)'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: '-0.025em'
  body:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: '0em'
  label:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: '0em'
  price:
    fontFamily: 'Manrope, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 750
    lineHeight: 1.6
    letterSpacing: '0em'
rounded:
  tag: '5px'
  control: '8px'
  notice: '10px'
  card: '12px'
  gallery: '16px'
spacing:
  step-4: '4px'
  step-8: '8px'
  step-12: '12px'
  step-16: '16px'
  step-20: '20px'
  step-24: '24px'
  step-28: '28px'
  step-32: '32px'
  step-40: '40px'
  step-48: '48px'
  step-72: '72px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.white}'
    rounded: '{rounded.control}'
    padding: '0.7rem 1.25rem'
    typography: '{typography.label}'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
  button-secondary:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0.7rem 1.25rem'
  button-danger:
    backgroundColor: '{colors.white}'
    textColor: '{colors.danger}'
    rounded: '{rounded.control}'
  input:
    backgroundColor: '{colors.white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '0.65rem 0.85rem'
  product-card:
    rounded: '{rounded.card}'
    textColor: '{colors.ink}'
  tag:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.muted}'
    rounded: '{rounded.tag}'
    padding: '4px 10px'
---

# Design System: Store

## Overview

**Creative North Star: "El escaparate claro"**

Sistema documentado desde la implementación actual; la metáfora descriptiva «El escaparate claro» resume su tratamiento visual y no representa una dirección aprobada por el usuario. Fondo blanco, fotografía de producto sobre superficies frías y acciones azules hacen legibles las tareas de catálogo, cuenta y carrito.

La identidad se apoya en Manrope local y una bolsa geométrica dibujada con SVG. La interfaz conserva controles nativos y mensajes visibles de demostración: no comunica capacidades de pago o entrega que el producto no ofrece.

**Key Characteristics:**

- Fotografía completa sobre escenarios neutros.
- Jerarquía tipográfica compacta y controles explícitos.
- Separación mediante espacio, líneas y tono.

## Colors

### Primary

Azul de acción: botones principales, enlaces, bolsa de marca y contorno de foco. Su variante profunda identifica hover.

### Neutral

Blanco para el lienzo; superficie fría para fotos, avisos y resumen. Tinta para información principal y gris azulado para contexto. Las líneas suaves dividen contenidos; el borde de control es más oscuro para delimitar campos.

Los colores semánticos peligro y éxito identifican errores, eliminación, confirmación e inventario. No son acentos decorativos. Todos los fondos, bordes y textos semánticos se definen en `src/tailwind.css`, dentro de `@theme static`; los componentes seleccionan esos tokens mediante utilidades.

**The Action Blue Rule.** Reservar el azul principal para identidad, navegación e interacción.

## Typography

**Display Font:** Manrope, sans-serif.
**Body Font:** Manrope, sans-serif; archivo variable local, pesos 200–800 y font-display: swap.

La jerarquía normativa está en el frontmatter: display para títulos de página, headline para la ficha, title para nombres de tarjeta, body para lectura, label para acciones y price para importes de catálogo. El contexto del acceso utiliza un título propio fluido; no se convierte en un segundo sistema tipográfico.

Los títulos equilibran líneas; párrafos usan text-wrap: pretty. Las descripciones limitan la lectura a 65ch. Importes, cantidades y valoraciones emplean números tabulares. Los nombres largos pueden partirse para evitar desbordamiento.

## Layout

El sistema es **Tailwind first y mobile first**. `src/tailwind.css` importa Tailwind, define `@theme static` y contiene únicamente la base de elementos nativos. `src/styles.scss` registra la fuente local y las primitivas compartidas de skeleton y entrada de contenido. Angular carga ambas entradas por separado para que las directivas CSS de Tailwind no pasen por Sass.

Los layouts, variantes responsive, estados y foco viven en las utilidades del HTML. Las clases compartidas `.skeleton`, `.skeleton-group`, `.view-enter` y `.content-enter` se definen en `styles.scss`; cada vista compone su skeleton con utilidades, sin introducir lógica de animación en los ViewModels. No hay hojas SCSS de componentes ni clases CSS de layout paralelas. El host de Angular usa `block min-w-0`. Los comentarios delimitan responsabilidades del HTML y grupos de tokens del CSS.

| Token responsive | Desde | Uso                                                           |
| ---------------- | ----- | ------------------------------------------------------------- |
| xs               | 22rem | Dos columnas de catálogo y acciones compactas                 |
| sm               | 40rem | Identidad, navegación y pares de datos más amplios            |
| md               | 48rem | Márgenes de 48px, tres columnas y acceso en dos columnas      |
| lg               | 64rem | Ficha en dos columnas, resumen lateral y búsqueda en cabecera |
| xl               | 80rem | Cuatro columnas de catálogo                                   |
| 2xl              | 96rem | Umbral disponible para futuras extensiones                    |

El contenedor general usa `max-w-shell` (88.5rem), con padding de 20px y 48px desde md. El acceso usa `max-w-login` (70rem), formulario de hasta 25rem y altura mínima `min-h-login-min`: no reutilizar el nombre de una anchura como token de espaciado para una altura. El resumen tiene 20rem; la lectura, 65ch.

La cuadrícula parte de una columna, pasa a dos en xs, tres en md y cuatro en xl. Ficha y carrito se apilan hasta lg. El aside del carrito solo existe con productos. La búsqueda ocupa su propia fila hasta lg. El acceso presenta el formulario primero en móvil; conserva el panel explicativo a la izquierda desde md.

## Elevation & Depth

No hay box-shadow en la interfaz. Superficies frías, bordes finos y espacio separan los planos; las sombras que pueda contener una fotografía pertenecen a la imagen.

**The Flat Surface Rule.** Expresar profundidad mediante tono y separación, sin añadir sombras de interfaz.

## Shapes

Esquinas suavizadas según los radios normativos: etiquetas compactas, controles, avisos, escenarios de tarjeta y galería. El avatar es circular. La marca es una bolsa geométrica de trazo azul, reutilizada en las cabeceras; los iconos son SVG de línea.

## Components

### Buttons

Acciones sólidas y explícitas: alto mínimo de 46px, borde de 1px y texto de peso 700. Secundarios blancos con borde más marcado; destructivos blancos con texto rojo. Hover cambia el fondo; active desplaza 1px. Deshabilitado reduce opacidad a 0.55.

### Chips

Etiquetas informativas pequeñas sobre superficie fría; no representan filtros interactivos. Descuento en ficha usa superficie verde y texto de éxito; en tarjeta es blanco superpuesto a la foto.

### Cards / Containers

La tarjeta entera es un enlace, sin caja de sombra ni borde exterior. Fotografía cuadrada con producto contenido; título bajo metadatos y precio separado. Hover subraya y colorea el título; con hover real y sin preferencia de movimiento reducido la imagen escala a 1.05. El resumen del carrito usa superficie fría y padding de 28px.

### Inputs / Fields

Inputs y selects nativos, alto mínimo de 46px, borde de 1px, etiquetas visibles y caret azul. Validación combina borde rojo con mensaje asociado. El foco global utiliza outline azul de 3px y offset de 4px; en colores forzados se usa Highlight.

### Navigation

Marca a la izquierda, enlaces visibles con área mínima de 44px; hover azul y subrayado. La búsqueda tiene icono SVG y superficie fría. El enlace de salto se revela al recibir foco.

### Feedback and gallery

Avisos con borde, texto y fondo semánticos. Catálogo, ficha, perfil y carrito tienen componentes skeleton de presentación que respetan las proporciones y los breakpoints del contenido final. Un único `role="status"` anuncia la carga; los bloques decorativos llevan `aria-hidden="true"` y la región de contenido comunica `aria-busy`. El login mantiene su formulario y comunica el envío con texto.

`.view-enter` suaviza la entrada de la página o un aviso mediante opacidad durante 160ms; `.content-enter` inserta contenido desde una opacidad de 0.72 y un desplazamiento de 2px durante 180ms, sin retrasos ni animaciones de altura. La curva proviene del token central de Tailwind. Las tarjetas existentes y las filas del carrito conservan su DOM durante paginación y modificaciones. `.skeleton-group` anima la opacidad del conjunto durante tres ciclos de 1600ms y después queda estático. Con `prefers-reduced-motion`, el skeleton es estático y las entradas usan solo opacidad durante 100ms. No se añaden temporizadores, dependencias ni estados de animación al dominio, los casos de uso o los ViewModels. Miniaturas de galería mantienen su selección de borde de 2px.

## Do's and Don'ts

### Do:

- **Do** conservar la fotografía completa mediante object-fit: contain.
- **Do** mantener etiquetas visibles, foco visible y estados recuperables.
- **Do** conservar los avisos de simulación y ocultar el resumen cuando el carrito está vacío.
- **Do** comentar las secciones HTML y CSS en español.
- **Do** priorizar utilidades de Tailwind y definir nuevos tokens compartidos en `@theme`.
- **Do** usar variantes mobile first y nombres distintos para dimensiones con responsabilidades diferentes.

### Don't:

- **Don't** introducir colores literales, estilos inline o breakpoints privados en componentes.
- **Don't** añadir sombras de interfaz a este sistema plano.
- **Don't** inventar checkout, promesas comerciales ni una audiencia comercial aprobada.
- **Don't** convertir los movimientos de interacción en animación ornamental.
