<div align="center">

# Angular Clean Architecture

**A production-ready Clean Architecture + MVVM template for Angular**

Built with the latest Angular features: signals, zoneless change detection, and standalone components.

<br/>

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)
[![Node.js](https://img.shields.io/badge/Node.js-≥22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

</div>

---

## Quick Start

```bash
npm install       # Install dependencies
npm start         # Dev server → http://localhost:4200
npm run build     # Production build
```

---

## Architecture

The project enforces a strict **dependency rule**: outer layers depend on inner layers, never the reverse.

```
╔═══════════════════════════════════════════════════════════════╗
║                       PRESENTATION                            ║
║          Components  ·  ViewModels  ·  Signals State          ║
╠═══════════════════════════════════════════════════════════════╣
║                         DOMAIN                                ║
║       Entities  ·  Repositories (abstract)  ·  UseCases       ║
╠═══════════════════════════════════════════════════════════════╣
║                          DATA                                 ║
║       Repositories (impl)  ·  DataSources  ·  Mappers         ║
╠═══════════════════════════════════════════════════════════════╣
║                          CORE                                 ║
║        Interfaces  ·  Utils  ·  Interceptors  ·  Errors       ║
╚═══════════════════════════════════════════════════════════════╝
                  dependency arrow points inward ↑
```

### Folder Structure

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
│   │   │   │   ├── components/    # ProductCard, ProductsGrid, ProductsHeader…
│   │   │   │   └── viewmodel/     # products.state.ts, products.viewmodel.ts
│   │   │   ├── product-detail-view/
│   │   │   │   ├── components/    # ProductGallery, ProductInfo…
│   │   │   │   └── viewmodel/
│   │   │   ├── user-detail-view/
│   │   │   │   ├── components/    # UserProfileCard…
│   │   │   │   └── viewmodel/
│   │   │   └── login-view/
│   │   │       ├── components/    # LoginForm, LoginHeader, LoginFooter
│   │   │       └── viewmodel/
│   │   ├── layouts/               # PublicLayout, PrivateLayout
│   │   ├── app.config.ts          # Root providers (DI, router, i18n)
│   │   └── app.routes.ts
│   └── shared/
│       ├── components/            # DetailHeader (reusable across views)
│       └── modals/
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

---

## Key Patterns

### MVVM per feature

Each view is split into three files with clear responsibilities:

```
views/products-list-view/
├── components/
│   └── product-card/
│       ├── product-card.ts            ← component class
│       ├── product-card.html          ← template
│       └── product-card.scss          ← styles
├── viewmodel/
│   ├── products.state.ts              ← signals (single source of truth)
│   └── products.viewmodel.ts          ← orchestrates usecase calls + state updates
├── products-list-view.ts              ← component class, reads viewState signals
├── products-list-view.html            ← template
└── products-list-view.scss            ← styles
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
    ↓  interceptor maps status code
AppError subclass
    ↓  usecase wraps with business context via catchError
viewmodel stores err.messageKey
    ↓  template renders
{{ error | translate }}
```

| Class | HTTP Status | i18n Key |
|---|:---:|---|
| `NetworkError` | `0` | `errors.network` |
| `UnauthorizedError` | `401` | `errors.unauthorized` |
| `NotFoundError` | `404` | `errors.not_found` |
| `ServerError` | `5xx` | `errors.server` |
| `AppError` | default | `errors.unknown` |

### i18n

Translation keys live in `src/assets/i18n/en.json`. Templates use `| translate` from `@ngx-translate/core`. ViewModels always store the **key**, never the translated string — the UI layer owns the translation concern.

---

## Testing

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
open coverage/index.html    # Open HTML coverage report
```

Tests use **Vitest** (no Jest, no Karma). Pure logic — usecases, mappers, utils — runs without Angular TestBed. Components that need DI use `TestBed.configureTestingModule`.

---

## Code Generation

Generate a complete domain layer (entity, repository, usecases, datasources, mappers, DI provider) interactively:

```bash
npm run domain
```

---

## Commands

| Command | Description |
|---|---|
| `npm start` | Dev server at `localhost:4200` |
| `npm run build` | Production build |
| `npm test` | Run all tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (check only) |
| `npm run domain` | Generate domain layer scaffold |
