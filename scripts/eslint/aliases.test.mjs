import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import { ESLint } from 'eslint';

const root = fileURLToPath(new URL('../../', import.meta.url));
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
assert.equal(config.error, undefined);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
assert.deepEqual(parsed.errors, []);
const eslint = new ESLint();
// Explicit expected destinations catch aliases silently redirected to another layer.
const aliases = [
  ['src/*', 'core/http/request', 'src/core/http/request.ts'],
  ['@directives/*', 'img-fallback.directive', 'src/core/directives/img-fallback.directive.ts'],
  ['@guards/*', 'auth.guard', 'src/core/guards/auth.guard.ts'],
  ['@interceptors/*', 'auth.interceptor', 'src/core/interceptors/auth.interceptor.ts'],
  [
    '@interfaces/*',
    'error/error-handling-context.interface',
    'src/core/models/interfaces/error/error-handling-context.interface.ts',
  ],
  ['@pipes/*', 'price.pipe', 'src/core/pipes/price.pipe.ts'],
  ['@utils/*', 'calc-original-price.util', 'src/core/utils/calc-original-price.util.ts'],
  [
    '@data/*',
    'repositories/products/products.repository.imp',
    'src/data/repositories/products/products.repository.imp.ts',
  ],
  ['@di/*', 'products/products.di', 'src/data/di/products/products.di.ts'],
  [
    '@models/*',
    'products/product-entity.model',
    'src/domain/entities/products/product-entity.model.ts',
  ],
  [
    '@repositories/*',
    'products/products.repository',
    'src/domain/repositories/products/products.repository.ts',
  ],
  [
    '@usecases/*',
    'products/get-products.usecase',
    'src/domain/usecases/products/get-products.usecase.ts',
  ],
  [
    '@layouts/*',
    'public-layout/public-layout',
    'src/presentation/app/layouts/public-layout/public-layout.ts',
  ],
  [
    '@views/*',
    'products-list-view/products-list-view',
    'src/presentation/app/views/products-list-view/products-list-view.ts',
  ],
  [
    '@shared/*',
    'components/detail-header/detail-header',
    'src/presentation/shared/components/detail-header/detail-header.ts',
  ],
  ['@environments/*', 'environment', 'src/core/config/environments/environment.ts'],
];

test('all configured aliases have architecture regression coverage', () => {
  assert.deepEqual(
    aliases.map(([alias]) => alias).sort(),
    Object.keys(parsed.options.paths).sort(),
  );
});
for (const [alias, suffix, expected] of aliases) {
  const specifier = alias.replace('*', suffix);
  test(`${alias} resolves to ${expected}`, () => {
    for (const tsconfig of ['tsconfig.app.json', 'tsconfig.spec.json']) {
      const source = ts.readConfigFile(path.join(root, tsconfig), ts.sys.readFile);
      const options = ts.parseJsonConfigFileContent(source.config, ts.sys, root).options;
      const resolved = ts.resolveModuleName(
        specifier,
        path.join(root, 'src/main.ts'),
        options,
        ts.sys,
      ).resolvedModule;
      assert.ok(resolved, `${tsconfig}: ${specifier} must resolve`);
      assert.equal(resolved.resolvedFileName, path.join(root, expected));
      assert.equal(resolved.isExternalLibraryImport, false);
    }
  });
  test(`${alias} respects domain boundaries in ESLint`, async () => {
    const [result] = await eslint.lintText(`import '${specifier}';`, {
      filePath: 'src/domain/entities/alias-probe.ts',
    });
    const errors = result.messages.filter((message) => message.severity === 2);
    const allowed = expected.startsWith('src/domain/');
    if (allowed) assert.deepEqual(errors, []);
    else {
      assert.ok(
        errors.some((message) => message.ruleId === 'boundaries/dependencies'),
        JSON.stringify(errors),
      );
      assert.equal(
        errors.some((message) => message.fatal),
        false,
      );
    }
  });
}
