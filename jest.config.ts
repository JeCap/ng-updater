// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage',
        filename: 'test-report.html',
        expand: true,
        openReport: false,
      },
    ],
  ],
  coverageProvider: 'babel',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text'],
  coveragePathIgnorePatterns: ['node_modules', 'types.ts'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
export default config;
