module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup-tests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '.(scss|css|sass)': 'identity-obj-proxy',
    'components/(.+)$': '<rootDir>/src/components/$1',
    'services/(.+)$': '<rootDir>/src/services/$1',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': `<rootDir>/src/tests/__mocks__/fileMock.js`
  }
}
