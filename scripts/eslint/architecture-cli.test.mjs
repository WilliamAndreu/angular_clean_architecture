import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const cli = path.join(path.dirname(require.resolve('eslint/package.json')), 'bin/eslint.js');

test('ESLint CLI rejects violations in real files and barrels', async (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), 'architecture-lint-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  function write(file, contents) {
    const target = path.join(fixture, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
  // Copy the actual config, with the installed dependencies. The CLI runs in an
  // isolated project so both aliases and relative paths resolve real files.
  symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  copyFileSync(path.join(root, 'eslint.config.mjs'), path.join(fixture, 'eslint.config.mjs'));
  mkdirSync(path.join(fixture, 'scripts/eslint'), { recursive: true });
  copyFileSync(
    path.join(root, 'scripts/eslint/architecture.mjs'),
    path.join(fixture, 'scripts/eslint/architecture.mjs'),
  );
  write(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        paths: {
          'src/*': ['./src/*'],
          '@di/*': ['./src/data/di/*'],
          '@repositories/*': ['./src/domain/repositories/*'],
          '@usecases/*': ['./src/domain/usecases/*'],
        },
      },
    }),
  );
  const files = {
    'src/main.ts': "import './presentation/app/app';",
    'src/domain/entities/product.ts': "export const product = 'product';",
    'src/domain/repositories/product.repository.ts':
      'export interface ProductRepository { name: string; }',
    'src/domain/usecases/product.usecase.ts':
      "export type { ProductRepository } from '@repositories/product.repository';",
    'src/data/repositories/product.repository.imp.ts': "export const repository = 'data';",
    'src/data/di/products/products.di.ts': "export * from '@usecases/product.usecase';",
    'src/data/di/products/helper.ts': "export const helper = 'helper';",
    'src/core/services/error-handling/source/error-handling.source.ts':
      'export interface ErrorHandlingSource { message: string; }',
    'src/core/services/error-handling/source/helper.ts': "export const helper = 'private helper';",
    'src/presentation/app/app.ts': "export const app = 'app';",
    'src/presentation/app/app.config.ts': "import '@di/products/products.di';",
    'src/presentation/app/view.ts': "import '@usecases/product.usecase';",
    'src/presentation/shared/barrel.ts': "export * from 'src/domain/entities/product';",
  };
  for (const [file, content] of Object.entries(files)) write(file, content);
  const mutations = [
    [
      'relative layer import',
      'src/domain/entities/product.ts',
      "import '../../data/repositories/product.repository.imp';",
      'boundaries/dependencies',
    ],
    [
      'type import via alias',
      'src/presentation/app/view.ts',
      "export type Probe = import('@repositories/product.repository').ProductRepository;",
      'boundaries/dependencies',
    ],
    [
      'barrel re-export',
      'src/presentation/shared/barrel.ts',
      "export * from 'src/data/repositories/product.repository.imp';",
      'boundaries/dependencies',
    ],
    [
      'bootstrap bypass',
      'src/main.ts',
      "import '@di/products/products.di';",
      'boundaries/dependencies',
    ],
    [
      'DI helper bypass',
      'src/data/di/products/helper.ts',
      "import '@usecases/product.usecase';",
      'boundaries/dependencies',
    ],
    [
      'composition root imports DI helper',
      'src/presentation/app/app.config.ts',
      "import '@di/products/helper';",
      'boundaries/dependencies',
    ],
    [
      'UI imports helper beside public contract',
      'src/presentation/app/view.ts',
      "import 'src/core/services/error-handling/source/helper';",
      'boundaries/dependencies',
    ],
    [
      'unknown layer',
      'src/other/probe.ts',
      'export const probe = true;',
      'boundaries/no-unknown-files',
    ],
  ];
  function run() {
    const result = spawnSync(process.execPath, [cli, 'src', '--format', 'json'], {
      cwd: fixture,
      encoding: 'utf8',
      timeout: 30_000,
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    return result;
  }
  await t.test('valid project exits with status 0', () => {
    const result = run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.stderr, '');
  });
  for (const [name, file, content, ruleId] of mutations) {
    await t.test(name, () => {
      write(file, content);
      try {
        const result = run();
        assert.equal(result.status, 1, result.stdout + result.stderr);
        const reports = JSON.parse(result.stdout);
        const report = reports.find((entry) => entry.filePath === path.join(fixture, file));
        assert.ok(
          report?.messages.some((message) => message.ruleId === ruleId),
          result.stdout,
        );
        assert.equal(
          reports.some((entry) => entry.fatalErrorCount),
          false,
          result.stdout,
        );
      } finally {
        if (file in files) write(file, files[file]);
        else rmSync(path.join(fixture, file));
      }
    });
  }
});
