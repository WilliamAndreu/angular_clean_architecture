# Angular Clean Architecture + MVVM

Aplicación de ejemplo con **Angular 22.2.3**, TypeScript 6, pnpm 12, RxJS 7 y DummyJSON. Incluye catálogo avanzado, autenticación y carrito, con reglas de negocio en el dominio y límites de dependencias comprobados automáticamente.

## Arranque

Node 24 LTS (versión fijada en `.nvmrc`) y pnpm 12.15.0. Si no tienes pnpm, puedes instalarlo una vez con `npm install --global pnpm@12.15.0`; los comandos del proyecto utilizan pnpm.

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm start
```

Abre `http://localhost:4200`. `just` es opcional; sus recetas delegan en pnpm.

## Ejemplos completos

| Flujo                        | Comportamiento                                                                                   | Conceptos que demuestra                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Catálogo `/`                 | Búsqueda remota con debounce, categorías, ordenación, paginación, reintentos y caché con TTL     | Cancelación de peticiones obsoletas, DTO/DBO, mappers, estado con signals                              |
| Detalle `/products/:id`      | Cambio reactivo del producto y galería, cantidades y añadir al carrito                           | Reutilización de rutas, validación de IDs y estados independientes                                     |
| Sesión `/login` y `/profile` | Login, restauración, renovación compartida entre peticiones, un solo reintento tras 401 y logout | Casos de uso puros, guards e interceptores como adaptadores                                            |
| Carrito `/cart`              | Carga por usuario, alta, edición de cantidades, eliminación y vaciado                            | Coordinación de repositorios, validación de stock, cálculo de totales y persistencia local por usuario |

Para probar el recorrido completo:

1. Busca un producto, cambia categoría y ordenación, y carga otra página.
2. Inicia sesión con las credenciales de ejemplo de DummyJSON: `emilys` / `emilyspass`.
3. Abre un producto con stock y añade unidades al carrito.
4. En `/cart`, cambia cantidades, intenta superar el stock disponible y elimina productos.
5. Recarga para comprobar que se conserva el borrador local y cierra sesión desde el perfil.

DummyJSON **simula las escrituras y no las persiste en el servidor**. El adaptador conserva un borrador local del carrito por usuario después de cada operación correcta. Los IDs devueltos por un POST simulado no se reutilizan para PUT o DELETE: las siguientes escrituras vuelven a usar POST. Los carritos iniciales existentes en el servidor sí admiten PUT/DELETE simulados. Se muestra esta limitación en la vista del carrito.

La API tampoco ofrece un endpoint combinado de búsqueda y categoría: al combinar ambos filtros, el datasource obtiene la categoría completa, filtra los resultados y después pagina. La búsqueda normal usa `/products/search` en el servidor.

## Arquitectura

```text
presentation ──→ domain ←── data
      │                        │
      └──────→ core ←───────────┘
                  │
                  └──→ domain

data/di registra los contratos y sus implementaciones.
presentation/app/app.config.ts configura el arranque de Angular.
```

- `domain`: entidades, errores, contratos y casos de uso; TypeScript y RxJS, sin Angular, HTTP ni APIs del navegador. Las dependencias se reciben por constructor.
- `data`: datasources HTTP/locales, DTOs, DBOs, mappers e implementaciones de repositorios.
- `presentation`: componentes, ViewModels y estado con signals. Consume casos de uso y modelos del dominio; no importa datasources, repositorios concretos ni almacenamiento.
- `core`: adaptadores compartidos de Angular, guards, interceptores, almacenamiento y utilidades. No se considera independiente del framework.
- `data/di`: proveedores y factories que ensamblan los casos de uso con sus repositorios. La configuración de Angular y las rutas permanecen en `presentation/app` y en sus layouts.

Los repositorios compartidos de sesión, productos y carrito se registran en la raíz para mantener una única instancia durante la navegación. Los ViewModels se registran por componente y cancelan sus suscripciones al destruirse.

Consulta [el contexto y alcance del producto](docs/product.md), [el sistema de diseño](docs/design.md), [las reglas y decisiones de arquitectura](docs/architecture.md) y [los flujos de los ejemplos](docs/examples.md).

## Verificación

```bash
pnpm check             # Arquitectura + lint + formato + tests + build
pnpm architecture      # Límites de importación y acceso a infraestructura
pnpm lint
pnpm format:check
pnpm test              # Vitest, una ejecución
pnpm test:watch
pnpm test:coverage
pnpm build             # Producción
pnpm format            # Formatear src/
```

Las pruebas instancian los casos de uso reales; los repositorios, ViewModels, directivas, interceptores y rutas se prueban con sus adaptadores o dependencias sustituidas. Las pruebas HTTP usan `HttpTestingController` y no dependen de la disponibilidad de DummyJSON.

El build limita el paquete inicial a 500 kB de aviso / 750 kB de error y cada estilo de componente a 8 kB / 12 kB. Husky ejecuta la comprobación de arquitectura y lint-staged antes de los commits. Para clientes gráficos como GitKraken, el hook carga Node desde nvm si no está en el PATH y busca pnpm en `PNPM_HOME` o su directorio habitual de instalación. Otras instalaciones pueden configurar el PATH en `~/.config/husky/init.sh`.

## Errores

El [sistema de errores reutilizable](docs/error-handling.md) separa clasificación de dominio, mapeo HTTP, recuperación local y captura global. Permite sustituir el reporter, la política y el contrato del backend desde composición. Conserva las causas originales y evita reportar datos sensibles o duplicar el mismo error.

## Configuración y alcance

- Base de API: `src/core/config/environments/environment*.ts`.
- Traducciones: `src/core/assets/i18n/en.json`; el loader forma parte de la configuración de traducción.
- Caché del catálogo: una hora; la clave incluye tamaño, desplazamiento, búsqueda, categoría y ordenación. Los formatos antiguos se ignoran.
- Almacenamiento no disponible: fallback en memoria durante la sesión; en ese caso los cambios no sobreviven a una recarga.
- Este proyecto es una demo en navegador con tokens en almacenamiento local. Los guards controlan navegación; la autorización corresponde al servidor.
- Se retiró el comando de generación de dominio porque su implementación no estaba en el repositorio.

La migración desde Angular 21 incluye las migraciones oficiales de Core y CLI, TypeScript 6, ESLint flat config, componentes OnPush y un único lockfile `pnpm-lock.yaml`.

Fuentes: [compatibilidad de Angular](https://angular.dev/reference/versions), [productos](https://dummyjson.com/docs/products), [autenticación](https://dummyjson.com/docs/auth) y [carritos de DummyJSON](https://dummyjson.com/docs/carts).
