import boundaries from 'eslint-plugin-boundaries';
import { fileURLToPath } from 'node:url';

// More specific folders must precede their enclosing layers.
const elements = [
  ['repository', 'src/domain/repositories'],
  ['usecase', 'src/domain/usecases'],
  ['domain', 'src/domain'],
  ['di', 'src/data/di'],
  ['data', 'src/data'],
  ['ui-service', 'src/core/services/error-handling/source'],
  ['ui-service', 'src/core/services/error-notification/source'],
  ['guard', 'src/core/guards'],
  ...['http', 'mappers', 'config', 'interceptors', 'services', 'handlers'].map((folder) => [
    'infrastructure',
    `src/core/${folder}`,
  ]),
  ['core', 'src/core'],
  ['presentation', 'src/presentation'],
  ['tests', 'src/tests'],
];
const domain = ['domain', 'repository', 'usecase'];
const core = ['core', 'infrastructure', 'guard', 'ui-service'];
const all = [...domain, ...core, 'data', 'di', 'presentation', 'tests'];
const allowed = {
  domain,
  repository: domain,
  usecase: domain,
  core: [...core, ...domain],
  infrastructure: [...core, ...domain],
  guard: [...core, ...domain],
  'ui-service': [...core, ...domain],
  data: ['data', ...core, 'domain', 'repository'],
  di: ['data', 'di', ...core, 'domain', 'repository'],
  presentation: ['presentation', 'core', 'domain', 'usecase'],
  tests: all,
};
const selector = (types) => ({ element: { types: { anyOf: types } } });
const category = (name) => ({ file: { categories: name } });
const routes = [
  'src/presentation/app/app.routes.ts',
  'src/presentation/app/layouts/public-layout/public-layout.routes.ts',
  'src/presentation/app/layouts/private-layout/private-layout.routes.ts',
];
const publicContracts = [
  'src/core/services/error-handling/source/error-handling.source.ts',
  'src/core/services/error-notification/source/error-notification.source.ts',
];
const httpSource = { source: ['@angular/common/http', '@angular/common/http/**'] };
const forbiddenBrowser = [
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'fetch',
  'XMLHttpRequest',
];
const forbiddenIO = ['localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest'];
function browserRules(globals) {
  return {
    'no-restricted-globals': ['error', ...globals],
    // Restrict browser objects, not business fields such as entity.document.
    'no-restricted-properties': [
      'error',
      ...['globalThis', 'window', 'self'].flatMap((object) =>
        globals.map((property) => ({ object, property })),
      ),
    ],
  };
}
export default [
  {
    files: ['src/**/*.ts'],
    plugins: { boundaries },
    settings: {
      'boundaries/root-path': fileURLToPath(new URL('../../', import.meta.url)),
      'boundaries/elements': elements.map(([type, pattern]) => ({
        type,
        pattern,
        partialMatch: false,
      })),
      'boundaries/files': [
        { pattern: 'src/main.ts', category: 'bootstrap' },
        { pattern: 'src/presentation/app/app.config.ts', category: 'composition-root' },
        { pattern: routes, category: 'routes' },
        { pattern: 'src/data/di/**/*.di.ts', category: 'di-registration' },
        { pattern: publicContracts, category: 'public-ui-contract' },
      ],
      'boundaries/additional-dependency-nodes': [
        { selector: 'TSImportType > Literal', kind: 'type', name: 'typescript-import-type' },
        {
          selector: 'TSExternalModuleReference > Literal',
          kind: 'value',
          name: 'typescript-import-equals',
        },
      ],
      'import/resolver': { typescript: { project: './tsconfig.json' } },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          checkInternals: true,
          checkAllOrigins: true,
          checkUnknownLocals: true,
          policies: [
            {
              from: [selector(all.filter((type) => !domain.includes(type))), category('bootstrap')],
              allow: { to: { module: { origin: ['external', 'core'] } } },
            },
            {
              from: selector(domain),
              allow: {
                to: { module: { origin: 'external', source: 'rxjs' } },
                dependency: { source: ['rxjs', 'rxjs/operators'] },
              },
            },
            ...Object.entries(allowed).map(([from, to]) => ({
              from: selector([from]),
              allow: { to: selector(to) },
            })),
            { from: category('bootstrap'), allow: { to: selector(['presentation', 'core']) } },
            { from: category('di-registration'), allow: { to: selector(['usecase']) } },
            { from: selector(['presentation']), allow: { to: category('public-ui-contract') } },
            { from: category('routes'), allow: { to: selector(['guard']) } },
            {
              from: category('composition-root'),
              allow: { to: [selector(core), category('di-registration')] },
            },
            { from: selector(['presentation']), disallow: { dependency: httpSource } },
            { from: category('composition-root'), allow: { dependency: httpSource } },
          ],
        },
      ],
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown-dependencies': 'error',
      // Computed module paths cannot be checked reliably; use literal strings.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportExpression[source.type!="Literal"]',
          message: 'Use a string literal in import() so architecture boundaries can be checked.',
        },
      ],
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      ...browserRules(forbiddenBrowser),
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!rxjs(?:/|$)|\\.|src/|@models/|@repositories/|@usecases/).+',
              message: 'Domain only permits local domain modules and RxJS.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/presentation/**/*.ts'],
    rules: {
      ...browserRules(forbiddenIO),
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/common/http', '@angular/common/http/**'],
              message: 'HTTP belongs to the data infrastructure.',
            },
          ],
        },
      ],
    },
  },
  { files: ['src/presentation/app/app.config.ts'], rules: { 'no-restricted-imports': 'off' } },
];
