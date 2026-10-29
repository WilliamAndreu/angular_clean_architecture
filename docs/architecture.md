# Reglas de arquitectura

## Dependencias permitidas

| Capa         | Puede importar                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| domain       | domain, `rxjs` y `rxjs/operators`                                                                                    |
| core         | core y domain                                                                                                        |
| data         | data, core, entidades y contratos de repositorio de domain; sin DI ni casos de uso                                   |
| data/di      | data, core y domain; solo los archivos `*.di.ts` pueden importar casos de uso                                        |
| presentation | presentation, entidades y casos de uso de domain, utilidades de core para UI y los dos contratos públicos de errores |
| main.ts      | presentación, utilidades de core y paquetes externos para arrancar la aplicación                                     |
| tests        | Todas las capas                                                                                                      |

Los límites de dependencias se definen en [`scripts/eslint/architecture.mjs`](../scripts/eslint/architecture.mjs) con `eslint-plugin-boundaries` y el resolver de TypeScript. ESLint comprueba imports de valor y de tipos, reexports e imports dinámicos, resolviendo tanto rutas relativas como aliases. `no-restricted-imports` complementa las restricciones de paquetes y las reglas `no-restricted-globals` y `no-restricted-properties` bloquean APIs del navegador en dominio y acceso directo a red o almacenamiento en presentación.

`pnpm lint` muestra estas infracciones como errores, también en el editor con la extensión de ESLint. `pnpm architecture` ejecuta ESLint y después verifica las convenciones de nombres mediante `scripts/check-architecture.mjs`; este script ya no duplica las reglas de imports. El hook de pre-commit ejecuta `pnpm architecture` y `pnpm check` incluye estas comprobaciones para CI. En dominio se permiten `rxjs` y `rxjs/operators` para los contratos asíncronos y sus operadores. Los módulos de transporte de RxJS, como `rxjs/ajax`, no se permiten en dominio.

`pnpm test:architecture` prueba la configuración real de ESLint con imports permitidos y prohibidos, incluidos aliases, rutas relativas, tipos, reexports, imports dinámicos y excepciones de ensamblado. Incluye los tipos escritos como `import('…').Tipo` y `typeof import('…')`. Las pruebas exigen el diagnóstico de la regla esperada; un error de sintaxis o una variable sin usar no cuenta como detección del límite.

La suite también ejecuta el CLI de ESLint en un proyecto temporal con archivos reales y la misma configuración. Comprueba que el código válido termina con estado 0 y que introducir una infracción termina con estado 1, incluido un reexport prohibido desde un archivo intermedio. No modifica `src` del proyecto y elimina los archivos temporales al terminar. Para añadir una capa o cambiar una excepción, actualiza la configuración y sus pruebas.

Todos los archivos TypeScript de `src`, incluido `main.ts`, pasan por las reglas. Los archivos fuera de las capas conocidas, salvo el punto de entrada identificado expresamente, producen error. Los imports locales a archivos sin clasificación también producen error. Los imports dinámicos deben utilizar cadenas literales (`import('./vista')`): las rutas calculadas y las plantillas de texto se rechazan porque no permiten comprobar el destino de forma fiable.

Los proveedores y factories se organizan en `data/di/<tema>/*.di.ts`. La configuración de Angular se mantiene en `presentation/app/app.config.ts` y `app.routes.ts`; cada layout conserva su archivo de rutas en su propia carpeta.

La comprobación permite únicamente estas excepciones de ensamblado: `data/di/<tema>/*.di.ts` puede importar casos de uso para construirlos; `app.config.ts` puede registrar proveedores de `data/di` y adaptadores de core; los tres archivos de rutas de la aplicación y sus layouts pueden utilizar guards de core. Las excepciones se identifican por archivo: un helper dentro de `data/di` no adquiere permiso para importar casos de uso, y `app.config.ts` solo puede importar de datos los módulos `*.di.ts`. Las implementaciones de datos no pueden depender de los módulos DI. Los dos contratos públicos de errores se autorizan por su ruta exacta; un helper junto a ellos no se convierte en API pública. Los componentes y ViewModels conservan los límites habituales. Las reglas se ejecutan como parte de `pnpm check`.

## Dominio

Los casos de uso son clases TypeScript que reciben contratos de repositorio por constructor. No utilizan decoradores ni `inject()`. RxJS es una dependencia explícita de los contratos asíncronos del dominio; migrar a Promise implicaría cambiar esos contratos, no los modelos HTTP.

Las reglas de cantidad, stock, acumulación de líneas y cálculo de totales viven en el dominio del carrito. El dominio no sabe si una operación se implementa con DummyJSON, almacenamiento local o un servidor real.

Los errores compartidos se definen en el dominio. Los adaptadores convierten los errores de transporte en estos tipos; los ViewModels publican una clave de mensaje y la plantilla la traduce.

## Datos

Los datasources son responsables de transporte y persistencia. Los repositorios coordinan las fuentes y los mappers convierten DTO/DBO en entidades. El contrato público de los repositorios nunca devuelve modelos de transporte.

La clave de caché del catálogo representa la consulta completa, con valores por defecto normalizados. Los datos locales incluyen timestamp y versión en el prefijo de clave. El adaptador de almacenamiento maneja JSON corrupto y fallos del navegador.

La persistencia simulada de DummyJSON se resuelve exclusivamente en el repositorio del carrito y sus datasources. El borrador local conserva la intención del usuario y distingue un ID simulado de un ID existente en el servidor. Las operaciones fallidas no sobrescriben el borrador anterior.

## Presentación

La vista enlaza entradas y eventos. El ViewModel coordina casos de uso y transforma resultados en estado. El estado contiene signals editables que se exponen al componente como signals de lectura mediante `ViewState`.

Cada ViewModel tiene el ciclo de vida de su componente. Las peticiones del catálogo y el detalle se cancelan antes de iniciar otra consulta; las suscripciones se cancelan al destruir la vista. El detalle observa los cambios del input de ruta con un effect.

Los componentes usan OnPush. Los estados de error de carga y de modificación del carrito se mantienen separados para no ocultar un producto correctamente cargado tras un error al añadirlo.

## Sesión

Los casos de uso delegan en `AuthRepository`. El repositorio implementa restauración y renovación de sesión mediante los datasources. La fecha de expiración del JWT solo sirve para decidir cuándo renovar; no sustituye la validación del servidor.

El interceptor añade el token únicamente a la base de API configurada. Login, refresh y traducciones no reciben credenciales. Una respuesta 401 dispara un refresh compartido y un único reintento. Un rechazo definitivo limpia la sesión; un fallo de red conserva las credenciales para permitir reintentar.

Logout es un caso de uso. Una renovación que termina después de cerrar sesión no puede restablecer las credenciales.

## Añadir una funcionalidad

1. Define sus entidades, reglas y contrato de repositorio en domain.
2. Implementa casos de uso que reciban esos contratos por constructor.
3. Crea DTO/DBO y adaptadores en data; mapea los resultados a entidades.
4. Registra las factories y los proveedores en `data/di`.
5. Crea estado, ViewModel y vista en presentation.
6. Prueba las clases reales, incluyendo errores y comportamiento concurrente cuando exista.
7. Ejecuta `pnpm check`.

## Política de errores

El [manejo de errores](error-handling.md) conserva el contrato y las reglas en domain. Los adaptadores y la observabilidad residen en core; los proveedores se registran en `data/di`. Los ViewModels utilizan `ErrorHandlingSource` como adaptador de presentación y mantienen la decisión de recuperación local. Los repositorios y casos de uso normalizan o traducen errores sin reportarlos.

## Cliente HTTP compartido

`core/http/request.ts` encapsula `HttpClient` y los aspectos comunes de las peticiones. Los datasources de `data/datasource` lo utilizan para definir endpoints y contratos DTO concretos. El dominio no conoce HTTP y la presentación solo consume casos de uso. La comprobación de arquitectura bloquea el acceso de presentación a `core/http`, también mediante aliases o rutas relativas.

## Organización y nomenclatura

En `core` se organiza primero por recurso y después por tema:

- `config/environments`, `config/constants/error` y `config/tokens/error`.
- `models/interfaces/error`, `models/types/error` y `models/types/view`.
- `services/error-handling`, `services/error-reporting` y `services/storage`.
- `handlers/error`, `mappers/error` y `utils/error`.

Los contratos sustituibles son clases abstractas y sus archivos terminan en `.source.ts`, por ejemplo `error-handling.source.ts`. Las implementaciones utilizan `Imp` al final de la clase y `.imp.ts` al final del archivo: `ErrorHandlingServiceImp` en `error-handling.service.imp.ts`.

La misma regla se aplica a las implementaciones de `data`: `ProductsRepositoryImp` en `products.repository.imp.ts`, datasources en `.datasource.imp.ts` y mappers en `.mapper.imp.ts`. Los contratos de repositorio del dominio conservan su nombre sin `Imp`. Los DTO y DBO no se consideran implementaciones.

`data/di` registra cada contrato con su implementación. Los ViewModels pueden importar los contratos autorizados de manejo de errores y notificación, pero no las implementaciones de los servicios ni sus tokens. El handler global captura, reporta y activa `ErrorNotificationSource`; `ErrorNotificationServiceImp` implementa ese contrato sin incluir un componente visual. Cada proyecto decide cómo mostrar los errores.

`pnpm architecture` verifica con ESLint los límites de capas y con el script de nomenclatura las convenciones de contratos `source` e implementaciones de datos.

Los archivos DI se agrupan por tema: `data/di/auth`, `data/di/products`, `data/di/cart` y `data/di/error`. Los nuevos proveedores deben seguir esta misma organización.

## Angular CLI y alias

La propiedad `architect` de `angular.json` configura las tareas de Angular CLI (`build`, `serve`, `test` y `lint`). Los límites de capas se aplican desde ESLint: tanto `ng lint` como `pnpm lint` los ejecutan. `ng build` compila la aplicación; no ejecuta ESLint. La comprobación completa para CI es `pnpm check`.

Los generadores crean componentes en `src/presentation/shared/components`, directivas en `src/core/directives` y pipes en `src/core/pipes`. Para componentes de una funcionalidad, pasa `--path src/presentation/app/views/<funcionalidad>/components`. Las directivas mantienen el sufijo `.directive.ts` y los pipes `.pipe.ts`.

Los alias se definen una sola vez en `tsconfig.json`; `tsconfig.app.json` y `tsconfig.spec.json` los heredan y ESLint usa el mismo archivo para resolverlos. `@models/*` corresponde a las entidades del dominio; `@interfaces/*` corresponde a interfaces de core. Los alias facilitan escribir imports, pero no conceden acceso a una capa: las reglas comprueban el archivo de destino. `src/*` también está sujeto a ellas.

Las pruebas de `scripts/eslint/aliases.test.mjs` verifican el destino de los 16 alias tanto para aplicación como para tests y comprueban sus permisos desde el dominio con ESLint. Si se añade un alias, la prueba exige incluir su cobertura. `@interfaces/*` y `@environments/*` están disponibles aunque actualmente no haya imports que los utilicen.
