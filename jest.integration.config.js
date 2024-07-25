const base = require('./jest.base.config')

module.exports = {
  ...base,
  testMatch: [
    '**/*.integration.js',
  ],
  testEnvironment: 'node',
  maxWorkers: 1,
  passWithNoTests: true,
}
