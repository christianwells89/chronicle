// eslint-disable-next-line import/no-extraneous-dependencies
import { Config } from '@jest/types';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['./components', './lib', './pages'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(jestConfig);
