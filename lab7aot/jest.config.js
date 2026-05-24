module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.js$': 'babel-jest' },
  moduleNameMapper: {
    '^puppeteer$': '<rootDir>/__mocks__/puppeteer.js'
  }
};
