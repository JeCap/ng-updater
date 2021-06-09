// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    // [
    //   "jest-html-reporters",
    //   {
    //     publicPath: "./reports",
    //     filename: "test.report.html",
    //     expand: true,
    //     openReport: false,
    //   },
    // ],
  ],
  coverageProvider: 'babel',
  collectCoverage: false,
  coverageReporters: ['json', 'lcov', 'text'],
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
