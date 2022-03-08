module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testMatch: ['src/*.test.ts', 'src/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/', '/dist/'],
  moduleNameMapper: {
    '@components/(.*)': ['<rootDir>/src/ui/components/$1'],
    '@hooks/(.*)': ['<rootDir>/src/ui/hooks/$1'],
    '@modules/(.*)': ['<rootDir>/src/ui/modules/$1'],
    '@sdk': ['<rootDir>/src/sdk/generated_ts'],
  },
};
