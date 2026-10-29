# Manejo de errores reutilizable

## Responsabilidades

```text
HTTP → HttpErrorMapper → AppError → repositorio/caso de uso → ViewModel → estado local
                               causa original conservada       │
                                                               └→ ErrorHandlingSource → ErrorReporter

Error inesperado sin capturar → Angular ErrorHandler → ErrorHandlingSource
```

`domain/errors` contiene el contrato portable y las categorías; no importa Angular, HTTP, traducciones ni telemetría. `core/services` contiene el coordinador, los contratos y sus implementaciones; `core/models` contiene interfaces y tipos; `core/config` agrupa tokens y constantes. Los adaptadores de Angular y HTTP viven en `core/handlers` y `core/mappers`. `data/di/error/error-handling.di.ts` ensambla las decisiones del proyecto. La presentación consume `ErrorHandlingSource` y decide su estado, sin acceder al transporte del reporte.

El handler global es la última red para errores no manejados. Las operaciones conocidas continúan gestionando sus estados de carga, error y recuperación en el ViewModel. Un error global puede dejar la aplicación en un estado inconsistente. La plantilla no impone componentes visuales: cada proyecto decide cómo presentar sus errores.

## Contrato de dominio

`AppError` conserva los campos existentes `messageKey` y `context`, y añade:

| Campo       | Uso                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `code`      | Código estable para lógica y observabilidad, independiente de nombres minificados y traducciones                             |
| `kind`      | Categoría: validation, authentication, authorization, not-found, conflict, network, timeout, rate-limit, server o unexpected |
| `retryable` | Una repetición manual podría ayudar; nunca inicia reintentos automáticos                                                     |
| `cause`     | Valor original para diagnóstico y encadenamiento; no se muestra ni se reporta automáticamente                                |

Las subclases aportan valores por defecto y aceptan opciones para extenderlas. Los errores específicos, como `InsufficientStockError`, tienen un código propio y una categoría compartida. Una validación de negocio no debe construirse como un `AppError` genérico: el genérico se considera inesperado.

```ts
throw new ConflictError('errors.cart.insufficient_stock', undefined, {
  code: 'CART_INSUFFICIENT_STOCK',
  cause: originalError,
});
```

`toAppError` conserva la identidad de un error tipado. Otros valores lanzados, incluidos strings, objetos, null o undefined, se convierten en `UnexpectedError`; su contenido nunca se utiliza como texto visible. `handleOperation` utiliza `defer` y captura tanto errores síncronos de adaptadores como errores del Observable, conservando la causa.

## HTTP

El interceptor normaliza y relanza. No decide la UI, no reporta y no añade reintentos, de forma que una operación no genera varios informes al atravesar distintas capas.

| Estado                    | Error                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| 0                         | NetworkError; puede ser red, CORS u otro fallo de transporte, no necesariamente falta de internet |
| 400, 422                  | BadRequestError                                                                                   |
| 401                       | UnauthorizedError                                                                                 |
| 403                       | ForbiddenError                                                                                    |
| 404                       | NotFoundError                                                                                     |
| 408, 504                  | TimeoutError                                                                                      |
| 409                       | ConflictError                                                                                     |
| 429                       | RateLimitError                                                                                    |
| Otros 5xx                 | ServerError                                                                                       |
| Resto o valor desconocido | UnexpectedError                                                                                   |

El flujo de refresh y reintento de 401 sigue siendo responsabilidad del interceptor de autenticación. El interceptor exterior conserva el error de dominio resultante.

## Uso en un ViewModel

```ts
private readonly errors = inject(ErrorHandlingSource);

// En el callback error del subscribe:
const failure = this.errors.handle(error, {
  source: 'operation',
  operation: 'products.load',
});
this.state.error.set(failure.messageKey);
this.state.isLoading.set(false);
```

La identificación de operación es estática: `products.load`, `cart.update`, etc. No incluyas URLs, búsquedas, correos, IDs de usuario ni valores de formularios. El proyecto aplica este patrón a catálogo, detalle, login, perfil, carrito y restauración de sesión.

## Adaptar el contrato del backend

Sustituye el mapper en `data/di`, no en el dominio ni en los componentes. Este ejemplo permite un código conocido y delega el resto al mapper por defecto:

```ts
import { HttpErrorResponse } from '@angular/common/http';
import { ConflictError } from 'src/domain/errors/app-error';
import { HttpErrorMapperImp } from 'src/core/mappers/error/http-error.mapper.imp';
import { HttpErrorMapperSource } from 'src/core/mappers/error/source/http-error-mapper.source';

const fallback = new HttpErrorMapperImp();
const projectMapper: HttpErrorMapperSource = {
  map(error: unknown) {
    if (error instanceof HttpErrorResponse && error.status === 409) {
      const body: unknown = error.error;
      if (
        body !== null &&
        typeof body === 'object' &&
        'code' in body &&
        body.code === 'STOCK_EXHAUSTED'
      ) {
        return new ConflictError('errors.cart.insufficient_stock', undefined, {
          code: 'CART_INSUFFICIENT_STOCK',
          cause: error,
        });
      }
    }
    return fallback.map(error);
  },
};
```

No conviertas `response.error.message` directamente en texto visible ni en una clave de traducción. Mapea códigos conocidos a errores locales. DummyJSON no necesita este mapper adicional: el proyecto utiliza el mapper de estados por defecto.

## Adaptar reporte y política

```ts
provideErrorHandling({
  httpMapper: projectMapper,
  shouldReport: (error, context) =>
    context.source !== 'operation' || error.kind === 'server' || error.kind === 'unexpected',
});
```

La política anterior es la política por defecto. Los errores esperados de validación, permisos o red se gestionan localmente; un error no manejado se reporta cualquiera que sea su categoría.

`ErrorReporterSource` ofrece `report(event: ErrorReport): void | Promise<void>`. Implementa este contrato en un adaptador de core o data para conectar tu monitorización y pásalo como `reporter` a `provideErrorHandling`. Si necesita DI, registra `{ provide: ErrorReporterSource, useClass: TuReporter }` después del proveedor común, en `data/di`. No añadas un SDK de monitorización al dominio.

Por defecto el evento contiene únicamente código, categoría, origen, operación y timestamp. Excluye deliberadamente cuerpos HTTP, cabeceras, URLs, stacks, causas y `AppError.context`, que podrían contener información sensible. La causa permanece en el error local para depuración. Si tu monitorización necesita más información, configura `diagnostics: error => ({ errorClass: error.name, release: '1.0.0' })` en `provideErrorHandling`. Esta proyección explícita recibe el error y añade `details` al evento; puedes incorporar ubicaciones de stack previamente saneadas según la política de tu proyecto. No copies el stack, la causa ni el cuerpo HTTP sin revisarlos. La proyección se copia y congela, y si falla se mantiene el informe básico. No hay envíos externos en la implementación por defecto: el reporter escribe el evento seguro en consola.

Se deduplica por identidad de los errores y sus causas, con `WeakSet` y recorrido limitado para soportar causas cíclicas. Dos ocurrencias distintas con el mismo código sí generan dos eventos. Los errores síncronos, rechazos de promesas y recursión síncrona del propio reporter quedan aislados para no romper la operación original. El reporte es best effort: no incorpora colas, persistencia ni reenvío de telemetría.

## Angular y bootstrap

`provideErrorHandling()` registra el `ErrorHandler` global. `provideBrowserGlobalErrorListeners()` sigue recogiendo errores del navegador y promesas no manejadas; no se instalan listeners duplicados. El adaptador reconoce `ErrorEvent` y `PromiseRejectionEvent`.

El handler global captura, reporta y activa `ErrorNotificationSource`, cuya implementación `ErrorNotificationServiceImp` conserva `isVisible` y permite `show()`/`dismiss()`. No hay un componente visual incluido, ni navegación, cierre de sesión o repetición de escrituras. Cada desarrollador decide cómo representar los errores en sus componentes o integrar su propia solución de notificación.

Si falla `bootstrapApplication` antes de disponer del inyector, `reportBootstrapError` genera el mismo evento saneado mediante un reporter opcional. Si configuras un reporter propio para Angular, pásalo también a este fallback si necesitas el mismo destino antes de iniciar la aplicación.

Referencias: [estrategia de errores de Angular](https://angular.dev/best-practices/error-handling) y [ErrorHandler](https://angular.dev/api/core/ErrorHandler).
