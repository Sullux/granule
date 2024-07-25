// Global Jest Configuration

const base = require('./jest.base.config')// eslint-disable-line import/no-unresolved

module.exports = {
  ...base,
  moduleDirectories: [
    'node_modules',
  ],
  // collectCoverage: true,
  // coverageDirectory: './coverage/jest',
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  // coverageThreshold: {
  //   global: {
  //     statements: 100,
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //   },
  // },
}
