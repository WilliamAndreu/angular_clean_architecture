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
[![Node.js](https://img.shields.io/badge/Node.js-25.6.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

</div>

---

## Quick Start

Requires [just](https://github.com/casey/just) and [nvm](https://github.com/nvm-sh/nvm).

```bash
just setup    # nvm use + npm install (configures husky automatically)
just start    # Dev server → http://localhost:4200
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
│   ├── assets/                    # Static assets (i18n, icons…)
│   │   └── i18n/en.json
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
│   │   │   ├── remote/
│   │   │   │   ├── dto/           # ProductDto, ProductsDto  (API models)
│   │   │   │   └── products-remote.datasource.imp.ts
│   │   │   ├── local/
│   │   │   │   ├── dbo/           # ProductDbo, ProductsDbo  (local storage models)
│   │   │   │   └── products-local.datasource.imp.ts
│   │   │   └── source/            # Abstract datasource contracts
│   │   └── auth/                  # Same structure (remote/dto, local/dbo)
│   ├── repositories/
│   │   ├── products/
│   │   │   ├── mappers/           # ProductDtoToEntityMapper, ProductDboToEntityMapper
│   │   │   └── products-implementation.repository.ts
│   │   └── auth/
│   │       ├── mappers/           # LoginDtoToEntityMapper, TokensDboToEntityMapper
│   │       └── auth-implementation.repository.ts
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
└── tests/                         # Mirrors src/ structure
    ├── core/
    ├── data/
    ├── domain/
    └── presentation/
```

---

## Key Patterns

### DTO / DBO separation

Each datasource owns its own data model. DTOs and DBOs are never shared between layers:

```
Remote datasource  →  DTO  →  DtoToEntityMapper  →  Entity
Local datasource   →  DBO  →  DboToEntityMapper  →  Entity
```

- **DTO** (`remote/dto/`) — mirrors the API response shape
- **DBO** (`local/dbo/`) — models what is persisted in local storage (e.g. includes `cachedAt`)

This decouples the API contract from the storage format. A change in the server response only affects the DTO and its mapper, never the cached data structure.

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

The local datasource persists a `ProductsDbo` with `cachedAt` embedded and invalidates it after **1 hour**:

```ts
// save
const dbo: ProductsDbo = { ...products, cachedAt: Date.now() };

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

Translation keys live in `src/core/assets/i18n/en.json`. Templates use `| translate` from `@ngx-translate/core`. ViewModels always store the **key**, never the translated string — the UI layer owns the translation concern.

---

## Testing

```bash
just test                       # Run all tests
npm test -- --coverage          # With coverage report
open coverage/index.html        # Open HTML coverage report
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
| `just setup` | Set Node version via nvm + install dependencies |
| `just start` | Dev server at `localhost:4200` |
| `just test` | Run all tests |
| `just coverage` | Run tests with coverage report |
| `just lint` | ESLint |
| `just format` | Prettier (write) |
| `npm run build` | Production build |
| `npm run format:check` | Prettier (check only) |
| `npm run domain` | Generate domain layer scaffold |

---

## Quality

- **ESLint** — enforces `prefer-standalone` and `prefer-inject` as errors, `no-explicit-any` as error
- **Prettier** — auto-formats on commit via lint-staged
- **Husky** — pre-commit hook runs lint-staged automatically after `just setup`
- **lint-staged** — only lints/formats staged files, not the whole project
