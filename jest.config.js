/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: "node",
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@environments/(.*)': '<rootDir>/src/environments/$1',
    '@utils/(.*)': '<rootDir>/src/core/utils/$1',
    '@interface-core/(.*)': '<rootDir>/src/core/core-interface/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-test|@ngrx|@angular|rxjs)/)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/src/test.ts'],
  collectCoverageFrom: [
    './src/**',
  ],
  "coveragePathIgnorePatterns" : [
    "<rootDir>/src/index.html",
    "<rootDir>/src/main.ts",
    "<rootDir>/src/test.ts",
    "<rootDir>/src/polyfills.ts"
  ]

};
