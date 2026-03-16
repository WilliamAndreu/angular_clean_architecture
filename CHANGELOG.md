# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [2.3.1] — 2026-03-16

### Added
- **Domain errors** — `InvalidCredentialsError`, `SessionExpiredError` (`src/domain/errors/auth/`) and `ProductNotFoundError` (`src/domain/errors/products/`) as business-specific `AppError` subclasses
- **`BadRequestError`** added to `src/core/errors/app-error.ts` — covers HTTP 400 responses (e.g. DummyJSON returns 400 for invalid login credentials)
- **HTTP 400 → `BadRequestError`** mapping in `publicInterceptor`
- **`just lint-fix`** command in justfile — runs `ng lint --fix`
- **i18n keys** — `errors.auth.invalid_credentials`, `errors.auth.session_expired`, `errors.products.not_found`

### Changed
- **Login form** — migrated from template-driven forms to Reactive Forms (`FormBuilder`, `ReactiveFormsModule`, `Validators`); submit now emits typed `LoginFormValue` instead of raw `SubmitEvent`
- **Repositories `catchError`** — replaced broken `instanceof HttpErrorResponse` checks (dead code after interceptor conversion) with `instanceof AppError` subclass checks; repositories now correctly remap core errors to domain-specific errors
- **UseCases `catchError`** — now pass `AppError` instances through unchanged; only wrap unexpected non-`AppError` errors with a generic fallback key
- **`just start` removed** from justfile — use `npm start` directly
- **README** — updated Quick Start, commands table (`npm start`, `just lint-fix`), folder structure (`domain/errors/`), and error handling section (two-level error table: core + domain)

### Fixed
- **`publicInterceptor`** — `defaultLanguage` option in ngx-translate v17 did not activate the language; replaced with `lang: 'en'` + `fallbackLang: 'en'`
- **i18n assets path** — double-nested `assets/assets/i18n/` corrected to `assets/i18n/`
- **Login error message** — invalid credentials now correctly shows `errors.auth.invalid_credentials` instead of `errors.unknown`

---

## [2.3.0] — 2026-03-13

### Added
- **`justfile`** — centralizes project setup with `just setup` (nvm use + npm install), `just start`, `just test`, `just coverage`, `just lint`, `just format`
- **`.nvmrc`** — pins Node.js version to `25.6.1`
- **`.vscode/settings.json`** — workspace settings: Prettier as default formatter, `formatOnSave`, `autoSave` on focus change

### Changed
- **ESLint** — updated `.eslintrc.json`: `no-explicit-any` promoted to `error`, added `varsIgnorePattern: "^_"` to `no-unused-vars`, expanded `no-console` allow list to include `info` and `log`, added explicit `prettier/prettier: error` rule, enforced `prefer-standalone: error` and `prefer-inject: error`, added `plugin:prettier/recommended` to HTML overrides with `click-events-have-key-events` and `interactive-supports-focus` disabled
- **lint-staged** — `prettier --check` replaced with `prettier --write` for `*.{scss,css,json}` (auto-fix on commit), uses `./node_modules/.bin/eslint` to avoid picking up globally installed ESLint versions
- **`assets/`** relocated from `src/assets/` to `src/core/assets/` to keep all framework-agnostic resources inside `core`
- **README** — updated Quick Start to use `just`, added DTO/DBO pattern section, updated folder structure, commands table and quality section

### Fixed
- **lint target** added to `angular.json` — `ng lint` was missing the `@angular-eslint/builder:lint` target
- **Broken imports** in test files updated to new DTO split paths (`remote/dto/product.dto`, `remote/dto/products.dto`) and DBO paths (`local/dbo/products.dbo`)
- **`PRODUCTS_CACHE_TTL_MS`** exported from `products.dbo.ts` and removed duplicate declaration from `products-local.datasource.imp.ts`
- **Prettier errors** across presentation, data and domain layers fixed

---

## [2.2.0] — 2026-03-12

### Added
- **DBO layer** — introduced Database Objects (`ProductDbo`, `ProductsDbo`, `TokensDbo`) as dedicated local storage models, decoupling the remote DTO structure from the local cache format
- **`product-dbo-to-entity.mapper.ts`** — maps `ProductDbo` / `ProductsDbo` to domain entities (`ProductEntity` / `ProductsEntity`)
- **`auth-dbo-to-entity.mapper.ts`** — maps `TokensDbo` to `TokensEntity` (`TokensDboToEntityMapper`)
- **`ProductDboToEntityMapper` + `TokensDboToEntityMapper`** registered in `provideProductsDI()` and `provideAuthDI()`

### Changed
- **DTO files split** — `product.dto.ts` split into `product.dto.ts` (`ProductDto`) and `products.dto.ts` (`ProductsDto`), consistent with DBO naming convention
- **DTOs relocated** inside `remote/dto/` — `products/remote/dto/`, `auth/remote/dto/`; DTOs are now exclusively owned by the remote datasource
- **DBOs located** inside `local/dbo/` — `products/local/dbo/`, `auth/local/dbo/`; DBOs are exclusively owned by the local datasource
- **`ProductsLocalDataSource`** contract updated: `getProducts` / `saveProducts` now use `ProductsDbo` instead of `ProductsDto`
- **`AuthLocalDataSource`** contract updated: `saveTokens` now accepts `TokensDbo` instead of `TokensEntity`
- **`ProductsImpRepository`** uses `ProductDboToEntityMapper` for cache reads; builds `ProductsDbo` (with `cachedAt`) before writing to local storage
- **`AuthImpRepository`** uses `TokensDboToEntityMapper` to convert entities to DBO before persisting tokens
- **`cachedAt`** moved from the `CachedProducts` wrapper into `ProductsDbo` directly

### Removed
- `src/data/datasource/products/local/models/cached-products.model.ts` — replaced by `ProductsDbo.cachedAt`

---

## [2.1.0] — 2026-03-10

### Added
- **Typed error handling** — `AppError` base class and subclasses: `NetworkError`, `UnauthorizedError`, `NotFoundError`, `ServerError` (`src/core/errors/app-error.ts`)
- **Cache TTL** — `ProductsLocalDataSourceImp` stores `{ data, cachedAt }` and auto-invalidates after 1 hour (`PRODUCTS_CACHE_TTL_MS`)
- **i18n** — integrated `@ngx-translate/core` v17; translation file at `src/assets/i18n/en.json`
- **Full test suite** — Vitest coverage across all layers: core (pipes, utils, directives, errors), data (mapper, cache, repository), domain (usecases), presentation (viewmodels)

### Changed
- **Interceptor** now maps HTTP status codes to typed `AppError` subclasses instead of generic `Error` (401 → `UnauthorizedError`, 404 → `NotFoundError`, 0 → `NetworkError`, 5xx → `ServerError`)
- **UseCases** wrap repository errors with business-context `AppError` via `catchError` — `GetProductsUseCase`, `GetProductUseCase`, `LoginUseCase`, `GetAuthUserUseCase`
- **Viewmodels** store `err.messageKey` (i18n key) instead of translated strings
- **Templates** use `| translate` from ngx-translate — `ProductsHeader`, `ProductInfo`, `UserProfileCard`, `DetailHeader`, error components
- **Domain generator templates** — fixed source file naming convention, mapper filenames, removed duplicate `StorageSource` registration from DI template

### Removed
- `src/core/utils/check-empty-object.util.ts` — unused utility

---

## [2.0.0] — 2026-03-01

Full rewrite of the architecture template. Migrated from Angular 19 + NgModules + Jest to Angular 21 + Standalone + Vitest. Changed demo domain from Rick & Morty to a Products + Auth system.

### Added
- **Angular 21.2** with standalone components, no NgModules
- **Zoneless change detection** — `provideZonelessChangeDetection()`, Zone.js removed
- **Signals-based state** — `ProductsState`, `ProductDetailState`, `LoginState`, `UserDetailState` using `signal()` and `computed()`
- **Vitest** as test runner via `@angular/build:unit-test` (replaces Jest + jest-preset-angular)
- **Tailwind CSS v4** via `@tailwindcss/postcss` with `@import "tailwindcss"` in `styles.css` (replaces v3 + `tailwind.config.js`)
- **Products feature** — list with search + infinite scroll, product detail view
- **Auth feature** — login, profile, `AuthGuard`, `GuestGuard`, token refresh
- **Private/Public layouts** with lazy-loaded route groups
- **`publicInterceptor` + `authInterceptor`** — Bearer token injection, error handling
- **`ProductsLocalDataSourceImp`** — local cache backed by `LocalStorageService`
- **`ProductDtoToEntityMapper`** — DTO → Entity transformation
- **DI per route** — `provideProductsDI()`, `provideAuthDI()` scoped to route providers (replaces global NgModule DI)
- **`DetailHeader`** — shared reusable component
- **`ImgFallbackDirective`** — replaces broken images with transparent placeholder
- **`PricePipe`** — formats number as `$0.00`
- **`calcOriginalPrice`** util — derives pre-discount price
- **Native infinite scroll** via `IntersectionObserver` + `viewChild<ElementRef>('sentinel')` + `effect()` (replaces `ngx-infinite-scroll` library)
- **Path aliases** — `@models/*`, `@usecases/*`, `@repositories/*`, `@data/*`, `@views/*`, `@pipes/*`, `@directives/*`, `@guards/*`, `@interceptors/*`
- **Domain code generator** — `npm run domain` scaffolds full domain layer from Mustache templates
- **ESLint + Prettier + Husky** pre-commit hooks

### Changed
- Component naming convention: `app.ts` instead of `app.component.ts`
- Bootstrap: standalone `bootstrapApplication()` + `app.config.ts` replaces `AppModule` + `platformBrowserDynamic()`
- Routing: lazy-loaded standalone components instead of NgModule-based lazy routes

### Removed
- `NgModule` pattern — fully replaced by standalone components
- `Zone.js` dependency
- `ngx-infinite-scroll` library — replaced by native `IntersectionObserver`
- `BehaviorSubject` for state — replaced by signals
- `.component.ts` file naming suffix

---

## [1.1.0] — 2025-06-01

### Added
- **Angular 19** with NgModule-based architecture
- **Jest 29** + `jest-preset-angular` as test runner
- **Tailwind CSS v3** with `tailwind.config.js` and SCSS
- **Zone.js 0.15** for change detection
- **Rick & Morty API** integration (`https://rickandmortyapi.com/api/`)
- **Characters feature** — paginated list with real-time name filter
- **Infinite scroll** via `ngx-infinite-scroll` library + `@HostListener('window:scroll')`
- **`FilterCharactersByNamePipe`** — client-side character search
- **`SecurePipe`** — secure image loading with Bearer token header
- **`DtoToEntityRepositoryMapper` + `DboToEntityRepositoryMapper`** — dual mapper pattern
- **`GetHasNextAndCharactersUseCase`** — pagination-aware usecase
- **Local datasource** with DBO model (local storage structure)
- **Domain code generator** — `npm run domain` via Mustache templates
- **`check-empty-object` util** — object validation helper
- Initial test suite for `core-interface` (UseCase, Mapper, Request) and utils
