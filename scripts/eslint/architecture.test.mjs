import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';

const eslint = new ESLint();
const domain = 'src/domain/entities/products/architecture-probe.ts';
const view = 'src/presentation/app/views/products-list-view/architecture-probe.ts';
const data = 'src/data/repositories/products/architecture-probe.ts';
const app = 'src/presentation/app/app.config.ts';
const routes = 'src/presentation/app/app.routes.ts';
const di = 'src/data/di/products/architecture-probe.di.ts';
const usecase = '@usecases/products/get-products.usecase';
const repository = '@repositories/products/products.repository';
const storage = 'src/core/services/storage/source/storage.source';
const provider = '@di/products/products.di';
const probes = [
  ['domain → RxJS network', domain, "import 'rxjs/ajax';", true],
  [
    'domain → inline allowed type',
    domain,
    "export type Probe = import('@models/products/product-entity.model').ProductEntity;",
    false,
  ],
  [
    'presentation → inline use case type',
    view,
    `export type Probe = typeof import('${usecase}');`,
    false,
  ],
  [
    'routes → dynamic view',
    routes,
    "void import('@views/products-list-view/products-list-view');",
    false,
  ],
  [
    'presentation → computed template',
    view,
    "const section = 'products'; void import(`@di/${section}/products.di`);",
    true,
    'no-restricted-syntax',
  ],
  ['data → presentation', data, "import 'src/presentation/app/app';", true],
  [
    'core → presentation',
    'src/core/utils/architecture-probe.ts',
    "import 'src/presentation/app/app';",
    true,
  ],
  [
    'repository → infrastructure',
    'src/domain/repositories/architecture-probe.ts',
    "import 'src/core/http/request';",
    true,
  ],
  [
    'use case → Angular',
    'src/domain/usecases/architecture-probe.ts',
    "import '@angular/core';",
    true,
  ],
  ['domain → optional browser call', domain, 'globalThis.fetch?.("/");', true],
  ['domain → computed browser member', domain, 'globalThis["fetch"]("/");', true],
  ['presentation → optional storage', view, 'window.localStorage?.clear();', true],
  ['presentation → browser UI API', view, 'document.title = "Products";', false],
  [
    'domain → local variable called document',
    domain,
    'export function read(document: string) { return document; }',
    false,
  ],
  ['tests → HTTP', 'src/tests/architecture-probe.ts', "import '@angular/common/http';", false],
  ['bootstrap → HTTP', 'src/main.ts', "import '@angular/common/http';", false],

  ['domain → RxJS subpath', domain, "import 'rxjs/operators';", false],
  [
    'presentation → inline import type',
    view,
    `export type Probe = import('${repository}').ProductsRepository;`,
    true,
  ],
  ['presentation → typeof import', view, `export type Probe = typeof import('${provider}');`, true],
  ['presentation → import equals', view, `import _Probe = require('${repository}');`, true],
  [
    'presentation → template import',
    view,
    'void import(`@di/products/products.di`);',
    true,
    'no-restricted-syntax',
  ],
  [
    'presentation → computed import',
    view,
    "const modulePath = '@di/products/products.di'; void import(modulePath);",
    true,
    'no-restricted-syntax',
  ],
  [
    'domain → dynamic type Angular',
    domain,
    "export type Probe = import('@angular/core').Signal<string>;",
    true,
  ],
  [
    'data helper in DI folder → use case',
    'src/data/di/products/helper.ts',
    `import '${usecase}';`,
    true,
  ],
  ['data implementation → DI', data, `import '${provider}';`, true],
  [
    'public routes → guard',
    'src/presentation/app/layouts/public-layout/public-layout.routes.ts',
    "import '@guards/auth.guard';",
    false,
  ],
  [
    'private routes → guard',
    'src/presentation/app/layouts/private-layout/private-layout.routes.ts',
    "import '@guards/auth.guard';",
    false,
  ],
  [
    'unregistered layout → guard',
    'src/presentation/app/layouts/new-layout/new-layout.routes.ts',
    "import '@guards/auth.guard';",
    true,
  ],
  ['bootstrap → data', 'src/main.ts', `import '${provider}';`, true],
  ['bootstrap → presentation', 'src/main.ts', "import './presentation/app/app';", false],
  [
    'unknown layer cannot be ignored',
    'src/other/architecture-probe.ts',
    'export const probe = true;',
    true,
    'boundaries/no-unknown-files',
  ],
  [
    'domain business field named document',
    domain,
    'export function read(entity: { document: string }) { return entity.document; }',
    false,
  ],
  [
    'presentation business method named fetch',
    view,
    'export function read(entity: { fetch(): string }) { return entity.fetch(); }',
    false,
  ],
  [
    'domain → browser destructuring',
    domain,
    'const { fetch: request } = globalThis; void request;',
    true,
  ],
  [
    'presentation → browser destructuring',
    view,
    'const { localStorage: storage } = window; void storage;',
    true,
  ],
  ['domain → built-in Node API', domain, "import 'node:fs';", true],
  ['presentation → environment alias', view, "import '@environments/environment';", true],
  [
    'presentation → named re-export',
    view,
    `export { ProductsRepository } from '${repository}';`,
    true,
  ],
  [
    'presentation → type re-export',
    view,
    `export type { ProductsRepository } from '${repository}';`,
    true,
  ],
  [
    'presentation → HTTP re-export',
    view,
    "export { HttpClient } from '@angular/common/http';",
    true,
  ],
  [
    'presentation → notification contract',
    view,
    "import 'src/core/services/error-notification/source/error-notification.source';",
    false,
  ],
  [
    'presentation → reporter contract',
    view,
    "import 'src/core/services/error-reporting/source/error-reporter.source';",
    true,
  ],
  [
    'app config → direct datasource',
    app,
    "import '@data/datasource/products/remote/products-remote.datasource.imp';",
    true,
  ],
  ['app config → test helper', app, "import 'src/tests/fixtures';", true],

  ['domain → entity', domain, "import '@models/products/product-entity.model';", false],
  ['domain → RxJS', domain, "import 'rxjs';", false],
  ['domain → Angular', domain, "import '@angular/core';", true],
  ['domain → dynamic Angular', domain, "void import('@angular/core');", true],
  ['domain → data alias', domain, `import '${provider}';`, true],
  ['domain → core relative', domain, "import '../../../core/http/request';", true],
  ['domain → presentation re-export', domain, "export * from 'src/presentation/app/app';", true],
  ['presentation → use case', view, `import '${usecase}';`, false],
  ['presentation → repository', view, `import '${repository}';`, true],
  [
    'presentation → repository type',
    view,
    `import type { ProductsRepository as _Repository } from '${repository}';`,
    true,
  ],
  ['presentation → repository re-export', view, `export * from '${repository}';`, true],
  ['presentation → dynamic data', view, `void import('${provider}');`, true],
  [
    'presentation → data relative',
    view,
    "import '../../../../data/di/products/products.di';",
    true,
  ],
  ['presentation → HTTP', view, "import '@angular/common/http';", true],
  ['presentation → dynamic HTTP', view, "void import('@angular/common/http');", true],
  ['presentation → core HTTP', view, "import 'src/core/http/request';", true],
  ['presentation → storage contract', view, `import '${storage}';`, true],
  [
    'presentation → public error contract',
    view,
    "import 'src/core/services/error-handling/source/error-handling.source';",
    false,
  ],
  [
    'presentation → error implementation',
    view,
    "import 'src/core/services/error-handling/error-handling.service.imp';",
    true,
  ],
  ['presentation → guards', view, "import '@guards/auth.guard';", true],
  ['routes → guards', routes, "import '@guards/auth.guard';", false],
  ['routes → data', routes, `import '${provider}';`, true],
  ['app config → DI', app, `import '${provider}';`, false],
  ['app config → HTTP', app, "import '@angular/common/http';", false],
  [
    'app config → repository implementation',
    app,
    "import '@data/repositories/products/products.repository.imp';",
    true,
  ],
  ['data → repository', data, `import '${repository}';`, false],
  ['data → use case', data, `import '${usecase}';`, true],
  ['DI → use case', di, `import '${usecase}';`, false],
  ['core → data', 'src/core/utils/architecture-probe.ts', `import '${provider}';`, true],
  ['application → tests', view, "import 'src/tests/fixtures';", true],
  ['tests → data', 'src/tests/architecture-probe.ts', `import '${provider}';`, false],
  ['domain → browser global', domain, 'window.alert();', true],
  ['domain → qualified browser API', domain, 'globalThis.fetch("/");', true],
  ['presentation → storage global', view, 'localStorage.clear();', true],
  ['presentation → qualified storage', view, 'window.localStorage.clear();', true],
];
for (const [name, filePath, code, forbidden, expectedRule] of probes) {
  test(name, async () => {
    const [result] = await eslint.lintText(code, { filePath });
    const errors = result.messages.filter((message) => message.severity === 2);
    assert.equal(
      errors.some((message) => message.fatal),
      false,
      JSON.stringify(errors),
    );
    const expected =
      expectedRule ?? (/\b(import|from)\b/.test(code) ? 'boundaries/dependencies' : undefined);
    const architectureErrors = errors.filter((message) =>
      expected ? message.ruleId === expected : message.ruleId?.startsWith('no-restricted-'),
    );
    assert.equal(architectureErrors.length > 0, forbidden, JSON.stringify(errors, null, 2));
    if (!forbidden) assert.deepEqual(errors, []);
  });
}
