# Angular Architecture

A production-ready **Clean Architecture + MVVM** template for Angular applications. Built from scratch with the latest Angular features: signals, zoneless change detection, and standalone components.

---

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 21.2 |
| TypeScript | ~5.9 |
| RxJS | ~7.8 |
| Vitest | ^4.0 |
| Tailwind CSS | ^4.2 |
| @ngx-translate/core | ^17.0 |
| Node.js | ≥ 22 |
| npm | ≥ 11 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:4200
npm start

# Production build
npm run build
```

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Open HTML coverage report
open coverage/index.html
```

Tests are written with **Vitest** (no Jest, no Karma). Pure logic — usecases, mappers, utils — runs without Angular TestBed. Components that require DI use `TestBed.configureTestingModule`.

---

## Architecture

The project follows **Clean Architecture** with a strict dependency rule: outer layers depend on inner layers, never the reverse.

```
src/
├── core/                          # Framework-agnostic utilities
│   ├── core-interface/            # UseCase, Mapper, ViewState interfaces
│   ├── directives/                # ImgFallbackDirective
│   ├── environments/              # environment.ts / environment.prod.ts
│   ├── errors/                    # AppError, NetworkError, UnauthorizedError…
│   ├── guards/                    # AuthGuard, GuestGuard
│   ├── interceptors/              # publicInterceptor, authInterceptor
│   ├── pipes/                     # PricePipe
│   ├── services/storage/          # StorageSource (abstract) + LocalStorageService
│   └── utils/                     # calcOriginalPrice
│
├── data/                          # Infrastructure layer
│   ├── datasource/
│   │   ├── products/
│   │   │   ├── dto/               # ProductDto, ProductsDto
│   │   │   ├── source/            # Abstract remote + local datasources
│   │   │   ├── remote/            # ProductsRemoteDataSourceImp (HTTP)
│   │   │   └── local/             # ProductsLocalDataSourceImp (cache + TTL)
│   │   └── auth/                  # Same structure for auth
│   ├── repositories/
│   │   └── products/
│   │       ├── mappers/           # ProductDtoToEntityMapper
│   │       └── products-implementation.repository.ts
│   └── di/                        # provideProductsDI(), provideAuthDI()
│
├── domain/                        # Business rules — zero framework dependencies
│   ├── entities/                  # ProductEntity, UserEntity, LoginEntity…
│   ├── repositories/              # Abstract repository contracts
│   └── usecases/                  # GetProductsUseCase, LoginUseCase…
│
├── presentation/                  # UI layer
│   ├── app/
│   │   ├── views/
│   │   │   ├── products-list-view/
│   │   │   ├── product-detail-view/
│   │   │   ├── user-detail-view/
│   │   │   └── login-view/
│   │   ├── layouts/               # PublicLayout, PrivateLayout
│   │   ├── app.config.ts          # Root providers (DI, router, i18n)
│   │   └── app.routes.ts
│   └── shared/
│       └── components/            # DetailHeader (reusable)
│
├── assets/
│   └── i18n/en.json               # Translation strings
│
└── tests/                         # Mirrors src/ structure
    ├── core/
    ├── data/
    ├── domain/
    └── presentation/
```

### Layers at a glance

```
┌──────────────────────────────────────────────────────────┐
│                      Presentation                        │
│          Components · ViewModels · Signals State         │
├──────────────────────────────────────────────────────────┤
│                        Domain                            │
│        Entities · Repositories (abstract) · UseCases     │
├──────────────────────────────────────────────────────────┤
│                         Data                             │
│        Repositories (impl) · DataSources · Mappers       │
├──────────────────────────────────────────────────────────┤
│                         Core                             │
│         Interfaces · Utils · Interceptors · Errors       │
└──────────────────────────────────────────────────────────┘
           dependency arrow always points downward ↑
```

---

## Key Patterns

### MVVM per feature

Each view is split into three files with clear responsibilities:

```
views/products-list-view/
├── viewmodel/
│   ├── products.state.ts        ← signals (single source of truth)
│   └── products.viewmodel.ts    ← orchestrates usecase calls + state updates
└── products-list-view.ts        ← template only, reads viewState signals
```

### Dependency injection per route

Each feature registers its own providers via a `provideXxxDI()` function scoped to the route — no global pollution:

```ts
// private-layout.routes.ts
{
  path: 'products',
  providers: [provideProductsDI()],
  loadComponent: () => import('./views/products-list-view/...')
}
```

### Cache with TTL

The local datasource wraps cached responses with a timestamp and invalidates them after **1 hour**:

```ts
// save
{ data: ProductsDto, cachedAt: Date.now() }

// read — returns null if stale
if (Date.now() - cached.cachedAt > PRODUCTS_CACHE_TTL_MS) return null;
```

### Typed error handling

Errors are typed and translated across three layers:

```
HTTP response
    ↓ interceptor maps status code
AppError subclass (NetworkError | UnauthorizedError | NotFoundError | ServerError)
    ↓ usecase wraps with business context via catchError
viewmodel stores err.messageKey (i18n key string)
    ↓ template renders
{{ error | translate }}
```

| Class | HTTP status | i18n key |
|---|---|---|
| `NetworkError` | 0 (offline) | `errors.network` |
| `UnauthorizedError` | 401 | `errors.unauthorized` |
| `NotFoundError` | 404 | `errors.not_found` |
| `ServerError` | 5xx | `errors.server` |
| `AppError` | default | `errors.unknown` |

### i18n

Translation keys live in `src/assets/i18n/en.json`. Templates use `| translate` from `@ngx-translate/core`. Viewmodels always store the **key**, never the translated string — so the UI layer owns the translation concern.

---

## Code Generation

Generate a complete domain layer (entity, repository, usecases, datasources, mappers, DI provider) interactively:

```bash
npm run domain
```

---

## Other Commands

```bash
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run format:check  # Prettier (check only)
```
